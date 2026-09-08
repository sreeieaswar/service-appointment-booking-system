import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        return <Navigate to="/login" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');

            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'CUSTOMER') {
            return <Navigate to="/customer" replace />;
        }

        if (role === 'STAFF') {
            return <Navigate to="/staff" replace />;
        }

        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;