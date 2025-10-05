import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const ADMIN_PASSWORD = 'admin123';

function LoginDialog({ open, onClose, onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://sbi-2.onrender.com/api/auth/login', { password });
      if (response.data.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        onLogin(true);
        onClose();
      }
    } catch (err) {
      setError('Invalid password');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Admin Login</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Login</Button>
      </DialogActions>
    </Dialog>
  );
}

function CustomerForm() {
  const [form, setForm] = useState({ name: '', location: '', email: '', mobile: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://sbi-2.onrender.com/api/customers', form);
      setSuccess('Customer information submitted successfully!');
      setForm({ name: '', location: '', email: '', mobile: '' });
      setError('');
    } catch (err) {
      setError('Failed to submit. Make sure email and mobile are unique.');
      setSuccess('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://www.sbi.co.in/documents/16012/14007/sbi-logo.png)', // SBI logo as background
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h5" gutterBottom align="center">SBI Credit Card Application</Typography>
        <Typography variant="body2" gutterBottom align="center">Please provide your details below</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} required margin="normal" fullWidth />
          <TextField label="Location" name="location" value={form.location} onChange={handleChange} required margin="normal" fullWidth />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required margin="normal" fullWidth />
          <TextField label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} required margin="normal" fullWidth />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
        </form>
      </Paper>
    </Box>
  );
}

function AddCustomer({ onAdd }) {
  const [form, setForm] = useState({ name: '', location: '', email: '', mobile: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://sbi-2.onrender.com/api/customers', form);
      onAdd();
      setForm({ name: '', location: '', email: '', mobile: '' });
      setError('');
    } catch (err) {
      setError('Failed to add customer. Make sure email and mobile are unique.');
    }
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>Add Customer</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required margin="normal" fullWidth />
        <TextField label="Location" name="location" value={form.location} onChange={handleChange} required margin="normal" fullWidth />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required margin="normal" fullWidth />
        <TextField label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} required margin="normal" fullWidth />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add</Button>
      </form>
    </Box>
  );
}

function CustomerList({ customers }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Customer List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((cust) => (
              <TableRow key={cust._id}>
                <TableCell>{cust.name}</TableCell>
                <TableCell>{cust.location}</TableCell>
                <TableCell>{cust.email}</TableCell>
                <TableCell>{cust.mobile}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function Dashboard({ onLogout }) {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://sbi-2.onrender.com/api/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" color="secondary" onClick={() => {
          localStorage.removeItem('adminLoggedIn');
          onLogout();
        }}>Logout</Button>
      </Box>
      <AddCustomer onAdd={fetchCustomers} />
      <CustomerList customers={customers} />
    </Container>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('adminLoggedIn') === 'true');
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div>
      {!loggedIn && (
        <Box position="fixed" top={16} right={16} zIndex={1000}>
          <Button variant="contained" color="secondary" onClick={() => setLoginOpen(true)}>Admin Login</Button>
        </Box>
      )}
      {loggedIn ? (
        <Dashboard onLogout={() => setLoggedIn(false)} />
      ) : (
        <CustomerForm />
      )}
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={() => setLoggedIn(true)} />
    </div>
  );
}

export default App;
