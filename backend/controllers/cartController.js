import Cart from '../models/cart.js';
import product from '../models/product.js';

// Add item to cart
export const addItemToCart = async (req, res) => {
    try {
        const userID = req.user._id; // Extract from auth middleware
        const { productID } = req.body;

        const cartItem = await Cart.findOne({ userID });
        const productExists = await product.findById(productID);

        if (!productExists) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!cartItem) {
            const newCartItem = new Cart({ userID, products: [{ product: productID, quantity: 1 }] });
            await newCartItem.save();
            const populatedCart = await Cart.findOne({ userID }).populate('products.product', 'name price image');
            return res.status(201).json({ success: true, data: populatedCart });
        }

        const productIndex = cartItem.products.findIndex(item => item.product.toString() === productID);
        if (productIndex === -1) {
            cartItem.products.push({ product: productID, quantity: 1 });
        } else {
            cartItem.products[productIndex].quantity += 1;
        }

        await cartItem.save();
        const populatedCart = await Cart.findOne({ userID }).populate('products.product', 'name price image');
        return res.status(200).json({ success: true, data: populatedCart });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
    try {
      const userID = req.user._id; // User ID from middleware
      const productID = req.params.id; // Product ID from route parameter
  
      const cart = await Cart.findOne({ userID }); // Find the cart for the user
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
  
      // Remove the product from the cart
      cart.products = cart.products.filter((item) => item.product.toString() !== productID);
  
      await cart.save(); // Save the updated cart
  
      // Populate the updated cart before sending the response
      const updatedCart = await Cart.findOne({ userID }).populate('products.product', 'name price image');
      res.status(200).json({ success: true, data: updatedCart.products }); // Send updated cart
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Update item quantity in cart
export const updateItemQuantity = async (req, res) => {
    try {
      const userID = req.user._id; // Extract user from middleware
      const productID = req.params.id; // Extract product ID from route parameter
      const { quantity } = req.body; // Extract quantity from request body
  
      // Validate quantity
      if (quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
      }
  
      // Find the user's cart
      const cartItem = await Cart.findOne({ userID });
      if (!cartItem) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
  
      // Find the product in the cart
      const productIndex = cartItem.products.findIndex(item => item.product.toString() === productID);
      if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
      }
  
      // Update the quantity of the product
      cartItem.products[productIndex].quantity = quantity;
  
      // Save the updated cart
      await cartItem.save();
  
      // Populate the updated cart and send the response
      const updatedCart = await Cart.findOne({ userID }).populate('products.product', 'name price image');
      return res.status(200).json({ success: true, data: updatedCart });
    } catch (error) {
      console.error('Error updating quantity in cart:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

// Get cart items
export const getCartItems = async (req, res) => {
    try {
        const userID = req.user._id;

        console.log('Fetching cart for User ID:', userID); // Debug
        const userCart = await Cart.findOne({ userID }).populate('products.product', 'name price image');

        if (!userCart || userCart.products.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        console.log('Fetched Cart Items:', userCart.products); // Debug
        res.status(200).json({ success: true, data: userCart.products });
    } catch (error) {
        console.error('Error in getCartItems:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Empty cart
export const emptyCart = async (req, res) => {
    try {
        const userID = req.user._id; // Extract from auth middleware
        const cartItem = await cart.findOne({ userID });
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        cartItem.products = [];
        await cartItem.save();

        const populatedCart = await cart.findOne({ userID }).populate('products.product', 'name price image');
        return res.status(200).json({ success: true, data: populatedCart });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
