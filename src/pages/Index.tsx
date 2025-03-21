
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

// Mock function for multi-model research - in a real implementation, 
// this would connect to a backend that queries multiple AI models
const researchWithModels = async (query: string) => {
  console.log('Researching with multiple models:', query);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // This is a mock response - in a real app, you'd query different AI models via backend
  return {
    text: `Based on research across multiple AI models, here's the best answer for "${query}"...

This would be implemented using HTML, CSS, JavaScript for the frontend and Python for the backend processing of multiple AI model responses.`,
    sources: [
      { name: "GPT-4", confidence: 0.92, language: "Python/JS" },
      { name: "Gemini", confidence: 0.89, language: "HTML/CSS" },
      { name: "Claude", confidence: 0.87, language: "JavaScript" }
    ]
  };
};

const Index = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hi there! I'm your AI research assistant. I can search across multiple AI models for the best answers using HTML, CSS, JavaScript, and Python.", 
      sender: 'ai',
      sources: [] 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user', sources: [] };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show researching state
    setIsResearching(true);
    
    try {
      // Research with multiple models
      const response = await researchWithModels(inputValue);
      
      const aiMessage = { 
        text: response.text, 
        sender: 'ai',
        sources: response.sources
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, there was an error processing your request. Please try again.", 
        sender: 'ai',
        sources: []
      }]);
    } finally {
      setIsResearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black dark:text-white" />
          <h1 className="text-sm font-medium">AI Research Assistant</h1>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto py-4 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card 
                className={`max-w-[90%] p-3 ${
                  message.sender === 'user' 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-gray-50 text-black dark:bg-gray-900 dark:text-white'
                } border-0 rounded-xl shadow-sm animate-fade-in`}
              >
                <div className="flex items-center gap-1.5 mb-1 opacity-70">
                  {message.sender === 'ai' ? (
                    <Bot className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  <span className="text-xs">
                    {message.sender === 'ai' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs opacity-70 mb-1">
                      <Search className="w-3 h-3" />
                      <span>Sources:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {source.name} ({(source.confidence * 100).toFixed(0)}%) - {source.language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
          
          {/* Researching indicator */}
          {isResearching && (
            <div className="flex justify-start">
              <Card className="px-3 py-3 max-w-[90%] bg-gray-50 text-black dark:bg-gray-900 dark:text-white border-0 rounded-xl shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 opacity-70">
                  <Bot className="w-3 h-3" />
                  <span className="text-xs">Assistant</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Search className="w-3 h-3 animate-pulse" />
                    <span>Researching across multiple AI models (HTML, CSS, JS, Python)...</span>
                  </div>
                  <Skeleton className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800" />
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="resize-none min-h-[44px] max-h-[120px] py-3 pr-10 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl"
              />
            </div>
            <Button 
              type="submit" 
              size="icon"
              className="h-10 w-10 rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
              disabled={isResearching || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
