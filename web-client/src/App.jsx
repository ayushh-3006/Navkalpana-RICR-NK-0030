import React from 'react'
 import {BrowserRouter, Routes, Route} from 'react-router-dom';
 import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
    <>
     <BrowserRouter>
     <Toaster />
     <Header />
     <Routes>
      <Route path='/' element= {<Home/>} />
      <Route path='/Register' element={<Register/>}/>
      <Route path='/Login'  element={<Login/>}/>

       
     </Routes>
     </BrowserRouter>
    </>
  );
};

export default App;