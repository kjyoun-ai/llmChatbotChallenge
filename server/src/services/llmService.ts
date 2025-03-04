import OpenAI from 'openai';
import { Response } from 'express';
import { logError } from './loggerService';
import { businessContext } from '../data/businessContext';
import { WeatherService } from './weatherService';
import { LocationService } from './locationService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LLMResponse {
  content: string;
  metrics: {
    responseTime: number;
    tokenUsage: {
      prompt: number;
      completion: number;
    };
  };
}

interface IntentAnalysis extends LLMResponse {
  requiresWeather: boolean;
  requiresDirections: boolean;
  fromAddress: string | null;
}

interface ExtendedWeatherData {
  temperature: number;
  description: string;
  feelsLike: number;
  humidity: number;
}

export async function createChatCompletion(
  message: string,
  stream = false
): Promise<LLMResponse | AsyncGenerator<string, void, unknown>> {
  const startTime = Date.now();

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant for Boon Boona Coffee, knowledgeable about their products, services, and African coffee culture.',
    },
    {
      role: 'user',
      content: message,
    },
  ];

  try {
    if (stream) {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
      });

      async function* streamResponse() {
        for await (const chunk of response) {
          if (chunk.choices[0]?.delta?.content) {
            yield chunk.choices[0].delta.content;
          }
        }
      }

      return streamResponse();
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });

      const responseTime = Date.now() - startTime;

      return {
        content: response.choices[0]?.message?.content || '',
        metrics: {
          responseTime,
          tokenUsage: {
            prompt: response.usage?.prompt_tokens || 0,
            completion: response.usage?.completion_tokens || 0,
          },
        },
      };
    }
  } catch (error) {
    throw new Error(`LLM service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export class LLMService {
  private static instance: LLMService;
  private businessContext: string;
  private weatherService: WeatherService;
  private locationService: LocationService;

  private constructor() {
    this.businessContext = businessContext;
    this.weatherService = WeatherService.getInstance();
    this.locationService = LocationService.getInstance();
  }

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  private async analyzeIntent(message: string): Promise<IntentAnalysis> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              Analyze if the user's message requires weather or directions information.
              Respond in JSON format with the following structure:
              {
                "requiresWeather": boolean,
                "requiresDirections": boolean,
                "fromAddress": string or null (extract address if directions are needed),
                "response": "your response here"
              }
            `
          },
          { role: "user", content: message }
        ],
        temperature: 0.1,
        max_tokens: 200,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content || "{}";
      const parsedResponse = JSON.parse(response);

      return {
        content: parsedResponse.response,
        metrics: {
          responseTime: 0,
          tokenUsage: {
            prompt: completion.usage?.prompt_tokens || 0,
            completion: completion.usage?.completion_tokens || 0,
          },
        },
        requiresWeather: parsedResponse.requiresWeather,
        requiresDirections: parsedResponse.requiresDirections,
        fromAddress: parsedResponse.fromAddress
      };
    } catch (error) {
      logError({
        error: error as Error,
        context: {
          service: 'LLMService',
          method: 'analyzeIntent',
          message
        },
        timestamp: new Date()
      });
      throw error;
    }
  }

  public async processMessage(message: string, res?: Response): Promise<LLMResponse> {
    // First, analyze if we need weather or directions
    const intent = await this.analyzeIntent(message);
    let additionalContext = "";
    let totalPromptTokens = intent.metrics.tokenUsage.prompt;
    let totalCompletionTokens = intent.metrics.tokenUsage.completion;

    try {
      // Fetch weather data if needed
      if (intent.requiresWeather) {
        const weatherData = await this.weatherService.getCurrentWeather();
        const weather = weatherData as unknown as ExtendedWeatherData;
        additionalContext += `\nCurrent weather near the shop: ${weather.temperature}°F, ${weather.description}. Feels like ${weather.feelsLike}°F with ${weather.humidity}% humidity.`;
      }

      // Fetch directions if needed
      if (intent.requiresDirections && intent.fromAddress) {
        const directions = await this.locationService.getDirections(intent.fromAddress);
        additionalContext += `\nDirections from ${intent.fromAddress}: Distance: ${directions.distance}, Estimated time: ${directions.duration}.\nStep-by-step directions:\n${directions.directions}`;
      }

      // If we have a response object, we want to stream the response
      if (res) {
        const streamResponse = await createChatCompletion(message + additionalContext, true) as AsyncGenerator<string, void, unknown>;
        let fullContent = '';

        // Stream each chunk
        for await (const chunk of streamResponse) {
          fullContent += chunk;
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        return {
          content: fullContent,
          metrics: {
            responseTime: 0, // We don't track response time for streaming
            tokenUsage: {
              prompt: totalPromptTokens,
              completion: totalCompletionTokens
            }
          }
        };
      } else {
        // Get final response with all context (non-streaming)
        const finalResponse = await createChatCompletion(message + additionalContext, false) as LLMResponse;
        
        // Combine token usage from both calls
        totalPromptTokens += finalResponse.metrics.tokenUsage.prompt;
        totalCompletionTokens += finalResponse.metrics.tokenUsage.completion;

        return {
          content: finalResponse.content,
          metrics: {
            responseTime: finalResponse.metrics.responseTime,
            tokenUsage: {
              prompt: totalPromptTokens,
              completion: totalCompletionTokens
            }
          }
        };
      }
    } catch (error) {
      logError({
        error: error as Error,
        context: {
          service: 'LLMService',
          method: 'processMessage',
          message
        },
        timestamp: new Date()
      });
      throw error;
    }
  }

  public updateBusinessContext(newContext: string): void {
    this.businessContext = newContext;
  }
} 