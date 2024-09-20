const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
