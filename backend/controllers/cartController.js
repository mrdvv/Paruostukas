import cart from '../models/cart';
import product from '../models/product';

// Add item to cart
export const addItemToCart = async (req, res) => {
    try {
        const { userID, productID } = req.body;
        const cartItem = await cart.findOne({ userID });

        const productExists = await product.findById(productID);

        if (!productExists) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!cartItem) {
            const newCartItem = new cart({ userID, products: [{ product: productID, quantity: 1 }] });
            await newCartItem.save();
            return res.status(201).json({ success: true, data: newCartItem });
        }
        const productIndex = cartItem.products.findIndex(item => item.product.toString() === productID);
        if (productIndex === -1) {
            cartItem.products.push({ product: productID, quantity: 1 });
        } else {
            cartItem.products[productIndex].quantity += 1;
        }
        await cartItem.save();
        return res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
    try {
        const { userID, productID } = req.body;
        const cartItem = await cart.findOne({ userID });
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        const productIndex = cartItem.products.findIndex(item => item.product.toString() === productID);
        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
        cartItem.products = cartItem.products.filter(item => item.product.toString() !== productID);
        await cartItem.save();
        return res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Update item quantity in cart
export const updateItemQuantity = async (req, res) => {
    try {
        const { userID, productID, quantity } = req.body;
        const cartItem = await cart.findOne({ userID });
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        const productIndex = cartItem.products.findIndex(item => item.product.toString() === productID);
        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
        cartItem.products[productIndex].quantity = quantity;
        await cartItem.save();
        return res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Get cart items
export const getCartItems = async (req, res) => {
    try {
        const { userID } = req.body;
        const cartItem = await cart.findOne({ userID }).populate('products.product', 'name price image');
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        return res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Empty cart
export const emptyCart = async (req, res) => {
    try {
        const { userID } = req.body;
        const cartItem = await cart.findOne({ userID });
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        cartItem.products = [];
        await cartItem.save();
        return res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
