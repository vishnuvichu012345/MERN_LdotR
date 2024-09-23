const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from your frontend
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://vuvishnu23:vuvishnu23@cluster0.rhz5j.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler for large payloads
app.use((err, req, res, next) => {
  if (err.status === 413) { // Payload too large
    return res.status(413).json({ error: 'Payload too large. Please reduce the size.' });
  }
  next(err);
});


const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Define storage for uploaded files using multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory for saving files
  },
  filename: (req, file, cb) => {
    cb(null, `blog_${Date.now()}_${file.originalname}`);  // Unique filename
  },
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });


//MongoDB: Create a MongoDB schema for storing user data (name, email, age), and write a script to insert a new user into the collection.


// const user = new User({ name: 'Alice', email: 'alice@example.com', age: 28 });
// user.save().then(() => console.log('User added'));
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });


// app.get('/users',(req,res)=>{
//   const users=[
//     {
//       name:'vishnu',email:'vuvishnu23@gmail.com',age:30
//     },
//     {
//       name:'jishnu',email:'vujishnu23@gmail.com',age:23
//     },
   
//   ]
//   res.json(users)
// })


app.get('/', (req, res) => {
  res.send('Hello, World!');
});




app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch users from MongoDB
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;  // Extract data from request body

  // Create a new user instance using the User model
  const newUser = new User({
    name,
    email,
    age,
  });

  try {
    await newUser.save();  // Save the new user to MongoDB
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



//Express.js + MongoDB: Create an Express.js route to fetch a user by their email from the MongoDB database.


app.get('/users/:email', (req, res) => {
  User.findOne({ email: req.params.email })
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Error fetching user', details: err });
    });
});


app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



//Blogs Routs ###################################################################################

// Get all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();  // Fetch all blogs from MongoDB
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific blog by ID
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);  // Fetch blog by ID
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/blogs', upload.single('image'), async (req, res) => {
  const { title, content, author } = req.body;
  let imageUrl = '';

  if (req.file) {
    // Save image URL
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const newBlog = new Blog({
    title,
    content,
    author,
    image: imageUrl,
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a blog by ID
app.put('/blogs/:id', upload.single('image'), async (req, res) => {
  try {
    const blogId = req.params.id;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image =`/uploads/${req.file.filename}`;  // Save image path or filename
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
    if (!updatedBlog) {
      return res.status(404).send('Blog not found');
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).send('Server error');
  }
});

// Delete a blog by ID
app.delete('/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
