const axios = require("axios");

const fakeStoreApi = async (endpoint) => {
  const url = `https://fakestoreapi.com${endpoint}`;
  const res = await axios.get(url);
  return res.data;
};

const searchProducts = async (query) => {
  try {
    const products = await fakeStoreApi("/products");
    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery),
    );
    return filtered.map((p) => ({
      id: p.id,
      name: p.title,
      price: p.price,
      image: p.image,
      link: `https://fakestoreapi.com/products/${p.id}`,
      description: p.description,
      category: p.category,
    }));
  } catch (err) {
    console.error("Fake Store search failed:", err.message);
    return [];
  }
};

const getProductById = async (productId) => {
  try {
    const data = await fakeStoreApi(`/products/${productId}`);
    return {
      id: data.id,
      name: data.title,
      price: data.price,
      image: data.image,
      description: data.description,
      category: data.category,
    };
  } catch (err) {
    console.error("Failed to fetch product details:", err.message);
    return null;
  }
};

const purchaseProduct = async (productId, userDetails) => {
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");

  // Simulate purchase – integrate payment gateway later
  console.log(
    `[ORDER] ${userDetails.name} (${userDetails.email}) purchased ${product.name} for ₦${product.price * 1500} (converted to NGN)`,
  );
  return {
    success: true,
    orderId: `ORDER-${Date.now()}`,
    message: `Order placed for ${product.name}`,
    product,
  };
};

module.exports = {
  searchProducts,
  getProductById,
  purchaseProduct,
};
