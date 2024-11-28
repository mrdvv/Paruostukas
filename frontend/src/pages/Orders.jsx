import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import useStore from '../store/store'; // Zustand store
import axios from 'axios';

const Orders = () => {
  const { isAdmin } = useStore((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = isAdmin
          ? 'http://localhost:8000/api/orders' // Admin endpoint
          : 'http://localhost:8000/api/orders/user'; // User-specific endpoint
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'All Orders' : 'Your Orders'}
      </Typography>
      {orders.length > 0 ? (
        <List>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order._id}`}
                  secondary={`Total Price: €${order.totalPrice.toFixed(2)} | Created At: ${new Date(
                    order.createdAt
                  ).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography>No orders found.</Typography>
      )}
    </Box>
  );
};

export default Orders;
