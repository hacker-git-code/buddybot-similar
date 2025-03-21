
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    setInputValue('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage = { 
        text: getAIResponse(inputValue), 
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple response generation
  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! How can I assist you today?";
    } else if (lowerInput.includes('help')) {
      return "I'm here to help! You can ask me questions, and I'll do my best to assist you.";
    } else if (lowerInput.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know?";
    } else if (lowerInput.includes('bye')) {
      return "Goodbye! Feel free to come back if you have more questions.";
    } else {
      return "That's an interesting point. Can you tell me more about what you're looking for?";
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-lg font-medium">AI Assistant</h1>
          </div>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card 
                className={`max-w-[85%] px-4 py-3 shadow-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800'
                } animate-fade-in`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'ai' ? (
                    <Bot className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-xs opacity-70">{formatTimestamp()}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              </Card>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <Card className="px-4 py-3 max-w-[85%] shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message AI Assistant..."
                className="pr-10 py-6 text-base bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl"
              />
            </div>
            <Button 
              type="submit" 
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {inputValue.trim() ? <Send className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
