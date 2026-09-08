import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './AdminAppointmentDetails.css';

function AdminAppointmentDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchAppointment = async () => {

            try {

                const response = await api.get(`/appointments/${id}`);

                setAppointment(response.data);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    'Unable to load appointment details.'
                );

            } finally {

                setLoading(false);

            }
        };

        fetchAppointment();

    }, [id]);

    const formatDate = (date) => {

        if (!date) {
            return '-';
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (time) => {

        if (!time) {
            return '-';
        }

        const [hours, minutes] = time.split(':');

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateTime = (dateTime) => {

        if (!dateTime) {
            return '-';
        }

        return new Date(dateTime).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatStatus = (status) => {

        if (!status) {
            return '-';
        }

        return status
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getStatusClass = (status) => {

        return `status-${status?.toLowerCase() || 'pending'}`;

    };

    if (loading) {

        return (
            <div className="admin-appointment-details-loading">
                Loading appointment details...
            </div>
        );

    }

    if (error || !appointment) {

        return (
            <div className="admin-appointment-details-error">

                <h2>Unable to Load Appointment</h2>

                <p>
                    {error || 'Appointment not found.'}
                </p>

                <button
                    onClick={() => navigate('/admin/appointments')}
                >
                    Back to Appointments
                </button>

            </div>
        );

    }

    return (
        <div className="admin-appointment-details-page">

            <header className="admin-appointment-details-header">

                <div className="admin-appointment-details-brand">

                    <div className="admin-appointment-details-brand-icon">
                        SP
                    </div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>

                </div>

                <button
                    className="admin-appointment-details-back-dashboard"
                    onClick={() => navigate('/admin')}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-appointment-details-container">

                <button
                    className="admin-appointment-details-back-button"
                    onClick={() => navigate('/admin/appointments')}
                >
                    ← Back to Appointments
                </button>

                <div className="admin-appointment-details-title">

                    <div>

                        <span>
                            ADMIN / APPOINTMENT DETAILS
                        </span>

                        <h1>
                            {appointment.serviceName}
                        </h1>

                        <p>
                            Appointment #{appointment.id}
                        </p>

                    </div>

                    <div
                        className={`admin-appointment-status ${getStatusClass(
                            appointment.status
                        )}`}
                    >
                        {formatStatus(appointment.status)}
                    </div>

                </div>

                <div className="admin-appointment-details-grid">

                    <div className="admin-appointment-info-card">

                        <h2>Appointment Information</h2>

                        <div className="admin-details-row">

                            <span>Appointment ID</span>

                            <strong>
                                #{appointment.id}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Appointment Date</span>

                            <strong>
                                {formatDate(
                                    appointment.appointmentDate
                                )}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Appointment Time</span>

                            <strong>
                                {formatTime(
                                    appointment.startTime
                                )}
                                {' - '}
                                {formatTime(
                                    appointment.endTime
                                )}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Booking Date</span>

                            <strong>
                                {formatDateTime(
                                    appointment.bookingDate
                                )}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Current Status</span>

                            <strong>
                                {formatStatus(
                                    appointment.status
                                )}
                            </strong>

                        </div>

                    </div>

                    <div className="admin-appointment-info-card">

                        <h2>Customer Information</h2>

                        <div className="admin-details-row">

                            <span>Customer ID</span>

                            <strong>
                                {appointment.customerId
                                    ? `#${appointment.customerId}`
                                    : '-'}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Customer Name</span>

                            <strong>
                                {appointment.customerName || '-'}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Service Address</span>

                            <strong>
                                {appointment.serviceAddress || '-'}
                            </strong>

                        </div>

                    </div>

                    <div className="admin-appointment-info-card">

                        <h2>Service Information</h2>

                        <div className="admin-details-row">

                            <span>Service ID</span>

                            <strong>
                                {appointment.serviceId
                                    ? `#${appointment.serviceId}`
                                    : '-'}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Service Name</span>

                            <strong>
                                {appointment.serviceName || '-'}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Estimated Price</span>

                            <strong>
                                {appointment.estimatedPrice != null
                                    ? `₹${appointment.estimatedPrice}`
                                    : '-'}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Final Service Charge</span>

                            <strong>
                                {appointment.finalServiceCharge != null
                                    ? `₹${appointment.finalServiceCharge}`
                                    : 'Not available yet'}
                            </strong>

                        </div>

                    </div>

                    <div className="admin-appointment-info-card">

                        <h2>Staff Information</h2>

                        <div className="admin-details-row">

                            <span>Staff ID</span>

                            <strong>
                                {appointment.staffId
                                    ? `#${appointment.staffId}`
                                    : 'Not assigned'}
                            </strong>

                        </div>

                        <div className="admin-details-row">

                            <span>Staff Name</span>

                            <strong>
                                {appointment.staffName || 'Not assigned yet'}
                            </strong>

                        </div>

                    </div>

                    <div className="admin-appointment-info-card admin-full-width">

                        <h2>Additional Information</h2>

                        <div className="admin-details-section">

                            <span>
                                Customer Instructions
                            </span>

                            <p>
                                {appointment.customerInstructions ||
                                    'No special instructions provided.'}
                            </p>

                        </div>

                        <div className="admin-details-section">

                            <span>
                                Staff Notes
                            </span>

                            <p>
                                {appointment.staffNotes ||
                                    'No staff notes available yet.'}
                            </p>

                        </div>

                    </div>

                </div>

                <div className="admin-appointment-details-actions">

                    <button
                        className="admin-back-appointments-button"
                        onClick={() => navigate('/admin/appointments')}
                    >
                        Back to Appointments
                    </button>

                </div>

            </main>

            <footer className="admin-appointment-details-footer">

                <div className="admin-footer-brand">

                    <div className="admin-footer-brand-icon">
                        SP
                    </div>

                    <span>ServicePro</span>

                </div>

                <p>
                    Reliable services. Professional care.
                </p>

            </footer>

        </div>
    );
}

export default AdminAppointmentDetails;