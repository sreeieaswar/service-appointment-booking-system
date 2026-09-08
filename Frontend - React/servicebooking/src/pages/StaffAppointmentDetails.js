import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './StaffAppointmentDetails.css';

function StaffAppointmentDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [status, setStatus] = useState('');
    const [staffNotes, setStaffNotes] = useState('');
    const [finalServiceCharge, setFinalServiceCharge] = useState('');

    const [updating, setUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateError, setUpdateError] = useState('');

    const [staffId, setStaffId] = useState(null);

    useEffect(() => {
        loadAppointment();
    }, [id]);

    const loadAppointment = async () => {
        try {
            setLoading(true);
            setError('');

            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError('Unable to identify logged-in staff');
                return;
            }

            const staffResponse = await api.get('/staff');

            const loggedInStaff = staffResponse.data.find(
                (staff) => String(staff.userId) === String(userId)
            );

            if (!loggedInStaff) {
                setError('Staff profile not found');
                return;
            }

            setStaffId(loggedInStaff.id);

            const response = await api.get(`/appointments/${id}`);

            setAppointment(response.data);
            setStatus(response.data.status);
            setStaffNotes(response.data.staffNotes || '');

            setFinalServiceCharge(
                response.data.finalServiceCharge !== null &&
                response.data.finalServiceCharge !== undefined
                    ? response.data.finalServiceCharge
                    : ''
            );

        } catch (err) {
            if (err.response && err.response.data) {
                setError(
                    err.response.data.message ||
                    'Unable to load appointment details'
                );
            } else {
                setError('Unable to connect to the server');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (currentStatus) => {
        if (currentStatus === 'COMPLETED') {
            return 'staff-detail-status completed';
        }

        if (currentStatus === 'IN_PROGRESS') {
            return 'staff-detail-status progress';
        }

        if (currentStatus === 'CANCELLED') {
            return 'staff-detail-status cancelled';
        }

        if (currentStatus === 'ASSIGNED') {
            return 'staff-detail-status assigned';
        }

        if (currentStatus === 'CONFIRMED') {
            return 'staff-detail-status confirmed';
        }

        return 'staff-detail-status default';
    };

    const getNextStatuses = () => {
        if (!appointment) {
            return [];
        }

        if (appointment.status === 'CONFIRMED') {
            return ['IN_PROGRESS'];
        }

        if (appointment.status === 'IN_PROGRESS') {
            return ['COMPLETED'];
        }

        return [];
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!staffId) {
            setUpdateError('Unable to identify logged-in staff');
            return;
        }

        try {
            setUpdating(true);
            setUpdateMessage('');
            setUpdateError('');

            const requestData = {
                status: status,
                staffNotes: staffNotes,
                finalServiceCharge:
                    finalServiceCharge === ''
                        ? null
                        : Number(finalServiceCharge)
            };

            const response = await api.put(
                `/appointments/${id}/staff-update/${staffId}`,
                requestData
            );

            setAppointment(response.data);
            setStatus(response.data.status);
            setStaffNotes(response.data.staffNotes || '');

            setFinalServiceCharge(
                response.data.finalServiceCharge !== null &&
                response.data.finalServiceCharge !== undefined
                    ? response.data.finalServiceCharge
                    : ''
            );

            setUpdateMessage('Appointment updated successfully.');

        } catch (err) {
            if (err.response && err.response.data) {
                setUpdateError(
                    err.response.data.message ||
                    'Unable to update appointment'
                );
            } else {
                setUpdateError('Unable to connect to the server');
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="staff-detail-page">
                <div className="staff-detail-loading">
                    Loading appointment details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="staff-detail-page">
                <div className="staff-detail-error">
                    <h3>Unable to load appointment</h3>
                    <p>{error}</p>

                    <button
                        className="staff-detail-retry-button"
                        onClick={loadAppointment}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const nextStatuses = getNextStatuses();

    return (
        <div className="staff-detail-page">
            <header className="staff-detail-header">
                <div className="staff-detail-brand">
                    <div className="staff-detail-brand-icon">SP</div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Staff Portal</span>
                    </div>
                </div>

                <button
                    className="staff-detail-back-button"
                    onClick={() => navigate('/staff/appointments')}
                >
                    ← Appointments
                </button>
            </header>

            <main className="staff-detail-main">
                <div className="staff-detail-title-section">
                    <div>
                        <p className="staff-detail-label">STAFF PORTAL</p>

                        <h1>Appointment Details</h1>

                        <p>
                            View and update the progress of your assigned
                            appointment.
                        </p>
                    </div>

                    <span className={getStatusClass(appointment.status)}>
                        {appointment.status.replace('_', ' ')}
                    </span>
                </div>

                <section className="staff-detail-card">
                    <div className="staff-detail-card-header">
                        <div>
                            <p>Appointment</p>
                            <h2>#{appointment.id}</h2>
                        </div>
                    </div>

                    <div className="staff-detail-section">
                        <h3>Customer Information</h3>

                        <div className="staff-detail-grid">
                            <div className="staff-detail-item">
                                <span>Customer Name</span>
                                <strong>{appointment.customerName}</strong>
                            </div>

                            <div className="staff-detail-item">
                                <span>Customer ID</span>
                                <strong>{appointment.customerId}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="staff-detail-section">
                        <h3>Service Information</h3>

                        <div className="staff-detail-grid">
                            <div className="staff-detail-item">
                                <span>Service</span>
                                <strong>{appointment.serviceName}</strong>
                            </div>

                            <div className="staff-detail-item">
                                <span>Service ID</span>
                                <strong>{appointment.serviceId}</strong>
                            </div>

                            <div className="staff-detail-item">
                                <span>Assigned Staff</span>
                                <strong>{appointment.staffName}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="staff-detail-section">
                        <h3>Appointment Schedule</h3>

                        <div className="staff-detail-grid">
                            <div className="staff-detail-item">
                                <span>Date</span>
                                <strong>{appointment.appointmentDate}</strong>
                            </div>

                            <div className="staff-detail-item">
                                <span>Start Time</span>
                                <strong>{appointment.startTime}</strong>
                            </div>

                            <div className="staff-detail-item">
                                <span>End Time</span>
                                <strong>{appointment.endTime}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="staff-detail-section">
                        <h3>Service Location</h3>

                        <div className="staff-detail-wide-item">
                            <span>Address</span>
                            <strong>{appointment.serviceAddress}</strong>
                        </div>

                        <div className="staff-detail-wide-item">
                            <span>Customer Instructions</span>
                            <strong>
                                {appointment.customerInstructions ||
                                    'No instructions provided'}
                            </strong>
                        </div>
                    </div>

                    <div className="staff-detail-section">
                        <h3>Payment Information</h3>

                        <div className="staff-detail-grid">
                            <div className="staff-detail-item">
                                <span>Estimated Price</span>
                                <strong>
                                    ₹{appointment.estimatedPrice}
                                </strong>
                            </div>

                            <div className="staff-detail-item">
                                <span>Final Service Charge</span>
                                <strong>
                                    {appointment.finalServiceCharge !== null &&
                                    appointment.finalServiceCharge !== undefined
                                        ? `₹${appointment.finalServiceCharge}`
                                        : 'Not updated'}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="staff-detail-section">
                        <h3>Service Notes</h3>

                        <div className="staff-detail-wide-item">
                            <span>Staff Notes</span>
                            <strong>
                                {appointment.staffNotes ||
                                    'No staff notes added yet'}
                            </strong>
                        </div>
                    </div>
                </section>

                {nextStatuses.length > 0 && (
                    <section className="staff-update-card">
                        <div className="staff-update-header">
                            <div>
                                <p className="staff-update-label">
                                    SERVICE PROGRESS
                                </p>

                                <h2>Update Appointment</h2>

                                <p>
                                    Update the progress after completing the
                                    service work.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div className="staff-update-field">
                                <label>Status</label>

                                <select
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.target.value)
                                    }
                                >
                                    <option value={appointment.status}>
                                        {appointment.status.replace('_', ' ')}
                                    </option>

                                    {nextStatuses.map((nextStatus) => (
                                        <option
                                            key={nextStatus}
                                            value={nextStatus}
                                        >
                                            {nextStatus.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="staff-update-field">
                                <label>Staff Notes</label>

                                <textarea
                                    value={staffNotes}
                                    onChange={(event) =>
                                        setStaffNotes(event.target.value)
                                    }
                                    placeholder="Add notes about the service..."
                                    rows="4"
                                />
                            </div>

                            <div className="staff-update-field">
                                <label>Final Service Charge</label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={finalServiceCharge}
                                    onChange={(event) =>
                                        setFinalServiceCharge(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter final service charge"
                                />
                            </div>

                            {updateMessage && (
                                <div className="staff-update-success">
                                    {updateMessage}
                                </div>
                            )}

                            {updateError && (
                                <div className="staff-update-error">
                                    {updateError}
                                </div>
                            )}

                            <div className="staff-update-actions">
                                <button
                                    type="submit"
                                    className="staff-update-button"
                                    disabled={updating}
                                >
                                    {updating
                                        ? 'Updating...'
                                        : 'Update Appointment'}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {appointment.status === 'COMPLETED' && (
                    <div className="staff-completed-message">
                        <h3>Appointment Completed</h3>
                        <p>
                            This appointment has been completed successfully.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default StaffAppointmentDetails;