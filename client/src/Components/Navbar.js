// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Blog App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/add-blog">
          Add Blog
        </Button>
        <Button color="inherit" component={Link} to="/add-user">
          Add User
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
