
import React, { useState } from 'react';
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

// Mock product data
const mockProducts = [
  {
    id: 1,
    title: 'Floral Summer Dress',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D',
    price: 15,
    deposit: 50,
    size: 'M',
    condition: 'Like New',
    age: '1 year'
  },
  {
    id: 2,
    title: 'Blue Denim Jacket',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D',
    price: 12,
    deposit: 40,
    size: 'L',
    condition: 'Good',
    age: '2 years'
  },
  {
    id: 3,
    title: 'Men\'s Formal Suit',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VpdHxlbnwwfHwwfHx8MA%3D%3D',
    price: 25,
    deposit: 100,
    size: 'M',
    condition: 'Excellent',
    age: '6 months'
  },
  {
    id: 4,
    title: 'Casual White T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
    price: 8,
    deposit: 20,
    size: 'S',
    condition: 'Good',
    age: '1 year'
  },
  {
    id: 5,
    title: 'Party Sequin Dress',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2VxdWluJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D',
    price: 20,
    deposit: 60,
    size: 'S',
    condition: 'Like New',
    age: '3 months'
  },
  {
    id: 6,
    title: 'Winter Knit Sweater',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a25pdHRlZCUyMHN3ZWF0ZXJ8ZW58MHx8MHx8fDA%3D',
    price: 14,
    deposit: 35,
    size: 'L',
    condition: 'Good',
    age: '2 years'
  }
];

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [priceRange, setPriceRange] = useState([0, 50]);
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
  
  // Handler for logging out
  const handleLogout = () => {
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
  const handleRentOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally submit the data to a backend
    console.log("Form data submitted:", formData);
    console.log("Image data:", selectedImage);
    
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
    alert("Your item has been listed successfully!");
  };
  
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
              <button className="w-10 h-10 rounded-full bg-rewear-gray/50 flex items-center justify-center text-muted-foreground hover:text-primary">
                <Heart size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-rewear-gray/50 flex items-center justify-center text-muted-foreground hover:text-primary">
                <MessageSquare size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-rewear-gray/50 flex items-center justify-center text-muted-foreground hover:text-primary">
                <ShoppingCart size={20} />
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-rewear-gray flex items-center justify-center text-muted-foreground hover:text-primary"
                onClick={handleLogout}
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
                            ${priceRange[0]} - ${priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[0, 50]}
                          max={100}
                          step={1}
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
                            <SelectItem value="nearby">Within 5 miles</SelectItem>
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
                      {mockProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                            />
                            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
                              <Heart size={16} className="text-muted-foreground hover:text-red-500" />
                            </button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-primary font-semibold">${product.price}/day</span>
                                <span className="text-xs text-muted-foreground">Deposit: ${product.deposit}</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-rewear-gray rounded-full">{product.size}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{product.condition}</span>
                              <span>Age: {product.age}</span>
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
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
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
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
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
    </div>
  );
};

export default Dashboard;
