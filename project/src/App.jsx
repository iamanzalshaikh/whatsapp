import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import UserProvider from './context/UserContext';
import SocketProvider from './context/SocketContext';
import MessageProvider from './context/MessageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <SocketProvider>
          <MessageProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </MessageProvider>
        </SocketProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
