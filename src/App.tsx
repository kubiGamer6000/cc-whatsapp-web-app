import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import MessagesPage from './pages/MessagesPage';
import TasksPage from './pages/TasksPage';
import ContactsPage from './pages/ContactsPage';
import SummariesPage from './pages/SummariesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with layout */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/summaries" element={<SummariesPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            
            {/* Redirect root to tasks */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            
            {/* Catch all - redirect to tasks */}
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;