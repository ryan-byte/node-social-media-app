import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css'; 
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import {BrowserRouter,Routes,Route} from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './pages/home';
import NotFound from './pages/notFound';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <main className="content">
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
    
    </BrowserRouter>
  </React.StrictMode>
);