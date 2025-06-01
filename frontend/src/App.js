import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Badge,
  Menu,
  MenuItem,
  IconButton,
  Fade,
  LinearProgress,
} from '@mui/material';
import { ShoppingCart as CartIcon, AccountCircle, Home as HomeIcon } from '@mui/icons-material';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Cart from './components/Cart';
import Profile from './components/Profile';
import { CartProvider, useCart } from './context/CartContext';
import './vintage-theme.css';

const NavBar = ({ isLoggedIn, handleLogout }) => {
  const { cartItems } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
      sx={{
        transition: 'all 0.3s ease-in-out',
        background: isScrolled ? 'rgba(139, 115, 85, 0.95)' : 'var(--vintage-primary)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            className="navbar-brand"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <HomeIcon sx={{ fontSize: '2rem' }} />
            Vintage Camera Store
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isLoggedIn ? (
            <>
              <Fade in={true}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/products" 
                  className="nav-link"
                >
                  Products
                </Button>
              </Fade>
              <Fade in={true} style={{ transitionDelay: '100ms' }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/cart"
                  className="nav-link"
                  startIcon={
                    <Badge 
                      badgeContent={cartItems.length} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          animation: cartItems.length ? 'pulse 1.5s infinite' : 'none',
                        }
                      }}
                    >
                      <CartIcon />
                    </Badge>
                  }
                >
                  Cart
                </Button>
              </Fade>
              <Fade in={true} style={{ transitionDelay: '200ms' }}>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleMenu}
                  className="nav-link"
                  sx={{ 
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <AccountCircle />
                </IconButton>
              </Fade>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    backgroundColor: '#F5F5DC',
                    border: '2px solid #8B7355',
                    borderRadius: '8px',
                    mt: 1.5,
                  }
                }}
              >
                <MenuItem 
                  component={Link} 
                  to="/profile" 
                  onClick={handleClose}
                  sx={{ 
                    fontFamily: 'Old Standard TT, serif',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 115, 85, 0.1)',
                    }
                  }}
                >
                  My Profile
                </MenuItem>
                <MenuItem 
                  onClick={() => { handleClose(); handleLogout(); }}
                  sx={{ 
                    fontFamily: 'Old Standard TT, serif',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 115, 85, 0.1)',
                    }
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Fade in={true}>
                <Button color="inherit" component={Link} to="/login" className="nav-link">
                  Login
                </Button>
              </Fade>
              <Fade in={true} style={{ transitionDelay: '100ms' }}>
                <Button color="inherit" component={Link} to="/register" className="nav-link">
                  Register
                </Button>
              </Fade>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);

    // Check login status when component mounts
    setIsLoggedIn(!!localStorage.getItem('token'));

    // Add event listener for storage changes
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'var(--vintage-background)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'Playfair Display',
            color: 'var(--vintage-primary)',
            marginBottom: 3
          }}
        >
          Vintage Camera Store
        </Typography>
        <LinearProgress 
          sx={{ 
            width: '200px',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--vintage-primary)'
            }
          }} 
        />
      </Box>
    );
  }

  return (
    <CartProvider>
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <Box sx={{ 
            flexGrow: 1,
            paddingTop: '80px', // Account for fixed navbar
            paddingBottom: '2rem'
          }}>
            <Container maxWidth="lg" className="fade-in">
              <Routes>
                <Route 
                  path="/login" 
                  element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} 
                />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/products"
                  element={
                    <PrivateRoute>
                      <Products />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to="/products" />}
                />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </CartProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default App; 