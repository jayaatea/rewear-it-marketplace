
// Mock product data
export const mockProducts = [
  {
    id: 1,
    title: 'Floral Summer Dress',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D',
    price: 1125, // ₹1,125
    deposit: 3750, // ₹3,750
    size: 'M',
    condition: 'Like New',
    age: '1 year'
  },
  {
    id: 2,
    title: 'Blue Denim Jacket',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D',
    price: 900, // ₹900
    deposit: 3000, // ₹3,000
    size: 'L',
    condition: 'Good',
    age: '2 years'
  },
  {
    id: 3,
    title: 'Men\'s Formal Suit',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VpdHxlbnwwfHwwfHx8MA%3D%3D',
    price: 1875, // ₹1,875
    deposit: 7500, // ₹7,500
    size: 'M',
    condition: 'Excellent',
    age: '6 months'
  },
  {
    id: 4,
    title: 'Casual White T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
    price: 600, // ₹600
    deposit: 1500, // ₹1,500
    size: 'S',
    condition: 'Good',
    age: '1 year'
  },
  {
    id: 5,
    title: 'Party Sequin Dress',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2VxdWluJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D',
    price: 1500, // ₹1,500
    deposit: 4500, // ₹4,500
    size: 'S',
    condition: 'Like New',
    age: '3 months'
  },
  {
    id: 6,
    title: 'Winter Knit Sweater',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a25pdHRlZCUyMHN3ZWF0ZXJ8ZW58MHx8MHx8fDA%3D',
    price: 1050, // ₹1,050
    deposit: 2625, // ₹2,625
    size: 'L',
    condition: 'Good',
    age: '2 years'
  }
];

// Generate a new ID for new products
export const getNewProductId = () => {
  return mockProducts.length > 0 ? Math.max(...mockProducts.map(p => p.id)) + 1 : 1;
};
