
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Index = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="mx-auto flex items-center">
          <Bot className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-medium">AI Assistant</h1>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 rounded-tl-none'
              } animate-fade-in`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'ai' ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="text-xs opacity-70">{formatTimestamp()}</span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="rounded-full bg-blue-600 p-2.5 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Index;
