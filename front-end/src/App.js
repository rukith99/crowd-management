import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';
import OtherOption from './components/OtherOption';
import OutputPage from './components/OutputPage';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import SignUp from './components/Signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div style={{ width: '100vw', height: '100vh' }}>
        {!isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        ) : (
          <>
            <Sidebar />
            <div className="content" style={{ backgroundColor: '#efefef' }}>
              <Routes>
                <Route path="/event-list" element={<EventList />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/other-option" element={<OtherOption />} />
                <Route path="/output" element={<OutputPage />} />
                <Route path="/event-details/:id" element={<EventDetails />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
