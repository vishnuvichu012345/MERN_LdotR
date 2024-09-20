import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, Paper, Grid, Card, CardContent, CardActions, IconButton, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AddBlog = () => {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);  // State for all blogs
  const [editingBlogId, setEditingBlogId] = useState(null);  // State for editing blog

  // Fetch blogs when the component mounts or after submission/deletion
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    axios.get('/blogs')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('author', blog.author);
    if (image) {
      formData.append('image', image);
    }

    // Check if we're editing or adding a new blog
    if (editingBlogId) {
      // Update existing blog
      axios.put(`/blogs/${editingBlogId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(() => {
          alert('Blog updated successfully!');
          fetchBlogs();
          resetForm();
        })
        .catch(error => {
          console.error('Error updating blog:', error);
        });
    } else {
      // Add new blog
      axios.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(() => {
          alert('Blog added successfully!');
          fetchBlogs();
          resetForm();
        })
        .catch(error => {
          console.error('Error adding blog:', error);
        });
    }
  };

  const resetForm = () => {
    setBlog({ title: '', content: '', author: '' });
    setImage(null);
    setEditingBlogId(null);  // Reset editing mode
  };

  const handleEdit = (blog) => {
    setBlog({ title: blog.title, content: blog.content, author: blog.author });
    setEditingBlogId(blog._id);  // Set the blog ID for editing
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      axios.delete(`/blogs/${id}`)
        .then(() => {
          alert('Blog deleted successfully!');
          fetchBlogs();
        })
        .catch(error => {
          console.error('Error deleting blog:', error);
        });
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          {editingBlogId ? 'Edit Blog' : 'Add a New Blog'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={blog.content}
            onChange={handleChange}
            multiline
            rows={4}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={blog.author}
            onChange={handleChange}
            required
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Box sx={{ marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {editingBlogId ? 'Update Blog' : 'Submit Blog'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Blog Management
      </Typography>
      <Grid container spacing={3}>
        {blogs.map(blog => (
          <Grid item xs={12} md={4} key={blog.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={blog.image || '/placeholder-image.png'}  // Use a placeholder if no image
                alt={blog.title}
              />
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2">{blog.content.substring(0, 100)}...</Typography>
                <Typography variant="caption" color="textSecondary">By {blog.author}</Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEdit(blog)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(blog._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AddBlog;
