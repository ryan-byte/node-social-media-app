import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import './assets/styles/index.css'; 
import {BrowserRouter,Routes,Route} from "react-router-dom";

import Navbar from './components/navbar';
import NotFound from './pages/notFound';
import Home from './pages/home';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Profile from './pages/profile';
import Search from './pages/search';
import Settings from './pages/settings';
import Invitations from './pages/invitations';
import Friends from './pages/friends';
import Chat from './pages/chat';


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
              <Route exact path="/search" element={<Search/>} />
              <Route exact path="/settings" element={<Settings/>} />
              <Route exact path="/invitations" element={<Invitations/>} />
              <Route exact path="/friends" element={<Friends/>} />
              <Route exact path="/chat" element={<Chat/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </main>
      </ React.Fragment>
  )
}