
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, UserCircle, Settings, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePageProps {
  onClose: () => void;
  onLogout: () => void;
  cartItems: number[];
  listedItems: number[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, onLogout, cartItems, listedItems }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('account');
  
  const handleSaveChanges = () => {
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <UserCircle size={16} />
                Account
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag size={16} />
                Orders
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="p-4 space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-rewear-gray/50 flex items-center justify-center text-2xl font-semibold mb-2">
                  {/* User initial */}
                  U
                </div>
                <h3 className="text-xl font-semibold">User Name</h3>
                <p className="text-muted-foreground">user@example.com</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="User Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="user@example.com" type="email" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Your Active Rentals</h3>
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground">You have no active rentals</p>
                ) : (
                  <p className="text-muted-foreground">You have {cartItems.length} items in your cart</p>
                )}
                
                <h3 className="font-semibold mt-6">Your Listed Items</h3>
                {listedItems.length === 0 ? (
                  <p className="text-muted-foreground">You haven't listed any items for rent yet</p>
                ) : (
                  <p className="text-muted-foreground">You've listed {listedItems.length} items for rent</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="p-4 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button variant="outline" className="w-full mt-2">Update Password</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Notification Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email notifications</Label>
                      <input type="checkbox" id="email-notifications" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails">Marketing emails</Label>
                      <input type="checkbox" id="marketing-emails" className="toggle" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button variant="destructive" onClick={onLogout} className="w-full">
                Log Out
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
