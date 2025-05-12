
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'owner';
  timestamp: Date;
}

interface ChatBotProps {
  productId?: number;
  productTitle?: string;
  ownerName?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  productId, 
  productTitle = "this beautiful dress", 
  ownerName = "Mira" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm ${ownerName}, the owner of ${productTitle}. How can I help you?`,
      sender: 'owner',
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update initial message when product changes
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `Hello! I'm ${ownerName}, the owner of ${productTitle}. How can I help you?`,
        sender: 'owner',
        timestamp: new Date()
      }
    ]);
  }, [productId, productTitle, ownerName]);

  const handleOpenChat = () => {
    setIsOpen(true);
    toast({
      title: "Chat opened",
      description: `You can now chat with ${ownerName}`,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setMessage('');
    
    // Simulate owner response after a delay
    setTimeout(() => {
      let ownerResponse = "";

      // Check if message contains specific keywords and respond accordingly
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
        ownerResponse = `The rental price is listed on the product page. If you're interested, you can go ahead and add it to your cart!`;
      } else if (lowerMessage.includes("available") || lowerMessage.includes("when") || lowerMessage.includes("dates")) {
        ownerResponse = "Yes, this item is available for the weekend! When do you need it exactly?";
      } else if (lowerMessage.includes("size") || lowerMessage.includes("fit")) {
        ownerResponse = "It fits true to size. If you're usually a medium, this will fit perfectly.";
      } else if (lowerMessage.includes("delivery") || lowerMessage.includes("shipping")) {
        ownerResponse = "I can arrange delivery to your location for an additional ₹250.";
      } else if (lowerMessage.includes("material") || lowerMessage.includes("fabric")) {
        ownerResponse = "The fabric is soft cotton with a silk lining. It's really comfortable to wear!";
      } else if (lowerMessage.includes("condition") || lowerMessage.includes("quality")) {
        ownerResponse = "I've had this item for just a short time and it's in excellent condition, almost like new!";
      } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        ownerResponse = `Hi there! Thanks for your interest in ${productTitle}. How can I help you today?`;
      } else {
        // Default responses if no keywords match
        const responses = [
          "Yes, this item is available for the weekend!",
          "The fabric is soft cotton with a silk lining.",
          "I can arrange delivery to your location for an additional ₹250.",
          "The item fits true to size. If you're usually a medium, this will fit perfectly.",
          "I've had many people rent this with great feedback!"
        ];
        ownerResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const ownerMessage: Message = {
        id: messages.length + 2,
        text: ownerResponse,
        sender: 'owner',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, ownerMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat bubble button */}
      <Button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-primary z-50 flex items-center justify-center p-0"
        aria-label="Chat with owner"
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white shadow-xl rounded-lg z-50 flex flex-col max-h-[500px]">
          {/* Chat header */}
          <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                {ownerName.charAt(0)}
              </div>
              <span>{ownerName} (Owner)</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:bg-primary-foreground/20"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[300px]">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[80%] ${msg.sender === 'owner' ? 'self-start' : 'self-end'}`}
              >
                <div 
                  className={`p-3 rounded-lg ${
                    msg.sender === 'owner' 
                      ? 'bg-rewear-gray text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`text-xs text-muted-foreground mt-1 ${
                  msg.sender === 'owner' ? 'text-left' : 'text-right'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <Input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
