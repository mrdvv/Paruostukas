import Order from '../models/order.js';
import Cart from '../models/cart.js';
import ShippingAddress from '../models/shippingAddress.js';

export const createOrder = async (req, res) => {
  try {
    const userID = req.user._id; // Extract user from middleware
    const { shippingAddress: addressFromBody } = req.body; // Get shipping address from request body

    console.log('Received req.body in backend:', req.body);

    // Validate shipping address fields
    const { postalCode, city, country, street } = addressFromBody;
    if (!postalCode || !city || !country || !street) {
      return res.status(400).json({ success: false, message: 'All shipping address fields are required.' });
    }

    // Find or create a shipping address for the user
    let shippingAddress = await ShippingAddress.findOne({ userID });
    if (!shippingAddress) {
      shippingAddress = new ShippingAddress({ userID, postalCode, city, country, street });
      await shippingAddress.save();
    }

    // Find the user's cart
    const userCart = await Cart.findOne({ userID }).populate('products.product', 'name price');
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Calculate total price
    const totalPrice = userCart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create the order
    const newOrder = new Order({
      userID,
      products: userCart.products,
      totalPrice,
      shippingAddress: shippingAddress._id, // Reference the shipping address
    });

    await newOrder.save();

    // Clear the cart after checkout
    userCart.products = [];
    await userCart.save();

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error in createOrder:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for a user
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('userID', 'name email'); // Populate user details
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
  // Get user-specific orders
  export const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userID: req.user._id }).populate('products.product', 'name price'); // Filter by logged-in user
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };