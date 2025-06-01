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

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('https://backend-project-akhir-245069416476.asia-southeast2.run.app/auth/register', {
        username,
        email,
        password,
      });
      
      alert(response.data.msg || 'Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.msg || 'Registration failed. Please try again.');
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
            Join Our Vintage Community
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
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Create Account
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2"
                sx={{ 
                  fontFamily: 'Old Standard TT, serif',
                  color: 'var(--vintage-text)'
                }}
              >
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--vintage-primary)',
                    fontWeight: 'bold',
                    '&:hover': {
                      color: 'var(--vintage-accent)'
                    }
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 