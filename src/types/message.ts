
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
  timestamp?: Date;
  sender?: 'user' | 'owner';
  text?: string;
}

export interface MessageWithDetails extends Message {
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  }
}

export interface Conversation {
  otherId: string;
  otherPerson: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  lastMessage: string;
  created_at: string;
  product?: any;
  product_id?: string | null;
  unread: number;
}
