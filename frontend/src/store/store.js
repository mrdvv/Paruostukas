import { create } from 'zustand';
import decodeJWT from '../utils/jwt';
import axios from 'axios';

const useStore = create((set, get) => ({
  // ------------------- AUTH STATE -------------------
  auth: {
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,
    isAdmin: (() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeJWT(token);
        return decoded?.role === 'admin';
      }
      return false;
    })(),
    login: async (token) => {
        const decoded = decodeJWT(token);
        const isAdmin = decoded?.role === 'admin';
      
        localStorage.setItem('token', token);
      
        set({
          auth: {
            isLoggedIn: true,
            token,
            isAdmin,
          },
        });
      
        // Fetch updated data after login
        const { fetchCart } = get().cart;
        const { fetchProducts } = get().products;
      
        await Promise.all([
          fetchCart(),       // Fetch the updated cart
          fetchProducts(),   // Fetch the updated products
          // Optionally, fetch other data like orders
        ]);
      },
    logout: () => {
      localStorage.removeItem('token');
      set({
        auth: {
          isLoggedIn: false,
          token: null,
          isAdmin: false,
        },
      });
    },
  },

  // ------------------- CART STATE -------------------
  cart: {
    items: [],
    fetchCart: async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
    
            console.log('Cart Fetch Response:', response.data); // Debug API response
            set((state) => ({
                cart: { ...state.cart, items: response.data.data || [] },
            }));
        } catch (error) {
            console.error('Error fetching cart:', error.message);
        }
    },
    
    addToCart: async (productID) => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/cart',
          { productID },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        set((state) => ({
          cart: { ...state.cart, items: response.data.data.products },
        }));
      } catch (error) {
        console.error('Error adding to cart:', error.response?.data || error.message);
      }
    },
    removeFromCart: async (productID) => {
        try {
          const response = await axios.delete(
            `http://localhost:8000/api/cart/${productID}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          console.log('api response:', response.data);
          if (response.data.success) {
            set((state) => ({
              cart: { ...state.cart, items: response.data.data },
            }));
          } else {
            console.error('Failed to remove product from cart:', response.data.message);
          }
        } catch (error) {
          console.error('Error removing product from cart:', error.message);
        }
    },  
    updateQuantity: async (productID, quantity) => {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/cart/${productID}`,
          { quantity },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        set((state) => ({
          cart: { ...state.cart, items: response.data.data.products },
        }));
      } catch (error) {
        console.error('Error updating quantity in cart:', error);
      }
    },
    clearCart: async () => {
      try {
        await axios.delete('http://localhost:8000/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set((state) => ({
          cart: { ...state.cart, items: [] },
        }));
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    },
    calculateTotal: () => {
      const total = get().cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      return total.toFixed(2);
    },
  },

  // ------------------- CHECKOUT STATE -------------------
  checkout: {
    order: null,
    isCheckingOut: false,
    checkout: async (shippingAddress) => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/orders',
          { shippingAddress },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        set((state) => ({
          checkout: { ...state.checkout, order: response.data.data },
        }));

        // Clear the cart after checkout
        get().cart.clearCart();
        return response.data.data;
      } catch (error) {
        console.error('Error during checkout:', error.response?.data || error.message);
        throw error;
      }
    },
  },

  // ------------------- PRODUCT STATE -------------------
  products: {
    list: [],
    fetchProducts: async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        set((state) => ({
          products: { ...state.products, list: response.data.data },
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    createProduct: async (newProduct) => {
      try {
        const response = await axios.post('http://localhost:8000/api/products', newProduct, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set((state) => ({
          products: { ...state.products, list: [...state.products.list, response.data.data] },
        }));
        return { success: true, message: 'Product created successfully' };
      } catch (error) {
        return { success: false, message: error.message || 'Error creating product' };
      }
    },
    deleteProduct: async (productID) => {
      try {
        await axios.delete(`http://localhost:8000/api/products/${productID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set((state) => ({
          products: { ...state.products, list: state.products.list.filter((p) => p.productID !== productID) },
        }));
        return { success: true, message: 'Product deleted successfully' };
      } catch (error) {
        return { success: false, message: 'Error deleting product' };
      }
    },
    updateProduct: async (productID, updatedProduct) => {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/products/${productID}`,
          updatedProduct,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        set((state) => ({
          products: {
            ...state.products,
            list: state.products.list.map((p) =>
              p.productID === productID ? response.data.data : p
            ),
          },
        }));
        return { success: true, message: 'Product updated successfully' };
      } catch (error) {
        return { success: false, message: 'Error updating product' };
      }
    },
    toggleRating: async (productID, increment) => {
        try {
          const response = await axios.put(
            `http://localhost:8000/api/products/${productID}/rating`,
            {}, // No body required since `isAuthenticated` middleware handles the user
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          set((state) => ({
            products: {
              ...state.products,
              list: state.products.list.map((p) =>
                p._id === productID ? { ...p, rating: response.data.data.rating } : p
              ),
            },
          }));
          return { success: true, message: 'Rating updated successfully' };
        } catch (error) {
          console.error('Error toggling rating:', error.message);
          return { success: false, message: 'Error toggling rating' };
        }
      }
    },
      
}));

export default useStore;
