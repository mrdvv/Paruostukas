import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import useStore from '../store/store'; // Zustand store

const Cart = () => {
    const { items, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart, calculateTotal } = useStore((state) => state.cart);
    const navigate = useNavigate();
    // Fetch cart items on page load
    useEffect(() => {
        fetchCart();
    }, []); // Empty dependency array to only run on page load

    console.log('Cart Items in Page:', items); // Debug cart items

    // Increment product quantity
    const handleIncrement = (product) => {
        addToCart(product.product._id); // Backend product ID
    };

    // Decrement product quantity
    const handleDecrement = (product) => {
        if (product.quantity > 1) {
            // Decrease quantity
            updateQuantity(product.product._id, product.quantity - 1);
        }
    };

    // Remove product completely
    const handleRemove = (product) => {
        removeFromCart(product.product._id); // Remove product entirely
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>

            {items.length === 0 ? (
                <Typography variant="h6">Your cart is empty</Typography>
            ) : (
                <>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item.product._id} sx={{ borderBottom: '1px solid #eee' }}>
                                {/* Product Image */}
                                <ListItemAvatar>
                                    <Avatar
                                        src={item.product.image || 'https://via.placeholder.com/150'}
                                        alt={item.product.name}
                                    />
                                </ListItemAvatar>

                                {/* Product Details */}
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`Price: €${item.product.price.toFixed(2)} | Total: €${(
                                        item.product.price * item.quantity
                                    ).toFixed(2)}`}
                                />

                                {/* Quantity Controls */}
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={() => handleDecrement(item)} disabled={item.quantity <= 1}>
                                        <Remove />
                                    </IconButton>
                                    <TextField
                                        value={item.quantity}
                                        inputProps={{
                                            readOnly: true,
                                            style: { textAlign: 'center', width: 30 },
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <IconButton onClick={() => handleIncrement(item)}>
                                        <Add />
                                    </IconButton>
                                </Box>

                                {/* Remove Button */}
                                <IconButton onClick={() => handleRemove(item)} sx={{ ml: 2 }}>
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* Cart Summary */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                        <Typography variant="h6">Total Amount: €{calculateTotal()}</Typography>
                        <Box>
                            <Button variant="outlined" color="error" onClick={clearCart} sx={{ mr: 2 }}>
                                Clear Cart
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/checkout')}
                            >
                                Checkout
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Cart;
