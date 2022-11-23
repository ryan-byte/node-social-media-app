import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/styles/index.css'; 
import './assets/styles/navbar.css'; 
import {BrowserRouter,Routes,Route} from "react-router-dom";

import Navbar from './components/navbar';
import NotFound from './pages/notFound';
import Home from './pages/home';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Profile from './pages/profile';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/signin" element={<Signin/>} />
        <Route exact path="/signup" element={<Signup/>} />
        <Route path="*" element={<MainLayoutRoutes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

function MainLayoutRoutes() {
  return (
      <React.Fragment >
          <Navbar />
          <main className="content">
            <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/profile/:id" element={<Profile/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </main>
      </ React.Fragment>
  )
}