import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('https://backend-project-akhir-245069416476.asia-southeast2.run.app/auth/login', {
        username,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ username }));
      
      // Call onLoginSuccess to update parent component
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      navigate('/products');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm" className="container">
      <Box sx={{ mt: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            backgroundColor: 'var(--vintage-background)',
            border: '2px solid var(--vintage-primary)',
            borderRadius: '8px'
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: 'var(--vintage-primary)',
              borderBottom: '2px solid var(--vintage-accent)',
              paddingBottom: '0.5rem',
              marginBottom: '2rem'
            }}
          >
            Welcome Back
          </Typography>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                fontFamily: 'Old Standard TT, serif',
                '& .MuiAlert-message': {
                  fontFamily: 'Old Standard TT, serif'
                }
              }}
            >
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              className="form-control"
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Old Standard TT, serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Old Standard TT, serif',
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              className="form-control"
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Old Standard TT, serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Old Standard TT, serif',
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="btn btn-primary"
              sx={{ 
                mt: 3,
                fontFamily: 'Old Standard TT, serif',
                fontSize: '1.1rem'
              }}
            >
              Sign In
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2"
                sx={{ 
                  fontFamily: 'Old Standard TT, serif',
                  color: 'var(--vintage-text)'
                }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--vintage-primary)',
                    fontWeight: 'bold',
                    '&:hover': {
                      color: 'var(--vintage-accent)'
                    }
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 