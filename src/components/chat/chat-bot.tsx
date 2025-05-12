
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from '@/data/products';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'owner';
  timestamp: Date;
  productId?: number;
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
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [currentProductId, setCurrentProductId] = useState<number | undefined>(productId);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages from "localStorage" on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setAllMessages(messagesWithDateObjects);
      } catch (e) {
        console.error("Error parsing stored messages:", e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));
  }, [allMessages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, currentProductId]);

  // Get messages for current product or general messages (productId = undefined)
  const currentMessages = allMessages.filter(msg => 
    (currentProductId && msg.productId === currentProductId) || 
    (!currentProductId && !msg.productId)
  );

  const handleOpenChat = (productId?: number, productName?: string, owner?: string) => {
    setCurrentProductId(productId);
    
    // If product details are provided, use them
    if (productId && productName) {
      // Find if we already have any messages for this product
      const hasExistingMessages = allMessages.some(msg => msg.productId === productId);
      
      // If no existing messages, add a welcome message from the owner
      if (!hasExistingMessages) {
        const product = mockProducts.find(p => p.id === productId);
        const newOwnerMessage: Message = {
          id: allMessages.length + 1,
          text: `Hello! I'm ${owner || 'the owner'} of ${productName}. How can I help you?`,
          sender: 'owner',
          timestamp: new Date(),
          productId: productId
        };
        
        setAllMessages(prev => [...prev, newOwnerMessage]);
      }
    } else if (!currentMessages.length) {
      // For general chat, add a welcome message if no messages exist
      const newOwnerMessage: Message = {
        id: allMessages.length + 1,
        text: `Hello! How can I help you today?`,
        sender: 'owner',
        timestamp: new Date(),
      };
      
      setAllMessages(prev => [...prev, newOwnerMessage]);
    }
    
    setIsOpen(true);
    toast({
      title: "Chat opened",
      description: productId ? `You can now chat about ${productName || 'this product'}` : "General chat opened",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: allMessages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
      productId: currentProductId
    };
    
    setAllMessages(prev => [...prev, newUserMessage]);
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
        ownerResponse = `Hi there! Thanks for your interest. How can I help you today?`;
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
        id: allMessages.length + 2,
        text: ownerResponse,
        sender: 'owner',
        timestamp: new Date(),
        productId: currentProductId
      };
      
      setAllMessages(prev => [...prev, ownerMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat bubble button */}
      <Button
        onClick={() => handleOpenChat()}
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
                {currentProductId ? (ownerName || 'O').charAt(0) : 'R'}
              </div>
              <span>{currentProductId ? `${ownerName || 'Owner'}` : 'ReWear Support'}</span>
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
            {currentMessages.length > 0 ? (
              currentMessages.map((msg) => (
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
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No messages yet. Start a conversation!
              </div>
            )}
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
