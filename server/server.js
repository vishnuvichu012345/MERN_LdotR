const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');




mongoose.connect('mongodb+srv://vuvishnu23:vuvishnu23@cluster0.rhz5j.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// const user = new User({ name: 'Alice', email: 'alice@example.com', age: 28 });
// user.save().then(() => console.log('User added'));
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });



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

app.get('/users/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user);
  console.log(json(user))
});




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
