import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Alert,
  Button,
  Snackbar,
} from '@mui/material';
import { Delete, ShoppingCart, Refresh } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import Invoice from './Invoice';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity, getCartTotal } = useCart();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePurchaseAll = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to complete purchase');
        setLoading(false);
        return;
      }

      const successfulTransactions = [];
      
      // Process each cart item
      for (const item of cartItems) {
        try {
          // First check if camera still has enough stock
          const cameraResponse = await axios.get(`https://backend-project-akhir-245069416476.asia-southeast2.run.app/cameras/${item.camera_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (cameraResponse.data.stock < item.quantity) {
            setError(`Insufficient stock for ${item.camera.brand} ${item.camera.model}. Available: ${cameraResponse.data.stock}, Requested: ${item.quantity}`);
            setLoading(false);
            return;
          }

          // Create transaction directly as 'purchase' type
          const transactionResponse = await axios.post(
            'https://backend-project-akhir-245069416476.asia-southeast2.run.app/transactions',
            {
              cameraId: item.camera_id,
              quantity: item.quantity,
              transaction_type: 'purchase',
              transaction_date: new Date().toISOString().split('T')[0],
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          successfulTransactions.push({
            ...transactionResponse.data,
            camera: item.camera,
            quantity: item.quantity,
            total_price: item.total_price
          });
        } catch (error) {
          console.error(`Error processing ${item.camera.brand} ${item.camera.model}:`, error);
          setError(error.response?.data?.msg || `Error processing ${item.camera.brand} ${item.camera.model}`);
          setLoading(false);
          return;
        }
      }

      // If all transactions successful, clear cart and show invoice
      setSelectedTransactions(successfulTransactions.map(transaction => ({
        ...transaction,
        camera: {
          ...transaction.camera,
          price: transaction.total_price / transaction.quantity
        }
      })));
      setShowInvoice(true);
      setSuccess('Purchase successful! Thank you for your order.');
      clearCart(); // Clear the cart context
      
    } catch (error) {
      console.error('Error processing purchase:', error);
      setError(error.response?.data?.msg || 'Error processing purchase');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (cameraId) => {
    removeFromCart(cameraId);
    setSuccess('Item removed from cart');
  };

  const handleQuantityChange = (cameraId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cameraId);
      return;
    }
    updateQuantity(cameraId, newQuantity);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const total = getCartTotal();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }} className="container">
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ 
            width: '100%',
            fontFamily: 'Old Standard TT, serif',
            '& .MuiAlert-message': {
              fontFamily: 'Old Standard TT, serif'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            fontFamily: 'Old Standard TT, serif',
            '& .MuiAlert-message': {
              fontFamily: 'Old Standard TT, serif'
            }
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h4"
          sx={{ 
            fontFamily: 'Playfair Display, serif',
            color: 'var(--vintage-primary)',
            borderBottom: '2px solid var(--vintage-accent)',
            paddingBottom: '0.5rem'
          }}
        >
          My Vintage Cart
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Old Standard TT, serif',
            color: 'var(--vintage-text)'
          }}
        >
          {cartItems.length} items
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: 'var(--vintage-background)',
          border: '2px solid var(--vintage-primary)'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: 'var(--vintage-text)'
            }}
          >
            Your cart is empty
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1,
              fontFamily: 'Old Standard TT, serif',
              color: 'var(--vintage-text)'
            }}
          >
            Add some vintage cameras to get started!
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer 
            component={Paper}
            sx={{
              backgroundColor: 'var(--vintage-background)',
              border: '2px solid var(--vintage-primary)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--vintage-primary)' }}>
                  <TableCell sx={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--vintage-background)',
                    fontSize: '1.1rem'
                  }}>Camera</TableCell>
                  <TableCell align="right" sx={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--vintage-background)',
                    fontSize: '1.1rem'
                  }}>Unit Price</TableCell>
                  <TableCell align="center" sx={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--vintage-background)',
                    fontSize: '1.1rem'
                  }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--vintage-background)',
                    fontSize: '1.1rem'
                  }}>Total</TableCell>
                  <TableCell align="center" sx={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--vintage-background)',
                    fontSize: '1.1rem'
                  }}>Date Added</TableCell>
                  <TableCell align="center" sx={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--vintage-background)',
                    fontSize: '1.1rem'
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow 
                    key={item.camera_id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(210, 180, 140, 0.1)'
                      }
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'Old Standard TT, serif' }}>
                      {item.camera.brand} {item.camera.model}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'Old Standard TT, serif' }}>
                      ${Number(item.camera.price).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => handleQuantityChange(item.camera_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="btn btn-primary"
                          sx={{ minWidth: '30px', fontFamily: 'Old Standard TT, serif' }}
                        >
                          -
                        </Button>
                        <Typography sx={{ fontFamily: 'Old Standard TT, serif' }}>
                          {item.quantity}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleQuantityChange(item.camera_id, item.quantity + 1)}
                          className="btn btn-primary"
                          sx={{ minWidth: '30px', fontFamily: 'Old Standard TT, serif' }}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontFamily: 'Old Standard TT, serif',
                      color: 'var(--vintage-primary)',
                      fontWeight: 'bold'
                    }}>
                      ${(item.quantity * item.camera.price).toFixed(2)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Old Standard TT, serif' }}>
                      {formatDate(item.date_added)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleRemoveItem(item.camera_id)}
                        sx={{ 
                          color: 'var(--vintage-accent)',
                          '&:hover': {
                            color: 'var(--vintage-primary)'
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'var(--vintage-background)',
            border: '2px solid var(--vintage-primary)',
            borderRadius: '8px'
          }}>
            <Typography 
              variant="h5"
              sx={{ 
                fontFamily: 'Playfair Display, serif',
                color: 'var(--vintage-primary)'
              }}
            >
              Total: ${total.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={handlePurchaseAll}
              disabled={loading}
              startIcon={loading ? <Refresh /> : <ShoppingCart />}
              sx={{ 
                fontFamily: 'Old Standard TT, serif',
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Processing...' : 'Purchase All'}
            </Button>
          </Box>
        </>
      )}

      {showInvoice && (
        <Invoice
          transactions={selectedTransactions}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </Container>
  );
};

export default Cart;