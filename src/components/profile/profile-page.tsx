
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, LogOut, Settings, ShoppingBag } from 'lucide-react';
import UserProducts from '../products/user-products';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

interface ProfilePageProps {
  onClose: () => void;
  onLogout: () => void;
  cartItems: string[];
  listedItems: string[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, onLogout, cartItems, listedItems }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserProducts();
    }
  }, [user]);

  const loadUserProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUserProducts(data || []);
    } catch (err) {
      console.error('Error loading user products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Account</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="sm:w-1/4 border-b sm:border-b-0 sm:border-r p-2">
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-1">
              <Button 
                variant={activeTab === 'products' ? 'default' : 'ghost'}
                className="justify-start"
                onClick={() => setActiveTab('products')}
              >
                <ShoppingBag size={18} className="mr-2" />
                Your Products
              </Button>
              <Button 
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                className="justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} className="mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost"
                className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={onLogout}
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-4 overflow-auto">
            {activeTab === 'products' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Listed Products ({userProducts.length})</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading your products...</p>
                  </div>
                ) : (
                  <UserProducts products={userProducts} onRefresh={loadUserProducts} />
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <p className="text-muted-foreground">Account management features coming soon!</p>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Account Information</h4>
                  <div className="mt-2 space-y-1">
                    <p>Email: {user?.email}</p>
                    <p>Member since: {user ? new Date(user.created_at).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
