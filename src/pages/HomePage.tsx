import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RewearLogo from '@/components/rewear-logo';
import AuthForm from '@/components/auth/auth-form';
import { AnimatedContainer } from '@/components/animated-container';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    navigate('/dashboard');
  };

  const openAuthDialog = (type: 'login' | 'signup') => {
    setAuthType(type);
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 p-4 z-20">
        <RewearLogo size="md" />
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-rewear-mint/30 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-12 w-32 h-32 bg-rewear-pink/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-64 right-24 w-24 h-24 bg-rewear-blue/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-rewear-yellow/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-48 right-1/3 w-28 h-28 bg-rewear-purple/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedContainer delay={300}>
              <RewearLogo size="lg" className="mb-8 inline-flex" />
            </AnimatedContainer>
            
            <AnimatedContainer delay={600} className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-rewear-blue">
                Redefining Fashion Through Sustainability
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Browse, rent, and rewear clothing instead of buying new.
                Save money while reducing environmental impact.
              </p>
            </AnimatedContainer>
            
            <AnimatedContainer delay={900} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => openAuthDialog('login')} 
                variant="default" 
                className="text-lg px-8"
              >
                Log In
              </Button>
              <Button 
                size="lg" 
                onClick={() => openAuthDialog('signup')} 
                variant="outline" 
                className="text-lg px-8 border-primary text-primary hover:text-primary-foreground"
              >
                Sign Up
              </Button>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-rewear-gray/50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Rewear It Works</h2>
            <p className="text-muted-foreground">Join the sustainable fashion movement in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-rewear-mint rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Browse & Choose</h3>
              <p className="text-muted-foreground">Explore thousands of clothing items from individual lenders and brands</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-rewear-pink rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">Rent & Wear</h3>
              <p className="text-muted-foreground">Pay a fraction of retail price and enjoy quality fashion for your events</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-rewear-blue rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Return & Repeat</h3>
              <p className="text-muted-foreground">Return items and track your positive environmental impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="py-24 bg-gradient-to-b from-white to-rewear-mint/30">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Make a Difference</h2>
            <p className="text-muted-foreground">Every rental helps reduce waste and environmental impact</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <p className="text-muted-foreground">Reduction in textile waste compared to buying new</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">700+</div>
              <p className="text-muted-foreground">Gallons of water saved per rental on average</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <p className="text-muted-foreground">Lower carbon footprint than fast fashion purchases</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-rewear-gray/80">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <RewearLogo size="md" className="mb-6 md:mb-0" />
            <div className="flex gap-8">
              <a href="mailto:contact@rewearit.com" className="rewear-link text-muted-foreground hover:text-primary">contact@rewearit.com</a>
              <a href="tel:+1234567890" className="rewear-link text-muted-foreground hover:text-primary">+1 (234) 567-890</a>
              <a href="https://instagram.com/rewearit" className="rewear-link text-muted-foreground hover:text-primary">@rewearit</a>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Rewear It. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
