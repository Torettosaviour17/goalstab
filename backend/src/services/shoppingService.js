const axios = require("axios");

const dummyJsonApi = async (endpoint) => {
  const url = `https://dummyjson.com${endpoint}`;
  const res = await axios.get(url);
  return res.data;
};

const searchProducts = async (query) => {
  try {
    // Try Fake Store first
    const fakeStoreRes = await axios.get("https://fakestoreapi.com/products");
    const products = fakeStoreRes.data;
    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery),
    );
    if (filtered.length) {
      return filtered.map((p) => ({
        id: p.id,
        name: p.title,
        price: p.price,
        image: p.image,
        link: `https://fakestoreapi.com/products/${p.id}`,
        description: p.description,
        category: p.category,
      }));
    }
    // Fallback to DummyJSON if no matches
    const dummyData = await dummyJsonApi(
      `/products/search?q=${encodeURIComponent(query)}`,
    );
    return dummyData.products.map((p) => ({
      id: p.id,
      name: p.title,
      price: p.price,
      image: p.thumbnail,
      link: `https://dummyjson.com/products/${p.id}`,
      description: p.description,
      category: p.category,
    }));
  } catch (err) {
    console.error("Fake Store failed, falling back to DummyJSON:", err.message);
    try {
      const dummyData = await dummyJsonApi(
        `/products/search?q=${encodeURIComponent(query)}`,
      );
      return dummyData.products.map((p) => ({
        id: p.id,
        name: p.title,
        price: p.price,
        image: p.thumbnail,
        link: `https://dummyjson.com/products/${p.id}`,
        description: p.description,
        category: p.category,
      }));
    } catch (err2) {
      console.error("Both APIs failed:", err2.message);
      return [];
    }
  }
};

const getProductById = async (productId) => {
  try {
    const data = await axios.get(
      `https://fakestoreapi.com/products/${productId}`,
    );
    return {
      id: data.data.id,
      name: data.data.title,
      price: data.data.price,
      image: data.data.image,
      description: data.data.description,
      category: data.data.category,
    };
  } catch (err) {
    try {
      const data = await dummyJsonApi(`/products/${productId}`);
      return {
        id: data.id,
        name: data.title,
        price: data.price,
        image: data.thumbnail,
        description: data.description,
        category: data.category,
      };
    } catch (err2) {
      console.error("Product fetch failed:", err2.message);
      return null;
    }
  }
};

const purchaseProduct = async (productId, userDetails) => {
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");
  console.log(
    `[ORDER] ${userDetails.name} (${userDetails.email}) purchased ${product.name} for ₦${product.price * 1500}`,
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
