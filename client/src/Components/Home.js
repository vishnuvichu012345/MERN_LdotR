// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress, CardMedia } from '@mui/material';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/blogs')
      .then(response => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Blogs
      </Typography>
      <Grid container spacing={4}>
        {blogs.map(blog => (
          <Grid item xs={12} md={6} lg={4} key={blog._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:3000${blog.image}` || '/placeholder-image.png'}  // Use a placeholder if no image
                alt={blog.title}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {blog.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(blog.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" component="p">
                  {blog.content.substring(0, 100)}...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Author: {blog.author}
                </Typography>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => alert('View Blog Details')}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
