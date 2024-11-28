import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store.js'; // Zustand store

const Navbar = () => {
  const { isLoggedIn, logout } = useStore((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = useStore((state) => state.auth.isAdmin);
  const handleLogout = () => {
    logout(); // Clear user authentication state
    navigate('/'); // Redirect to the homepage or any other route after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color='inherit' href="/">
          My App
        </Button>
        <Box>
        <Button color="inherit" href="/cart">
            Cart
          </Button>
          <Button color="inherit" href="/orders">
            Orders
          </Button>
          {isAdmin && (
          <Button color="inherit" href="/create-product">
            create product
          </Button>
          )}
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" href="/register">
                Registration
              </Button>
              <Button color="inherit" href="/login">
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
