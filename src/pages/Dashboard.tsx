
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import RewearLogo from '@/components/rewear-logo';
import { AnimatedContainer } from '@/components/animated-container';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, User, Home, Tag, Camera, Heart, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from '@/data/products';
import CartPage from '@/components/cart/cart-page';
import FavoritesPage from '@/components/favorites/favorites-page';
import ProfilePage from '@/components/profile/profile-page';
import { useAuth } from '@/hooks/use-auth';
import { 
  fetchProducts, 
  fetchUserProducts, 
  addToCart, 
  removeFromCart, 
  createProduct, 
  addToFavorites, 
  removeFromFavorites, 
  getUserFavorites 
} from '@/lib/product-service';
import { supabase } from '@/integrations/supabase/client';

// Update the Dashboard component to include the onMessageOwner props
interface DashboardProps {
  onMessageOwner?: (productId: number, productTitle: string, ownerName: string) => void;
}

// Dashboard component
const Dashboard: React.FC<DashboardProps> = ({ onMessageOwner }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [priceRange, setPriceRange] = useState<number[]>([0, 3750]); // Price range in INR
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    rentalPrice: '',
    deposit: '',
    age: ''
  });
  
  // Get the authenticated user
  const { user, loading: authLoading } = useAuth();
  
  // State for products and user actions
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [listedItems, setListedItems] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  
  // Fetch products and user data
  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return;
      
      try {
        // Fetch products
        const productsData = await fetchProducts();
        setProducts(productsData);
        
        // If user is logged in, fetch favorites and cart
        if (user) {
          const userFavorites = await getUserFavorites(user.id);
          setFavorites(userFavorites);
          
          const userProducts = await fetchUserProducts(user.id);
          setListedItems(userProducts.map(p => p.id));

          // Get message count
          const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('receiver_id', user.id)
            .eq('read', false);
          
          setMessageCount(data?.length || 0);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem fetching your data",
          variant: "destructive"
        });
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadData();
  }, [user, authLoading, toast]);
  
  // Handler for logging out
  const handleLogout = async () => {
    const { signOut } = useAuth();
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };
  
  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler for select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler for file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler for Rent Out form submission
  const handleRentOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to list items for rent",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create new product
      const newProduct = {
        owner_id: user.id,
        title: formData.title,
        description: formData.description,
        image_url: selectedImage || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D',
        price: parseInt(formData.rentalPrice) || 0,
        deposit: parseInt(formData.deposit) || 0,
        size: formData.size.toUpperCase(),
        condition: formData.condition,
        age: formData.age
      };
      
      const savedProduct = await createProduct(newProduct);
      
      // Update products list and reset form
      setProducts(prev => [savedProduct, ...prev]);
      setListedItems(prev => [...prev, savedProduct.id]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        size: '',
        condition: '',
        rentalPrice: '',
        deposit: '',
        age: ''
      });
      setSelectedImage(null);
      
      // Show success feedback
      toast({
        title: "Item Listed Successfully",
        description: "Your item has been listed for rent",
      });
      
      // Switch to browse tab to see the new item
      setActiveTab('browse');
    } catch (error) {
      console.error('Error listing product:', error);
      toast({
        title: "Error",
        description: "Failed to list your item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handler for adding to cart
  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addToCart(productId, user.id);
      setCartItems(prev => [...prev, productId]);
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Handler for removing from cart
  const handleRemoveFromCart = async (productId: string) => {
    if (!user) return;
    
    try {
      await removeFromCart(productId, user.id);
      setCartItems(prev => prev.filter(id => id !== productId));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  
  // Handler for toggling favorites
  const handleToggleFavorite = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (favorites.includes(productId)) {
        await removeFromFavorites(productId, user.id);
        setFavorites(prev => prev.filter(id => id !== productId));
        
        toast({
          title: "Removed from favorites",
          description: "Item has been removed from your favorites",
        });
      } else {
        await addToFavorites(productId, user.id);
        setFavorites(prev => [...prev, productId]);
        
        toast({
          title: "Added to favorites",
          description: "Item has been added to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  // Handler for opening messages with specific owner
  const handleMessageOwner = (productId: number, ownerId?: string) => {
    // Find the product
    const product = products.find(p => p.id === String(productId));
    
    if (product) {
      // Call the parent component's onMessageOwner function
      if (onMessageOwner) {
        onMessageOwner(productId, product.title, "Owner");
      }
      
      toast({
        title: "Message Owner",
        description: `Opening chat with the owner of ${product.title}`,
      });
    } else {
      // Handle case where there's no specific product (general messages)
      if (onMessageOwner) {
        onMessageOwner(0, "", "ReWear Support");
      }
      
      toast({
        title: "Messages",
        description: "Opening your message history",
      });
    }
  };
  
  // Handler for proceeding to checkout
  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to checkout",
        variant: "destructive"
      });
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/checkout');
    setShowCart(false);
  };
  
  // Handler for opening cart
  const handleOpenCart = () => {
    setShowCart(true);
  };
  
  // Handler for opening favorites
  const handleOpenFavorites = () => {
    setShowFavorites(true);
  };

  // Handler for opening account
  const handleOpenAccount = () => {
    setShowProfile(true);
  };
  
  if (authLoading || loadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="border-b py-4">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <RewearLogo size="sm" showImage={true} />
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                className={`px-2 py-1 ${activeTab === 'browse' ? 'font-medium text-primary' : 'text-muted-foreground'} rewear-link`}
                onClick={() => setActiveTab('browse')}
              >
                Browse
              </button>
              <button 
                className={`px-2 py-1 ${activeTab === 'rent-out' ? 'font-medium text-primary' : 'text-muted-foreground'} rewear-link`}
                onClick={() => setActiveTab('rent-out')}
              >
                Rent Out
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                className="w-10 h-10 rounded-full bg-rewear-gray/50 flex items-center justify-center text-muted-foreground hover:text-primary relative"
                onClick={handleOpenFavorites}
                aria-label="Favorites"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-rewear-gray/50 flex items-center justify-center text-muted-foreground hover:text-primary relative"
                onClick={() => handleMessageOwner(0)}
                aria-label="Messages"
              >
                <MessageSquare size={20} />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {messageCount}
                  </span>
                )}
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-rewear-gray/50 flex items-center justify-center text-muted-foreground hover:text-primary relative"
                onClick={handleOpenCart}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-rewear-gray flex items-center justify-center text-muted-foreground hover:text-primary"
                onClick={handleOpenAccount}
                title="My Account"
                aria-label="Profile"
              >
                <User size={20} />
              </button>
            </div>
          </div>
          
          <div className="md:hidden flex mt-4 border-t pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="browse">
                  <Home size={16} className="mr-2" />
                  Browse
                </TabsTrigger>
                <TabsTrigger value="rent-out">
                  <Tag size={16} className="mr-2" />
                  Rent Out
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Browse Tab Content */}
            <TabsContent value="browse" className="mt-0">
              <AnimatedContainer>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Browse Rentals</h1>
                  <p className="text-muted-foreground">Find sustainable fashion for your next occasion</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Filters */}
                  <div className="lg:w-1/4 bg-white p-6 rounded-lg shadow-sm border h-fit">
                    <h2 className="text-lg font-medium flex items-center mb-6">
                      <Filter size={18} className="mr-2" /> Filters
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Category Filter */}
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue="all">
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="dresses">Dresses</SelectItem>
                            <SelectItem value="tops">Tops & Blouses</SelectItem>
                            <SelectItem value="pants">Pants & Jeans</SelectItem>
                            <SelectItem value="outerwear">Outerwear</SelectItem>
                            <SelectItem value="formal">Formal Wear</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Size Filter */}
                      <div>
                        <Label htmlFor="size">Size</Label>
                        <Select defaultValue="all">
                          <SelectTrigger id="size">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sizes</SelectItem>
                            <SelectItem value="xs">XS</SelectItem>
                            <SelectItem value="s">S</SelectItem>
                            <SelectItem value="m">M</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                            <SelectItem value="xl">XL</SelectItem>
                            <SelectItem value="xxl">XXL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Condition Filter */}
                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <Select defaultValue="all">
                          <SelectTrigger id="condition">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Conditions</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Price Range Filter */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Price Range (per day)</Label>
                          <span className="text-sm text-muted-foreground">
                            ₹{priceRange[0]} - ₹{priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[0, 3750]}
                          max={7500}
                          step={75}
                          onValueChange={(value) => setPriceRange(value)}
                        />
                      </div>
                      
                      {/* Location Filter */}
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Select defaultValue="all">
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="nearby">Within 5 km</SelectItem>
                            <SelectItem value="city">Within city</SelectItem>
                            <SelectItem value="state">Within state</SelectItem>
                            <SelectItem value="country">Within country</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </div>
                  
                  {/* Product Grid */}
                  <div className="lg:w-3/4">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input placeholder="Search for clothes..." className="pl-10" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Select defaultValue="recommended">
                          <SelectTrigger id="sort" className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recommended">Recommended</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            <img
                              src={product.image_url || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'}
                              alt={product.title}
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                            />
                            <button 
                              className={`absolute top-3 right-3 w-8 h-8 rounded-full 
                                ${favorites.includes(product.id) ? 'bg-red-50' : 'bg-white/80'} 
                                flex items-center justify-center hover:bg-white`}
                              onClick={() => handleToggleFavorite(product.id)}
                            >
                              <Heart 
                                size={16} 
                                className={favorites.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}
                              />
                            </button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-primary font-semibold">₹{product.price}/day</span>
                                <span className="text-xs text-muted-foreground">Deposit: ₹{product.deposit}</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-rewear-gray rounded-full">{product.size}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span>{product.condition}</span>
                              <span>Age: {product.age}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleAddToCart(product.id)}
                                disabled={cartItems.includes(product.id)}
                              >
                                {cartItems.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="flex-shrink-0"
                                onClick={() => handleMessageOwner(parseInt(product.id))}
                              >
                                <MessageSquare size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedContainer>
            </TabsContent>
            
            {/* Rent Out Tab Content */}
            <TabsContent value="rent-out" className="mt-0">
              <AnimatedContainer>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Rent Out Your Clothes</h1>
                  <p className="text-muted-foreground">Share your wardrobe and earn while being sustainable</p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleRentOutSubmit} className="space-y-8">
                    {/* Item Photos */}
                    <div className="space-y-2">
                      <Label htmlFor="photos" className="text-lg font-medium">Item Photos</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add clear photos of your item (front, back, tags, any defects)
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          {selectedImage ? (
                            <img 
                              src={selectedImage} 
                              alt="Selected item" 
                              className="w-full h-full object-cover rounded-lg" 
                            />
                          ) : (
                            <>
                              <Camera size={40} className="text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Click to add main photo</p>
                            </>
                          )}
                          <input 
                            type="file" 
                            id="photo-upload" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((index) => (
                            <div 
                              key={index}
                              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Camera size={24} className="text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="space-y-6">
                      <Label className="text-lg font-medium">Item Details</Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Item Name</Label>
                          <Input 
                            id="title" 
                            name="title"
                            placeholder="e.g. Black Evening Dress" 
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                            required
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dresses">Dresses</SelectItem>
                              <SelectItem value="tops">Tops & Blouses</SelectItem>
                              <SelectItem value="pants">Pants & Jeans</SelectItem>
                              <SelectItem value="outerwear">Outerwear</SelectItem>
                              <SelectItem value="formal">Formal Wear</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input 
                            id="description" 
                            name="description"
                            placeholder="Brief description of the item" 
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="size">Size</Label>
                          <Select
                            value={formData.size}
                            onValueChange={(value) => handleSelectChange('size', value)}
                            required
                          >
                            <SelectTrigger id="size">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="xs">XS</SelectItem>
                              <SelectItem value="s">S</SelectItem>
                              <SelectItem value="m">M</SelectItem>
                              <SelectItem value="l">L</SelectItem>
                              <SelectItem value="xl">XL</SelectItem>
                              <SelectItem value="xxl">XXL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition</Label>
                          <Select
                            value={formData.condition}
                            onValueChange={(value) => handleSelectChange('condition', value)}
                            required
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
                            placeholder="e.g. 6 months, 2 years" 
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Pricing */}
                    <div className="space-y-6">
                      <Label className="text-lg font-medium">Pricing</Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="rentalPrice">Rental Price (per day)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                            <Input 
                              id="rentalPrice" 
                              name="rentalPrice"
                              type="number" 
                              placeholder="0.00" 
                              className="pl-8"
                              value={formData.rentalPrice}
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
                              placeholder="0.00" 
                              className="pl-8"
                              value={formData.deposit}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full md:w-auto px-8">List Item for Rent</Button>
                  </form>
                </div>
              </AnimatedContainer>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Cart Modal */}
      {showCart && (
        <CartPage 
          cartItems={cartItems.map(id => id.toString())} 
          onClose={() => setShowCart(false)} 
          onRemoveFromCart={handleRemoveFromCart}
          onCheckout={handleProceedToCheckout}
          onMessageOwner={(productId: string) => {
            const product = products.find(p => p.id === productId);
            if (product && onMessageOwner) {
              onMessageOwner(parseInt(productId), product.title, "Owner");
              setShowCart(false);
            }
          }}
        />
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <FavoritesPage 
          favorites={favorites} 
          onClose={() => setShowFavorites(false)} 
          onRemoveFromFavorites={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <ProfilePage 
          onClose={() => setShowProfile(false)} 
          onLogout={handleLogout}
          cartItems={cartItems.map(id => id.toString())}
          listedItems={listedItems}
        />
      )}
    </div>
  );
};

export default Dashboard;
