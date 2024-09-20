const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


mongoose.connect('mongodb+srv://vuvishnu23:vuvishnu23@cluster0.rhz5j.mongodb.net/',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
