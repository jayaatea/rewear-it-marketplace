
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          image_url: string | null
          price: number
          deposit: number | null
          size: string | null
          condition: string | null
          age: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          image_url?: string | null
          price: number
          deposit?: number | null
          size?: string | null
          condition?: string | null
          age?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          price?: number
          deposit?: number | null
          size?: string | null
          condition?: string | null
          age?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          status: string
          payment_id: string | null
          razorpay_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          status?: string
          payment_id?: string | null
          razorpay_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: string
          payment_id?: string | null
          razorpay_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
