import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MyAppointments.css';

function MyAppointments() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            const customerId = localStorage.getItem('userId');

            if (!customerId) {
                setError('Customer information not found. Please login again.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `/appointments/customer/${customerId}`
                );

                setAppointments(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your appointments.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const formatDate = (date) => {
        if (!date) return '-';

        return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (time) => {
        if (!time) return '-';

        const [hours, minutes] = time.split(':');

        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING':
                return 'status-pending';
            case 'CONFIRMED':
                return 'status-confirmed';
            case 'ASSIGNED':
                return 'status-assigned';
            case 'IN_PROGRESS':
                return 'status-progress';
            case 'COMPLETED':
                return 'status-completed';
            case 'CANCELLED':
                return 'status-cancelled';
            case 'REJECTED':
                return 'status-rejected';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="appointments-loading">
                <div className="loading-spinner"></div>
                <p>Loading your appointments...</p>
            </div>
        );
    }

    return (
        <div className="appointments-page">
            <nav className="appointments-navbar">
                <div
                    className="appointments-brand"
                    onClick={() => navigate('/customer')}
                >
                    <span className="brand-mark">SP</span>
                    <span>ServicePro</span>
                </div>

                <div className="appointments-nav-links">
                    <button onClick={() => navigate('/customer')}>
                        Home
                    </button>

                    <button onClick={() => navigate('/services')}>
                        Services
                    </button>

                    <button className="active">
                        My Appointments
                    </button>
                </div>
            </nav>

            <main className="appointments-container">
                <div className="appointments-header">
                    <div>
                        <span className="section-label">MY BOOKINGS</span>
                        <h1>My Appointments</h1>
                        <p>
                            View and manage all your service appointments.
                        </p>
                    </div>

                    <button
                        className="book-service-button"
                        onClick={() => navigate('/services')}
                    >
                        Book a Service
                    </button>
                </div>

                {error && (
                    <div className="appointments-alert">
                        {error}
                    </div>
                )}

                {!error && appointments.length === 0 && (
                    <div className="empty-appointments">
                        <div className="empty-icon">📅</div>
                        <h2>No Appointments Yet</h2>
                        <p>
                            You haven't booked any services yet.
                            Start by choosing a service that suits you.
                        </p>

                        <button
                            onClick={() => navigate('/services')}
                        >
                            Explore Services
                        </button>
                    </div>
                )}

                {!error && appointments.length > 0 && (
                    <div className="appointments-list">
                        {appointments.map((appointment) => (
                            <div
                                className="appointment-card"
                                key={appointment.id}
                            >
                                <div className="appointment-main">
                                    <div className="appointment-title">
                                        <span className="service-category">
                                            SERVICE
                                        </span>

                                        <h2>
                                            {appointment.serviceName}
                                        </h2>

                                        <span
                                            className={`appointment-status ${getStatusClass(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status?.replace(
                                                '_',
                                                ' '
                                            )}
                                        </span>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="detail-item">
                                            <span>Date</span>
                                            <strong>
                                                {formatDate(
                                                    appointment.appointmentDate
                                                )}
                                            </strong>
                                        </div>

                                        <div className="detail-item">
                                            <span>Time</span>
                                            <strong>
                                                {formatTime(
                                                    appointment.startTime
                                                )}
                                            </strong>
                                        </div>

                                        <div className="detail-item">
                                            <span>Staff</span>
                                            <strong>
                                                {appointment.staffName ||
                                                    'Not assigned'}
                                            </strong>
                                        </div>

                                        <div className="detail-item">
                                            <span>Price</span>
                                            <strong>
                                                ₹
                                                {appointment.finalServiceCharge ||
                                                    appointment.estimatedPrice ||
                                                    '0'}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="view-appointment-button"
                                    onClick={() =>
                                        navigate(
                                            `/appointments/${appointment.id}`
                                        )
                                    }
                                >
                                    View Details
                                    <span>→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="appointments-footer">
                <div className="footer-brand">
                    <span className="brand-mark">SP</span>
                    <span>ServicePro</span>
                </div>

                <p>Reliable services. Professional care.</p>
            </footer>
        </div>
    );
}

export default MyAppointments;