/**
 * @fileOverview Streaming response system for CareerGuru chat
 * Provides real-time response streaming for immediate user feedback
 */

export interface StreamingChunk {
  type: 'start' | 'content' | 'suggestions' | 'actionItems' | 'complete' | 'error';
  content?: string;
  suggestions?: string[];
  actionItems?: string[];
  mood?: string;
  confidence?: number;
  error?: string;
}

export interface StreamingOptions {
  chunkSize: number;
  delayBetweenChunks: number;
  enableTypingEffect: boolean;
}

class StreamingResponseManager {
  private defaultOptions: StreamingOptions = {
    chunkSize: 15, // Words per chunk
    delayBetweenChunks: 50, // Milliseconds
    enableTypingEffect: true
  };

  /**
   * Stream a response in chunks for real-time display
   */
  async *streamResponse(
    response: any,
    options: Partial<StreamingOptions> = {}
  ): AsyncGenerator<StreamingChunk, void, unknown> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      // Start streaming
      yield { type: 'start' };

      // Stream main content
      if (response.response) {
        yield* this.streamText(response.response, opts);
      }

      // Stream suggestions
      if (response.suggestions && response.suggestions.length > 0) {
        yield {
          type: 'suggestions',
          suggestions: response.suggestions
        };
      }

      // Stream action items
      if (response.actionItems && response.actionItems.length > 0) {
        yield {
          type: 'actionItems',
          actionItems: response.actionItems
        };
      }

      // Complete streaming
      yield {
        type: 'complete',
        mood: response.mood,
        confidence: response.confidence
      };

    } catch (error) {
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Streaming error occurred'
      };
    }
  }

  /**
   * Stream text content in chunks
   */
  private async *streamText(
    text: string,
    options: StreamingOptions
  ): AsyncGenerator<StreamingChunk, void, unknown> {
    const words = text.split(' ');
    let currentChunk = '';
    let wordCount = 0;

    for (const word of words) {
      currentChunk += (wordCount > 0 ? ' ' : '') + word;
      wordCount++;

      if (wordCount >= options.chunkSize || word === words[words.length - 1]) {
        yield {
          type: 'content',
          content: currentChunk
        };

        // Add delay for typing effect
        if (options.enableTypingEffect && word !== words[words.length - 1]) {
          await this.delay(options.delayBetweenChunks);
        }

        currentChunk = '';
        wordCount = 0;
      }
    }
  }

  /**
   * Simulate instant response for cached content
   */
  async *streamCachedResponse(response: any): AsyncGenerator<StreamingChunk, void, unknown> {
    yield { type: 'start' };
    
    yield {
      type: 'content',
      content: response.response
    };

    if (response.suggestions) {
      yield {
        type: 'suggestions',
        suggestions: response.suggestions
      };
    }

    if (response.actionItems) {
      yield {
        type: 'actionItems',
        actionItems: response.actionItems
      };
    }

    yield {
      type: 'complete',
      mood: response.mood,
      confidence: response.confidence
    };
  }

  /**
   * Create a readable stream for server-sent events
   */
  createSSEStream(response: any, cached: boolean = false): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    const streamManager = this;

    return new ReadableStream({
      async start(controller) {
        try {
          const generator = cached 
            ? streamManager.streamCachedResponse(response)
            : streamManager.streamResponse(response);

          for await (const chunk of generator) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          controller.close();
        } catch (error) {
          const errorChunk: StreamingChunk = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Stream error'
          };
          const data = `data: ${JSON.stringify(errorChunk)}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        }
      }
    });
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Estimate streaming duration
   */
  estimateStreamingDuration(text: string, options: Partial<StreamingOptions> = {}): number {
    const opts = { ...this.defaultOptions, ...options };
    const wordCount = text.split(' ').length;
    const chunkCount = Math.ceil(wordCount / opts.chunkSize);
    return chunkCount * opts.delayBetweenChunks;
  }

  /**
   * Create optimized streaming options based on content
   */
  getOptimizedOptions(contentLength: number): StreamingOptions {
    if (contentLength < 100) {
      // Short responses - faster streaming
      return {
        chunkSize: 20,
        delayBetweenChunks: 30,
        enableTypingEffect: true
      };
    } else if (contentLength < 500) {
      // Medium responses - balanced streaming
      return {
        chunkSize: 15,
        delayBetweenChunks: 50,
        enableTypingEffect: true
      };
    } else {
      // Long responses - faster chunks to avoid delays
      return {
        chunkSize: 25,
        delayBetweenChunks: 40,
        enableTypingEffect: true
      };
    }
  }
}

// Global streaming manager instance
export const streamingManager = new StreamingResponseManager();

export default streamingManager;