import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import CustomerHome from './pages/CustomerHome';
import Services from './pages/Services';
import ProtectedRoute from './components/ProtectedRoute';
import ServiceDetails from './pages/ServiceDetails';
import Booking from './pages/Booking';
import MyAppointments from './pages/MyAppointments';
import AppointmentDetails from './pages/AppointmentDetails';
import StaffDashboard from './pages/StaffDashboard';
import AssignedAppointments from './pages/AssignedAppointments';
import StaffAppointmentDetails from './pages/StaffAppointmentDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminServices from './pages/AdminServices';
import AdminStaff from './pages/AdminStaff';
import AdminAppointments from './pages/AdminAppointments';
import AdminAppointmentDetails from './pages/AdminAppointmentDetails';
import AdminReviews from './pages/AdminReviews';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <CustomerHome />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/services"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <Services />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/services/:id"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <ServiceDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/services/:id/book"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <Booking />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <MyAppointments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/appointments/:id"
                    element={
                        <ProtectedRoute allowedRoles={['CUSTOMER']}>
                            <AppointmentDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute allowedRoles={['STAFF']}>
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['STAFF']}>
                            <AssignedAppointments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff/appointments/:id"
                    element={
                        <ProtectedRoute allowedRoles={['STAFF']}>
                            <StaffAppointmentDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminCategories />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/services"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                           <AdminServices />
                                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/staff"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminStaff />
                        </ProtectedRoute>
                    }
                />

                <Route
            path="/admin/appointments"
            element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminAppointments />
                </ProtectedRoute>
            }
          />

                 <Route
                path="/admin/appointments/:id"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminAppointmentDetails />
                    </ProtectedRoute>
                }
            />
                <Route
                path="/admin/reviews"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminReviews />
                    </ProtectedRoute>
                }
            />

            </Routes>
        </BrowserRouter>
    );
}

export default App;