'use client';

import { useState, useRef, useEffect } from 'react';
import { COLORS } from '@/lib/constants';

interface Source {
  content: string;
  filename: string;
  chunk_index: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

const PERSONALITIES = {
  francois: { name: 'François', emoji: '🇫🇷', description: 'Blunt & opinionated French sommelier' },
  andre: { name: 'Andre', emoji: '🍷', description: 'Friendly & approachable wine expert' },
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<string | null>(null);
  const [personality, setPersonality] = useState<'francois' | 'andre'>('francois');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content, personality }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    'What makes a great Burgundy wine?',
    'Explain the winemaking process for Champagne',
    'What are the key wine regions of Italy?',
    'How does terroir affect wine flavor?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto">
      {/* Personality Toggle */}
      <div className="flex justify-center gap-2 p-3 border-b border-gray-200 bg-white">
        {Object.entries(PERSONALITIES).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPersonality(key as 'francois' | 'andre')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              personality === key
                ? 'bg-[#722F37] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">{PERSONALITIES[personality].emoji}</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: COLORS.text }}>
              {PERSONALITIES[personality].name}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              {PERSONALITIES[personality].description}. Ask about regions, grapes,
              winemaking techniques, tasting notes, food pairings, and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => setInput(question)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300
                           hover:bg-gray-50 transition-colors text-sm"
                  style={{ color: COLORS.text }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#722F37] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <button
                      onClick={() => setShowSources(
                        showSources === message.id ? null : message.id
                      )}
                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                    >
                      <span>{showSources === message.id ? '▼' : '▶'}</span>
                      <span>{message.sources.length} sources</span>
                    </button>

                    {showSources === message.id && (
                      <div className="mt-2 space-y-2">
                        {message.sources.map((source, i) => (
                          <div
                            key={i}
                            className="text-xs bg-white rounded p-2 border border-gray-200"
                          >
                            <div className="font-medium text-gray-700 mb-1">
                              {source.filename}
                            </div>
                            <div className="text-gray-600 line-clamp-3">
                              {source.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about wine..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3
                     focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-transparent"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by your wine knowledge base with {3498} chunks of information
        </p>
      </div>
    </div>
  );
}
