import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    created_at: ''
  });
  const [originalProfile, setOriginalProfile] = useState({
    username: '',
    email: '',
    created_at: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('https://backend-project-akhir-245069416476.asia-southeast2.run.app/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.user) {
        setProfile(response.data.user);
        setOriginalProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(error.response?.data?.msg || 'Gagal mengambil data profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        'https://backend-project-akhir-245069416476.asia-southeast2.run.app/users/profile',
        {
          username: profile.username,
          email: profile.email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.user) {
        setProfile(response.data.user);
        setOriginalProfile(response.data.user);
        
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess(response.data.msg);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.msg || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        'https://backend-project-akhir-245069416476.asia-southeast2.run.app/users/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            password: password
          }
        }
      );

      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error.response?.data?.msg || 'Gagal menghapus akun');
      setShowDeleteDialog(false);
      setPassword('');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="sm" className="container">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          backgroundColor: 'var(--vintage-background)',
          border: '2px solid var(--vintage-primary)',
          borderRadius: '8px'
        }}>
          <CircularProgress sx={{ color: 'var(--vintage-primary)' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="container">
      <Box sx={{ mt: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            backgroundColor: 'var(--vintage-background)',
            border: '2px solid var(--vintage-primary)',
            borderRadius: '8px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'var(--vintage-primary)',
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem'
              }}
            >
              {profile.username ? profile.username[0].toUpperCase() : '?'}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: 'Playfair Display, serif',
                  color: 'var(--vintage-primary)'
                }}
              >
                {profile.username}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'Old Standard TT, serif',
                  color: 'var(--vintage-text)'
                }}
              >
                Member since {formatDate(profile.created_at)}
              </Typography>
            </Box>
          </Box>

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

          <form>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
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
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
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

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              {!isEditing ? (
                <>
                  <Button
                    variant="contained"
                    className="btn btn-primary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ 
                      fontFamily: 'Old Standard TT, serif',
                      flex: 1
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setShowDeleteDialog(true)}
                    sx={{ 
                      fontFamily: 'Old Standard TT, serif',
                      color: 'var(--vintage-accent)',
                      borderColor: 'var(--vintage-accent)',
                      '&:hover': {
                        borderColor: 'var(--vintage-accent)',
                        backgroundColor: 'rgba(139, 69, 19, 0.04)'
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    className="btn btn-primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ 
                      fontFamily: 'Old Standard TT, serif',
                      flex: 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ 
                      fontFamily: 'Old Standard TT, serif',
                      color: 'var(--vintage-text)',
                      borderColor: 'var(--vintage-text)',
                      flex: 1,
                      '&:hover': {
                        borderColor: 'var(--vintage-text)',
                        backgroundColor: 'rgba(70, 62, 63, 0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </form>
        </Paper>
      </Box>

      <Dialog 
        open={showDeleteDialog} 
        onClose={() => setShowDeleteDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--vintage-background)',
            border: '2px solid var(--vintage-primary)',
            borderRadius: '8px'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Playfair Display, serif',
          color: 'var(--vintage-primary)',
          borderBottom: '2px solid var(--vintage-accent)',
          pb: 2
        }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography 
            sx={{ 
              mt: 2,
              fontFamily: 'Old Standard TT, serif',
              color: 'var(--vintage-text)'
            }}
          >
            Please enter your password to confirm account deletion:
          </Typography>
          <TextField
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
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
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              setShowDeleteDialog(false);
              setPassword('');
            }}
            sx={{ 
              fontFamily: 'Old Standard TT, serif',
              color: 'var(--vintage-text)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            disabled={!password || deleting}
            className="btn btn-primary"
            sx={{ 
              fontFamily: 'Old Standard TT, serif'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;