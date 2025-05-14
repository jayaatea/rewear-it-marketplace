
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
}

export interface MessageWithDetails extends Message {
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  }
}

export async function sendMessage(receiverId: string, message: string, productId: string | null = null) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      toast.error('You must be logged in to send messages');
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userData.user.id,
        receiver_id: receiverId,
        product_id: productId,
        content: message,
        read: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error sending message:', error.message);
    toast.error('Failed to send message');
    throw error;
  }
}

export async function getMessagesByProductId(productId: string) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .or(`sender_id.eq.${userData.user.id},receiver_id.eq.${userData.user.id}`)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error fetching messages:', error.message);
    toast.error('Failed to fetch messages');
    return [];
  }
}

export async function getConversations() {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (username, full_name, avatar_url),
        receiver:receiver_id (username, full_name, avatar_url),
        product:product_id (title, image_url)
      `)
      .or(`sender_id.eq.${userData.user.id},receiver_id.eq.${userData.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Group by conversation (unique combination of participants)
    const conversations = new Map();
    
    data.forEach(message => {
      let otherId, otherPerson;
      if (message.sender_id === userData.user.id) {
        otherId = message.receiver_id;
        otherPerson = message.receiver;
      } else {
        otherId = message.sender_id;
        otherPerson = message.sender;
      }
      
      const key = message.product_id ? `${otherId}-${message.product_id}` : otherId;
      
      if (!conversations.has(key) || new Date(message.created_at) > new Date(conversations.get(key).created_at)) {
        conversations.set(key, {
          otherId,
          otherPerson,
          lastMessage: message.content,
          created_at: message.created_at,
          product: message.product,
          product_id: message.product_id,
          unread: message.receiver_id === userData.user.id && !message.read ? 1 : 0
        });
      } else if (message.receiver_id === userData.user.id && !message.read) {
        const conv = conversations.get(key);
        conv.unread = (conv.unread || 0) + 1;
      }
    });
    
    return Array.from(conversations.values());
  } catch (error: any) {
    console.error('Error fetching conversations:', error.message);
    toast.error('Failed to fetch conversations');
    return [];
  }
}

export async function markAsRead(senderId: string, productId: string | null = null) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');
    
    const query = supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', userData.user.id);
      
    if (productId) {
      query.eq('product_id', productId);
    }
    
    const { error } = await query;
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error marking messages as read:', error.message);
    return false;
  }
}
