
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ProductEditModal from './product-edit-modal';

interface UserProductsProps {
  products: any[];
  onRefresh: () => void;
}

const UserProducts: React.FC<UserProductsProps> = ({ products, onRefresh }) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setLoading(prev => ({ ...prev, [productId]: true }));
      
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
        
        onRefresh();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete product',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, [productId]: false }));
      }
    }
  };
  
  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
  };

  if (!products.length) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">You haven't listed any products yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative bg-gray-100">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{product.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-primary font-semibold">₹{product.price}/day</span>
                <span className="text-xs px-2 py-1 bg-rewear-gray rounded-full">{product.size}</span>
              </div>
              <div className="flex justify-between mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 mr-2"
                  onClick={() => handleEdit(product.id)}
                >
                  <Pencil size={16} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(product.id)}
                  disabled={loading[product.id]}
                >
                  {loading[product.id] ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <Trash size={16} className="mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {editingProductId && (
        <ProductEditModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
          onUpdate={onRefresh}
        />
      )}
    </div>
  );
};

export default UserProducts;
