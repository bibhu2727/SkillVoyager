'use client';

import { useRef, useEffect, memo, useMemo, useState } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, Lightbulb, ArrowUp, Zap, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useStreamingChat } from '@/hooks/use-streaming-chat';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { StreamingMessage } from '@/components/ui/streaming-message';
import { cn } from '@/lib/utils';

interface UserProfile {
  name?: string;
  currentRole?: string;
  careerGoals?: string;
  skills?: string[];
  experience?: string;
}

const STARTER_QUESTIONS = [
  "What career path should I pursue?",
  "How can I improve my resume?",
  "What skills should I learn next?",
  "How do I negotiate my salary?",
  "Should I change careers?",
  "How to prepare for interviews?"
];

const MOOD_COLORS = {
  supportive: 'bg-blue-100 text-blue-700 border-blue-200',
  motivational: 'bg-orange-100 text-orange-700 border-orange-200',
  analytical: 'bg-purple-100 text-purple-700 border-purple-200',
  friendly: 'bg-green-100 text-green-700 border-green-200',
  encouraging: 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

// Memoized components for performance
const MessageBubble = memo(({ message, onSuggestionClick }: { 
  message: any; 
  onSuggestionClick: (suggestion: string) => void;
}) => (
  <div className={cn(
    "flex gap-3",
    message.role === 'user' ? 'justify-end' : 'justify-start'
  )}>
    {message.role === 'assistant' && (
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    )}
    
    <div className={cn(
      "max-w-[80%] space-y-2",
      message.role === 'user' ? 'items-end' : 'items-start'
    )}>
      <Card className={cn(
        "shadow-sm transition-all duration-200",
        message.role === 'user' 
          ? 'bg-blue-600 text-white border-blue-600' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        message.isStreaming && 'animate-pulse'
      )}>
        <CardContent className="p-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {message.mood && message.role === 'assistant' && (
            <div className="mt-2 flex items-center gap-2">
              <Badge className={cn("text-xs", MOOD_COLORS[message.mood])}>
                {message.mood}
              </Badge>
              {message.confidence && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(message.confidence * 100)}% confident
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Items */}
      {message.actionItems && message.actionItems.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Lightbulb className="h-4 w-4" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {message.actionItems.map((item: string, index: number) => (
                <li key={index} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <ArrowUp className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.suggestions.map((suggestion: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-8 bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 transition-colors"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>

    {message.role === 'user' && (
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    )}
  </div>
));

MessageBubble.displayName = 'MessageBubble';

const TypingIndicator = memo(() => (
  <div className="flex gap-3 justify-start">
    <Avatar className="h-8 w-8 mt-1">
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="text-xs text-gray-800 dark:text-gray-300 ml-2">CareerGuru is thinking...</div>
        </div>
      </CardContent>
    </Card>
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';

export function CareerGuruChat() {
  const {
    messages,
    streamingState,
    sendMessage,
    isLoading,
    clearMessages,
    retryLastMessage,
    performanceStats
  } = useStreamingChat();

  const [inputMessage, setInputMessage] = useState('');
  const [userProfile] = useState<UserProfile>({});
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized values for performance
  const isFirstTime = useMemo(() => messages.length <= 1, [messages.length]);
  const hasError = useMemo(() => !!streamingState.error, [streamingState.error]);
  const responseTime = useMemo(() => 
    streamingState.responseTime > 0 
      ? `${(streamingState.responseTime / 1000).toFixed(2)}s` 
      : null, 
    [streamingState.responseTime]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingState.isStreaming]);

  useEffect(() => {
    // Welcome message with performance info
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant' as const,
        content: `Hey! 👋 I'm CareerGuru, your lightning-fast AI buddy! I'm optimized for speed and can chat about pretty much anything - though I'm especially awesome with career stuff.

**I can help with:**
• Career advice & planning 🚀
• Tech questions & coding help 💻
• Study tips & learning strategies 📚
• Life advice & problem-solving 💡
• Creative projects & brainstorming 🎨
• Industry insights & trends 📈
• And honestly, whatever else you need!

⚡ **Super fast responses** - I'm built for speed with smart caching and streaming!

No overthinking, just quick and helpful responses. What's up?`,
        timestamp: new Date().toISOString(),
        suggestions: STARTER_QUESTIONS.slice(0, 3),
        mood: 'friendly' as const,
        confidence: 0.95
      };
      // This will be handled by the hook's initialization
    }
  }, [messages.length]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    setInputMessage('');
    await sendMessage(messageToSend, userProfile);
    
    // Focus back to input for better UX
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Performance Info */}
      <div className="flex-shrink-0 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-4">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-blue-200">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white",
              streamingState.isStreaming ? "bg-orange-500 animate-pulse" : "bg-green-500"
            )} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerGuru
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {streamingState.isStreaming ? 'Streaming...' : 'Lightning Fast AI'}
              {responseTime && (
                <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                  {responseTime}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Stats
            </Button>
            {hasError && (
              <Button
                variant="outline"
                size="sm"
                onClick={retryLastMessage}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
            <Badge variant={streamingState.isStreaming ? "destructive" : "secondary"} 
                   className={streamingState.isStreaming ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}>
              {streamingState.isStreaming ? 'Streaming' : 'Ready'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Performance Monitor */}
          {showPerformanceMonitor && (
            <div className="mb-4">
              <PerformanceMonitor stats={performanceStats} isVisible={true} />
            </div>
          )}

          {messages.map((message) => (
            <StreamingMessage
              key={message.id}
              message={message}
              isStreaming={message.isStreaming}
              cacheHit={streamingState.cacheHit && message.role === 'assistant'}
              responseTime={streamingState.responseTime}
            />
          ))}

          {/* Advanced Typing Indicator */}
          {streamingState.isStreaming && (
            <TypingIndicator
              isVisible={true}
              stage={streamingState.connectionStatus === 'connecting' ? 'thinking' : 'streaming'}
              cacheHit={streamingState.cacheHit}
              optimizationLevel={streamingState.optimizationLevel}
            />
          )}

          {/* Error State */}
          {hasError && (
            <div className="flex justify-center">
              <Card className="bg-red-50 border-red-200 max-w-md">
                <CardContent className="p-3 text-center">
                  <p className="text-sm text-red-700 mb-2">
                    Oops! Something went wrong: {streamingState.error}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryLastMessage}
                    className="text-red-700 border-red-300"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={streamingState.isStreaming ? "Streaming response..." : "Ask CareerGuru anything..."}
              disabled={isLoading || streamingState.isStreaming}
              className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading || streamingState.isStreaming}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Performance Stats */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {responseTime && (
                <span>Last response: {responseTime}</span>
              )}
              <span>Avg: {performanceStats.averageResponseTime.toFixed(0)}ms</span>
              <span>Cache: {performanceStats.cacheHitRate.toFixed(1)}%</span>
            </div>
            <div className="text-xs">
              {streamingState.cacheHit ? '⚡ Instant (cached)' : '🚀 Optimized delivery'}
            </div>
          </div>
          
          {isFirstTime && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Quick start:</p>
              <div className="flex flex-wrap gap-2">
                {STARTER_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-white/60 hover:bg-blue-50 border-blue-200 text-blue-700 transition-colors"
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading || streamingState.isStreaming}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}