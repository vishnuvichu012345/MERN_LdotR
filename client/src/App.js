// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import AddBlog from './Components/AddBlog';
import UsersTable from './Components/UsersTable';


const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-blog" element={<AddBlog />} />
        <Route path="/add-user" element={<UsersTable/>} />
      </Routes>
    </Router>
  );
};

export default App;
