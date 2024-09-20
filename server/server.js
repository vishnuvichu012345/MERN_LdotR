const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


mongoose.connect('mongodb+srv://vuvishnu23:vuvishnu23@cluster0.rhz5j.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });


//MongoDB: Create a MongoDB schema for storing user data (name, email, age), and write a script to insert a new user into the collection.


// const user = new User({ name: 'Alice', email: 'alice@example.com', age: 28 });
// user.save().then(() => console.log('User added'));
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });


app.get('/users',(req,res)=>{
  const users=[
    {
      name:'vishnu',email:'vuvishnu23@gmail.com',age:30
    },
    {
      name:'jishnu',email:'vujishnu23@gmail.com',age:23
    },
   
  ]
  res.json(users)
})



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


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
