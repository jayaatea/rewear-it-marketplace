
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Product {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  deposit: number | null;
  size: string | null;
  condition: string | null;
  age: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    toast.error('Failed to fetch products');
    return [];
  }
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      toast.error('You must be logged in to list a product');
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        owner_id: userData.user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success('Product listed successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating product:', error.message);
    toast.error('Failed to list product');
    throw error;
  }
}

export async function fetchUserProducts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error fetching user products:', error.message);
    toast.error('Failed to fetch your listed products');
    return [];
  }
}

export async function addToFavorites(productId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success('Added to favorites');
    return data;
  } catch (error: any) {
    console.error('Error adding to favorites:', error.message);
    toast.error('Failed to add to favorites');
    throw error;
  }
}

export async function removeFromFavorites(productId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) {
      throw error;
    }

    toast.success('Removed from favorites');
    return true;
  } catch (error: any) {
    console.error('Error removing from favorites:', error.message);
    toast.error('Failed to remove from favorites');
    throw error;
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data.map(fav => fav.product_id) || [];
  } catch (error: any) {
    console.error('Error fetching favorites:', error.message);
    toast.error('Failed to fetch favorites');
    return [];
  }
}

export async function addToCart(productId: string, userId: string, startDate?: string, endDate?: string) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        rental_start_date: startDate || null,
        rental_end_date: endDate || null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success('Added to cart');
    return data;
  } catch (error: any) {
    console.error('Error adding to cart:', error.message);
    toast.error('Failed to add to cart');
    throw error;
  }
}

export async function removeFromCart(productId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) {
      throw error;
    }

    toast.success('Removed from cart');
    return true;
  } catch (error: any) {
    console.error('Error removing from cart:', error.message);
    toast.error('Failed to remove from cart');
    throw error;
  }
}

export async function getUserCart(userId: string) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        rental_start_date,
        rental_end_date,
        products (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error fetching cart:', error.message);
    toast.error('Failed to fetch cart');
    return [];
  }
}
