import { NextRequest, NextResponse } from 'next/server';
import { careerGuruChat, CareerGuruChatInput } from '@/ai/flows/career-guru-chat';
import { streamingManager } from '@/lib/streaming-response';
import { cacheManager } from '@/lib/cache-manager';
import { trackPerformance } from '@/lib/performance-monitor';

export async function POST(request: NextRequest) {
  try {
    const input: CareerGuruChatInput = await request.json();

    // Validate input
    if (!input.message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    return trackPerformance('streamingAPI', async () => {
      // Check cache first
      const cachedResponse = cacheManager.get(input.message, input.userProfile);
      
      if (cachedResponse) {
        // Stream cached response immediately
        const stream = streamingManager.createSSEStream(cachedResponse, true);
        
        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      // Get AI response and stream it
      const response = await careerGuruChat(input);
      const stream = streamingManager.createSSEStream(response, false);

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }, {
      messageLength: input.message.length,
      hasProfile: !!input.userProfile,
      historyLength: input.conversationHistory?.length || 0,
      streaming: true
    });

  } catch (error) {
    console.error('Streaming API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process streaming request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}