import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import LazyRouter from './LazyRouter';

const RouterSelector = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* All other routes handled by LazyRouter */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <LazyRouter />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RouterSelector;
