
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Message } from '@/types/message';

interface ChatBotProps {
  productId?: string;
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
  const [currentProductId, setCurrentProductId] = useState<string | undefined>(productId);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Load messages from Supabase when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, currentProductId]);

  const loadMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Convert string dates to Date objects
      const formattedMessages = data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.created_at),
      }));
      
      setAllMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error loading messages",
        description: "Unable to load your messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get messages for current product or general messages (productId = undefined)
  const currentMessages = allMessages.filter(msg => 
    (currentProductId && msg.product_id === currentProductId) || 
    (!currentProductId && !msg.product_id)
  );

  const handleOpenChat = async (productId?: string, productName?: string, owner?: string) => {
    setCurrentProductId(productId);
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to send messages",
      });
      return;
    }
    
    // If product details are provided, use them
    if (productId && productName) {
      // Find if we already have any messages for this product
      const hasExistingMessages = allMessages.some(msg => msg.product_id === productId);
      
      // If no existing messages, add a welcome message from the owner
      if (!hasExistingMessages) {
        // Let's fetch the product to get the owner ID
        try {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('owner_id, title')
            .eq('id', productId)
            .single();
            
          if (productError) throw productError;
          
          if (productData) {
            const ownerId = productData.owner_id;
            
            // Only create this welcome message if the user is not the owner
            if (ownerId !== user.id) {
              const newOwnerMessage = {
                content: `Hello! I'm ${owner || 'the owner'} of ${productName}. How can I help you?`,
                product_id: productId,
                sender_id: ownerId,
                receiver_id: user.id,
                read: false
              };
              
              const { data, error } = await supabase
                .from('messages')
                .insert([newOwnerMessage])
                .select();
                
              if (error) throw error;
              
              if (data) {
                const formattedMessage = {
                  ...data[0],
                  timestamp: new Date(data[0].created_at),
                  text: data[0].content,
                  sender: 'owner' as const
                };
                setAllMessages(prev => [...prev, formattedMessage]);
              }
            }
          }
        } catch (error) {
          console.error("Error setting up chat:", error);
        }
      }
    } else if (!currentMessages.length) {
      // For general chat, add a welcome message if no messages exist
      const supportId = "rewear-support";
      
      const newOwnerMessage = {
        content: `Hello! How can I help you today?`,
        product_id: null,
        sender_id: supportId,
        receiver_id: user.id,
        read: false
      };
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([newOwnerMessage])
          .select();
          
        if (error) throw error;
        
        if (data) {
          const formattedMessage = {
            ...data[0],
            timestamp: new Date(data[0].created_at),
            text: data[0].content,
            sender: 'owner' as const
          };
          setAllMessages(prev => [...prev, formattedMessage]);
        }
      } catch (error) {
        console.error("Error saving welcome message:", error);
      }
    }
    
    setIsOpen(true);
    toast({
      title: "Chat opened",
      description: productId ? `You can now chat about ${productName || 'this product'}` : "General chat opened",
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    // Get receiver ID (product owner or support)
    let receiverId = "rewear-support";
    
    if (currentProductId) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('owner_id')
          .eq('id', currentProductId)
          .single();
          
        if (error) throw error;
        if (data) {
          receiverId = data.owner_id;
        }
      } catch (error) {
        console.error("Error getting receiver ID:", error);
      }
    }

    // Add user message to Supabase
    const newUserMessage = {
      content: message,
      product_id: currentProductId || null,
      sender_id: user.id,
      receiver_id: receiverId,
      read: false
    };
    
    setMessage('');
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newUserMessage])
        .select();
        
      if (error) throw error;
      
      if (data) {
        const formattedMessage = {
          ...data[0],
          timestamp: new Date(data[0].created_at),
          text: data[0].content,
          sender: 'user' as const
        };
        setAllMessages(prev => [...prev, formattedMessage]);
      }
      
      // Simulate owner response after a delay
      setTimeout(async () => {
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
        
        const ownerReplyMessage = {
          content: ownerResponse,
          product_id: currentProductId || null,
          sender_id: receiverId,
          receiver_id: user.id,
          read: false
        };
        
        try {
          const { data, error } = await supabase
            .from('messages')
            .insert([ownerReplyMessage])
            .select();
            
          if (error) throw error;
          
          if (data) {
            const formattedMessage = {
              ...data[0],
              timestamp: new Date(data[0].created_at),
              text: data[0].content,
              sender: 'owner' as const
            };
            setAllMessages(prev => [...prev, formattedMessage]);
          }
        } catch (error) {
          console.error("Error saving response message:", error);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* Chat bubble button */}
      <Button
        onClick={() => handleOpenChat(productId, productTitle, ownerName)}
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading messages...
              </div>
            ) : currentMessages.length > 0 ? (
              currentMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`max-w-[80%] ${msg.sender === 'owner' || msg.sender_id !== user?.id ? 'self-start' : 'self-end'}`}
                >
                  <div 
                    className={`p-3 rounded-lg ${
                      msg.sender === 'owner' || msg.sender_id !== user?.id
                        ? 'bg-rewear-gray text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {msg.text || msg.content}
                  </div>
                  <div className={`text-xs text-muted-foreground mt-1 ${
                    msg.sender === 'owner' || msg.sender_id !== user?.id ? 'text-left' : 'text-right'
                  }`}>
                    {msg.timestamp ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                     new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                disabled={!user}
              />
              <Button type="submit" disabled={!user}>Send</Button>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Please sign in to send messages
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
