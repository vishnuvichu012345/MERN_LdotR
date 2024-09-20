import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email, age };

    if (editId) {
      // Update existing user
      fetch(`/users/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }).then(() => {
        setEditId(null);
        resetForm();
        refreshUsers();
      });
    } else {
      // Add new user
      fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }).then(() => {
        resetForm();
        refreshUsers();
      });
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setEmail('');
    setAge('');
  };

  // Refresh users list
  const refreshUsers = () => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  };

  // Handle delete user
  const handleDelete = (id) => {
    fetch(`/users/${id}`, {
      method: 'DELETE',
    }).then(() => {
      refreshUsers();
    });
  };

  // Handle edit user (populate form with data for editing)
  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setEditId(user.mongoId); // Assuming `id` is unique
  };

  // DataGrid columns with action buttons
  const columns = [
    { field: 'id', headerName: 'ID', width: 90, flex: 1 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 200, flex: 1 },
    { field: 'age', headerName: 'Age', width: 100, flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.mongoId)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Prepare rows for DataGrid
  const rows = users.map((user, index) => ({
    id: index + 1,  // Generated row index ID for display
    mongoId: user._id,  // MongoDB _id for backend operations
    ...user,
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {editId ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} style={{ height: 400 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Paper>
    </Container>
  );
}

export default App;
