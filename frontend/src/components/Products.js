import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

// Base64 encoded placeholder image
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U5ZTllOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';

const Products = () => {
  const { addToCart, cartItems } = useCart();
  const [cameras, setCameras] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get('https://backend-project-akhir-245069416476.asia-southeast2.run.app/cameras');
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
      setError(error.response?.data?.msg || 'Error fetching cameras');
    }
  };

  const handleAddToCart = (camera) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add items to cart');
        return;
      }

      if (camera.stock < 1) {
        setError('This item is out of stock');
        return;
      }

      // Check if item already in cart and calculate total quantity
      const existingCartItem = cartItems.find(item => item.camera_id === camera.id);
      const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
      
      if (currentCartQuantity >= camera.stock) {
        setError(`Cannot add more items. Maximum available: ${camera.stock}`);
        return;
      }

      addToCart(camera);
      setSuccessMessage(`${camera.brand} ${camera.model} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add camera to cart');
    }
  };

  const getItemInCart = (cameraId) => {
    return cartItems.find(item => item.camera_id === cameraId);
  };

  const filteredCameras = cameras
    .filter(camera => 
      (!filterType || camera.type === filterType) &&
      (!searchTerm || 
        camera.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }} className="container">
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error"
          sx={{
            fontFamily: 'Old Standard TT, serif',
            '& .MuiAlert-message': {
              fontFamily: 'Old Standard TT, serif'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage('')}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success"
          sx={{
            fontFamily: 'Old Standard TT, serif',
            '& .MuiAlert-message': {
              fontFamily: 'Old Standard TT, serif'
            }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search cameras"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              fontFamily: 'Old Standard TT, serif',
            },
            '& .MuiInputLabel-root': {
              fontFamily: 'Old Standard TT, serif',
            }
          }}
          className="form-control"
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ fontFamily: 'Old Standard TT, serif' }}>Filter by Type</InputLabel>
          <Select
            value={filterType}
            label="Filter by Type"
            onChange={(e) => setFilterType(e.target.value)}
            sx={{
              fontFamily: 'Old Standard TT, serif',
              '& .MuiMenuItem-root': {
                fontFamily: 'Old Standard TT, serif',
              }
            }}
            className="form-control"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="SLR">SLR</MenuItem>
            <MenuItem value="Rangefinder">Rangefinder</MenuItem>
            <MenuItem value="Point-and-Shoot">Point-and-Shoot</MenuItem>
            <MenuItem value="TLR">TLR</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontFamily: 'Playfair Display, serif',
          color: 'var(--vintage-primary)',
          borderBottom: '2px solid var(--vintage-accent)',
          paddingBottom: '0.5rem',
          marginBottom: '2rem'
        }}
      >
        Vintage Camera Collection
      </Typography>

      <Grid container spacing={4}>
        {filteredCameras.map((camera) => {
          const itemInCart = getItemInCart(camera.id);
          const availableStock = camera.stock - (itemInCart ? itemInCart.quantity : 0);
          
          return (
            <Grid item key={camera.id} xs={12} sm={6} md={4}>
              <Card className="card">
                <CardMedia
                  component="img"
                  height="200"
                  image={camera.image_link || PLACEHOLDER_IMAGE}
                  alt={`${camera.brand} ${camera.model}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                  sx={{
                    filter: 'sepia(0.3)',
                    transition: 'filter 0.3s ease',
                    '&:hover': {
                      filter: 'sepia(0)',
                    },
                    objectFit: 'cover'
                  }}
                />
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontFamily: 'Playfair Display, serif',
                      color: 'var(--vintage-text)'
                    }}
                  >
                    {camera.brand} {camera.model}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'var(--vintage-text)',
                      fontFamily: 'Old Standard TT, serif',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Type: {camera.type}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: 'var(--vintage-text)',
                      fontFamily: 'Old Standard TT, serif',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Year: {camera.year_released}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: 'var(--vintage-text)',
                      fontFamily: 'Old Standard TT, serif',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Format: {camera.format}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'var(--vintage-primary)',
                      fontFamily: 'Playfair Display, serif',
                      marginTop: '1rem'
                    }}
                  >
                    ${Number(camera.price).toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: camera.stock > 0 ? 'var(--vintage-primary)' : 'var(--vintage-accent)',
                      fontFamily: 'Old Standard TT, serif',
                      marginTop: '0.5rem'
                    }}
                  >
                    Stock: {camera.stock} available
                  </Typography>
                  {itemInCart && (
                    <Typography 
                      variant="body2"
                      sx={{
                        color: 'var(--vintage-secondary)',
                        fontFamily: 'Old Standard TT, serif',
                        marginTop: '0.5rem'
                      }}
                    >
                      In cart: {itemInCart.quantity}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    className="btn btn-primary"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(camera)}
                    disabled={availableStock < 1}
                    sx={{
                      marginTop: '1rem',
                      fontFamily: 'Old Standard TT, serif'
                    }}
                  >
                    {availableStock < 1 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Products;