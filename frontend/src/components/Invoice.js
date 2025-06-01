import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';

const Invoice = ({ transactions = [], onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate total from transactions
  const calculatedTotal = transactions.reduce((sum, transaction) => 
    sum + (transaction.quantity * transaction.camera.price), 0
  );

  return (
    <Dialog 
      open={true}
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--vintage-background)',
          border: '2px solid var(--vintage-primary)',
          borderRadius: '8px'
        }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h5" 
          align="center"
          sx={{ 
            fontFamily: 'Playfair Display, serif',
            color: 'var(--vintage-primary)',
            borderBottom: '2px solid var(--vintage-accent)',
            paddingBottom: '0.5rem'
          }}
        >
          Vintage Camera Store Invoice
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: 'var(--vintage-primary)'
            }}
          >
            Vintage Camera Store
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              fontFamily: 'Old Standard TT, serif',
              color: 'var(--vintage-text)',
              mb: 1
            }}
          >
            Invoice Date: {formatDate(new Date())}
          </Typography>
          {transactions.length > 0 && (
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: 'Old Standard TT, serif',
                color: 'var(--vintage-text)'
              }}
            >
              Transaction ID: {transactions.map(t => t.id).join(', ')}
            </Typography>
          )}
        </Box>

        <TableContainer 
          component={Paper} 
          variant="outlined"
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
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(210, 180, 140, 0.1)'
                    }
                  }}
                >
                  <TableCell sx={{ fontFamily: 'Old Standard TT, serif' }}>
                    {transaction.camera.brand} {transaction.camera.model}
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Old Standard TT, serif' }}>
                    ${Number(transaction.camera.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontFamily: 'Old Standard TT, serif' }}>
                    {transaction.quantity}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontFamily: 'Old Standard TT, serif',
                      color: 'var(--vintage-primary)',
                      fontWeight: 'bold'
                    }}
                  >
                    ${(transaction.quantity * transaction.camera.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ 
          mt: 3, 
          textAlign: 'right',
          padding: '1rem',
          backgroundColor: 'rgba(210, 180, 140, 0.1)',
          border: '1px solid var(--vintage-primary)',
          borderRadius: '4px'
        }}>
          <Typography 
            variant="h6"
            sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: 'var(--vintage-primary)'
            }}
          >
            Total Amount: ${calculatedTotal.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'Old Standard TT, serif',
              color: 'var(--vintage-text)',
              mb: 1
            }}
          >
            Thank you for your purchase from our vintage collection!
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'Old Standard TT, serif',
              color: 'var(--vintage-text)'
            }}
          >
            For any inquiries about your vintage camera, please contact our expert customer service.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid var(--vintage-secondary)' }}>
        <Button 
          onClick={handlePrint} 
          className="btn btn-primary"
          sx={{ 
            fontFamily: 'Old Standard TT, serif'
          }}
        >
          Print Invoice
        </Button>
        <Button 
          onClick={onClose}
          sx={{ 
            fontFamily: 'Old Standard TT, serif',
            color: 'var(--vintage-text)',
            '&:hover': {
              color: 'var(--vintage-primary)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Invoice;