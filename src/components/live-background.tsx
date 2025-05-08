
import React, { useEffect, useRef } from 'react';

const LiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Create floating particles
    let particles: Particle[] = [];
    const colors = ['#D1F0E0', '#FFE1E6', '#D3E4FD', '#FEF7CD', '#FDE1D3', '#E5DEFF'];
    
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
    }
    
    // Initialize particles
    const init = () => {
      particles = [];
      for (let i = 0; i < 25; i++) {
        particles.push(new Particle());
      }
    };
    
    init();
    
    // Mouse interaction
    let mouse = {
      x: null as number | null,
      y: null as number | null,
      isMoving: false
    };
    
    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
      mouse.isMoving = true;
      
      // Clear is moving state after a second
      setTimeout(() => {
        mouse.isMoving = false;
      }, 1000);
    });
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(209, 240, 224, 0.3)'); // rewear-mint with opacity
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
        
        // Interact with mouse
        if (mouse.x && mouse.y && mouse.isMoving) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 500;
            particle.speedX += Math.cos(angle) * force;
            particle.speedY += Math.sin(angle) * force;
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up any other event listeners
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0" 
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default LiveBackground;
