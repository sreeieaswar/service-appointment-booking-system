import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AssignedAppointments.css';

function AssignedAppointments() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {

        try {
            setError('');

            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError('Unable to identify logged-in staff');
                setLoading(false);
                return;
            }

            const staffResponse = await api.get('/staff');

            const loggedInStaff = staffResponse.data.find(
                (staff) => String(staff.userId) === String(userId)
            );

            if (!loggedInStaff) {
                setError('Staff profile not found');
                setLoading(false);
                return;
            }

            const staffId = loggedInStaff.id;

            const appointmentResponse = await api.get(
                `/appointments/staff/${staffId}`
            );

            setAppointments(appointmentResponse.data);

        } catch (err) {

            if (err.response && err.response.data) {
                setError(
                    err.response.data.message ||
                    'Unable to load appointments'
                );
            } else {
                setError('Unable to connect to the server');
            }

        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {

        if (status === 'COMPLETED') {
            return 'appointment-status completed';
        }

        if (status === 'IN_PROGRESS') {
            return 'appointment-status progress';
        }

        if (status === 'CANCELLED') {
            return 'appointment-status cancelled';
        }

        if (status === 'ASSIGNED') {
            return 'appointment-status assigned';
        }

        return 'appointment-status default';
    };

    if (loading) {
        return (
            <div className="assigned-page">
                <div className="assigned-loading">
                    Loading appointments...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assigned-page">
                <div className="assigned-error">
                    <h3>Unable to load appointments</h3>
                    <p>{error}</p>

                    <button
                        className="assigned-retry-button"
                        onClick={loadAppointments}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="assigned-page">

            <header className="assigned-header">

                <div className="assigned-brand">
                    <div className="assigned-brand-icon">
                        SP
                    </div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Staff Portal</span>
                    </div>
                </div>

                <button
                    className="assigned-back-button"
                    onClick={() => navigate('/staff')}
                >
                    ← Dashboard
                </button>

            </header>

            <main className="assigned-main">

                <div className="assigned-title-section">
                    <div>
                        <p className="assigned-label">
                            STAFF PORTAL
                        </p>

                        <h1>Assigned Appointments</h1>

                        <p>
                            View and manage appointments assigned to you.
                        </p>
                    </div>

                    <div className="appointment-count">
                        <span>{appointments.length}</span>
                        <small>Appointments</small>
                    </div>
                </div>

                {appointments.length === 0 ? (

                    <div className="empty-appointments">

                        <h3>No appointments assigned</h3>

                        <p>
                            You currently have no appointments assigned to you.
                        </p>

                    </div>

                ) : (

                    <div className="appointments-list">

                        {appointments.map((appointment) => (

                            <div
                                className="appointment-card"
                                key={appointment.id}
                            >

                                <div className="appointment-card-top">

                                    <div>
                                        <p className="appointment-number">
                                            Appointment #{appointment.id}
                                        </p>

                                        <h2>
                                            {appointment.serviceName}
                                        </h2>
                                    </div>

                                    <span
                                        className={getStatusClass(
                                            appointment.status
                                        )}
                                    >
                                        {appointment.status.replace(
                                            '_',
                                            ' '
                                        )}
                                    </span>

                                </div>

                                <div className="appointment-details">

                                    <div className="appointment-detail">
                                        <span className="detail-label">
                                            Customer
                                        </span>

                                        <strong>
                                            {appointment.customerName}
                                        </strong>
                                    </div>

                                    <div className="appointment-detail">
                                        <span className="detail-label">
                                            Date
                                        </span>

                                        <strong>
                                            {appointment.appointmentDate}
                                        </strong>
                                    </div>

                                    <div className="appointment-detail">
                                        <span className="detail-label">
                                            Time
                                        </span>

                                        <strong>
                                            {appointment.startTime} -{' '}
                                            {appointment.endTime}
                                        </strong>
                                    </div>

                                    <div className="appointment-detail address-detail">
                                        <span className="detail-label">
                                            Service Address
                                        </span>

                                        <strong>
                                            {appointment.serviceAddress}
                                        </strong>
                                    </div>

                                </div>

                                <div className="appointment-card-bottom">

                                    <button
                                        className="view-appointment-button"
                                        onClick={() =>
                                            navigate(
                                                `/staff/appointments/${appointment.id}`
                                            )
                                        }
                                    >
                                        View Details
                                        <span>→</span>
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default AssignedAppointments;