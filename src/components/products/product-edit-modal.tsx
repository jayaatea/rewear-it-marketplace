
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProductEditModalProps {
  productId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ productId, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deposit: '',
    size: '',
    condition: '',
    age: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (error) throw error;
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          deposit: data.deposit?.toString() || '',
          size: data.size || '',
          condition: data.condition || '',
          age: data.age || '',
        });
        
        setSelectedImage(data.image_url);
      } catch (err) {
        console.error('Error fetching product:', err);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let imageUrl = selectedImage;
      
      // If there's a new image file, upload it
      if (newImageFile) {
        const uniqueFileName = `${Date.now()}-${newImageFile.name.replace(/\s+/g, '-')}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(uniqueFileName, newImageFile);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uniqueFileName);
          
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Update the product data
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          deposit: parseFloat(formData.deposit),
          size: formData.size,
          condition: formData.condition,
          age: formData.age,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading product details...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div 
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors max-w-xs mx-auto"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Product preview" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                <>
                  <Camera size={40} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to add photo</p>
                </>
              )}
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Item Name</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleSelectChange('size', value)}
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleSelectChange('condition', value)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age of Item</Label>
              <Input 
                id="age" 
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Rental Price (per day)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                <Input 
                  id="price" 
                  name="price"
                  type="number" 
                  className="pl-8"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deposit">Security Deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                <Input 
                  id="deposit" 
                  name="deposit"
                  type="number" 
                  className="pl-8"
                  value={formData.deposit || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
