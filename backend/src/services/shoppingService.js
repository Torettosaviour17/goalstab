// Generic shopping service – replace with actual API calls
const shoppingProviders = {};

// Mock implementation for demonstration
const mockSearch = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      name: "MacBook Pro",
      price: 2500000,
      image: "https://example.com/macbook.jpg",
      link: "https://example.com/macbook",
    },
    {
      id: "2",
      name: "iPhone 15",
      price: 1500000,
      image: "https://example.com/iphone.jpg",
      link: "https://example.com/iphone",
    },
    // Add more mock products
  ].filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
};

const mockPurchase = async (productId, userDetails) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    orderId: "ORDER-123",
    message: "Order placed successfully!",
  };
};

// Real API integration example for Jumia
const jumiaApi = async (endpoint, params) => {
  const url = new URL(`https://affiliate-api.jumia.com${endpoint}`);
  url.search = new URLSearchParams({
    ...params,
    apiKey: process.env.JUMIA_API_KEY,
  }).toString();
  const res = await fetch(url);
  return res.json();
};

const jumiaSearch = async (query) => {
  const data = await jumiaApi("/products/search", { q: query });
  return data.products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    link: p.url,
  }));
};

// Register providers
shoppingProviders.jumia = {
  search: jumiaSearch,
  purchase: async () => {
    /* implement order placement */
  },
};

module.exports = {
  searchProducts: async (query, provider = "mock") => {
    // Use actual provider if configured, else mock
    return shoppingProviders[provider]?.search?.(query) ?? mockSearch(query);
  },
  purchaseProduct: async (productId, userDetails, provider = "mock") => {
    return (
      shoppingProviders[provider]?.purchase?.(productId, userDetails) ??
      mockPurchase(productId, userDetails)
    );
  },
};
