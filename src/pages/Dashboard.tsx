
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkout } from '@/components/cart/checkout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarFilters, FilterOptions } from '@/components/dashboard/sidebar-filters';
import { mockProducts } from '@/data/products';

interface DashboardProps {
  onMessageOwner?: (productId: number, title: string, owner: string) => void;
}

interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  image?: string;
  size?: string;
  condition?: string;
  owner?: string;
  deposit?: number;
  age?: string;
}

const Dashboard = ({ onMessageOwner }: DashboardProps) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleFilterChange = (filters: FilterOptions) => {
    let filteredProducts = [...mockProducts];

    // Apply category filter
    if (filters.category !== 'All Items') {
      filteredProducts = filteredProducts.filter(
        product => product.title.includes(filters.category)
      );
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(
      product => product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply size filter
    if (filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => product.size && filters.sizes.includes(product.size)
      );
    }

    // Apply condition filter
    if (filters.conditions.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => product.condition && filters.conditions.includes(product.condition)
      );
    }

    setProducts(filteredProducts);
  };

  const openCheckout = (product: Product) => {
    setSelectedProduct(product);
    setCheckoutOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSuccess = () => {
    setCheckoutOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">ReWear Marketplace</h1>

        {checkoutOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Complete Your Purchase</h2>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedProduct.image || selectedProduct.imageUrl} 
                  alt={selectedProduct.title} 
                  className="w-20 h-20 object-cover rounded-md" 
                />
                <div>
                  <h3 className="font-semibold">{selectedProduct.title}</h3>
                  <p className="text-gray-500">₹{selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>
              
              <Checkout 
                amount={selectedProduct.price} 
                onSuccess={handleCheckoutSuccess} 
              />
              
              <Button 
                variant="outline" 
                className="mt-4 w-full" 
                onClick={() => setCheckoutOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full">
            <SidebarFilters onFilterChange={handleFilterChange} />
            
            <main className="flex-1 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img 
                        src={product.image || product.imageUrl} 
                        alt={product.title} 
                        className="w-full h-60 object-cover" 
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <p className="text-gray-500 text-sm mt-1">{product.description || `Rent this ${product.title} from our collection.`}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.size && <Badge variant="outline">{product.size}</Badge>}
                        {product.condition && <Badge variant="secondary">{product.condition}</Badge>}
                        {product.age && <Badge variant="outline">{product.age}</Badge>}
                      </div>
                      <div className="mt-4">
                        <p className="font-bold">Rental Price: ₹{product.price.toFixed(2)}</p>
                        {product.deposit && <p className="text-sm text-gray-600">Deposit: ₹{product.deposit.toFixed(2)}</p>}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <Button 
                        variant="outline" 
                        onClick={() => onMessageOwner && onMessageOwner(
                          product.id, 
                          product.title, 
                          product.owner || "ReWear Staff"
                        )}
                      >
                        Message Owner
                      </Button>
                      <Button onClick={() => openCheckout(product)}>Rent Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Dashboard;
