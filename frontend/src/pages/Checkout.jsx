import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from '@mui/material';
import useStore from '../store/store';

const Checkout = () => {
  const { items, calculateTotal } = useStore((state) => state.cart);
  const { checkout } = useStore((state) => state.checkout);

  const [shippingAddress, setShippingAddress] = useState({
    postalCode: '',
    city: '',
    country: '',
    street: '',
  });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleCheckout = async () => {
    if (!shippingAddress.postalCode || !shippingAddress.city || !shippingAddress.country || !shippingAddress.street) {
      setError('All shipping address fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newOrder = await checkout({
        postalCode: shippingAddress.postalCode,
        city: shippingAddress.city,
        country: shippingAddress.country,
        street: shippingAddress.street,

      });
      setOrder(newOrder);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {order ? (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Order ID: {order._id}
          </Typography>
        </>
      ) : (
        <>
          <List>
            {items.map((item) => (
              <ListItem key={item.product._id}>
                <ListItemAvatar>
                  <Avatar src={item.product.image || 'https://via.placeholder.com/150'} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.product.name}
                  secondary={`Price: €${item.product.price.toFixed(2)} | Quantity: ${item.quantity}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: €{calculateTotal()}
          </Typography>

          <TextField
            name="postalCode"
            label="Postal Code"
            fullWidth
            margin="normal"
            value={shippingAddress.postalCode}
            onChange={handleInputChange}
          />
          <TextField
            name="city"
            label="City"
            fullWidth
            margin="normal"
            value={shippingAddress.city}
            onChange={handleInputChange}
          />
          <TextField
            name="country"
            label="Country"
            fullWidth
            margin="normal"
            value={shippingAddress.country}
            onChange={handleInputChange}
          />
          <TextField
            name="street"
            label="Street"
            fullWidth
            margin="normal"
            value={shippingAddress.street}
            onChange={handleInputChange}
          />
          {error && <Typography color="error">{error}</Typography>}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Checkout'}
          </Button>
        </>
      )}
    </Box>
  );
};

export default Checkout;
