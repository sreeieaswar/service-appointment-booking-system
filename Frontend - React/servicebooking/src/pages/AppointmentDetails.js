import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './AppointmentDetails.css';

function AppointmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [rescheduling, setRescheduling] = useState(false);
    const [showReschedule, setShowReschedule] = useState(false);

    const [reviewData, setReviewData] = useState({
        rating: 0,
        comment: ''
    });

    const [showReview, setShowReview] = useState(false);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    const [rescheduleData, setRescheduleData] = useState({
        appointmentDate: '',
        startTime: ''
    });

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
        if (!date) return '-';

        return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (time) => {
        if (!time) return '-';

        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0, 0);

        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '-';

        return new Date(dateTime).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        return `status-${status?.toLowerCase()}`;
    };

    const handleCancel = async () => {
        const customerId = localStorage.getItem('userId');

        if (!customerId) {
            setActionError('Customer information not found. Please login again.');
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to cancel this appointment?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancelling(true);
            setActionError('');
            setActionSuccess('');

            const response = await api.put(
                `/appointments/${id}/cancel/${customerId}`
            );

            setAppointment(response.data);
            setActionSuccess('Appointment cancelled successfully.');
        } catch (err) {
            setActionError(
                err.response?.data?.message ||
                'Unable to cancel the appointment.'
            );
        } finally {
            setCancelling(false);
        }
    };

    const handleRescheduleChange = (e) => {
        setRescheduleData({
            ...rescheduleData,
            [e.target.name]: e.target.value
        });
    };

    const handleReschedule = async (e) => {
        e.preventDefault();

        const customerId = localStorage.getItem('userId');

        if (!customerId) {
            setActionError('Customer information not found. Please login again.');
            return;
        }

        if (!rescheduleData.appointmentDate || !rescheduleData.startTime) {
            setActionError('Please select a date and start time.');
            return;
        }

        try {
            setRescheduling(true);
            setActionError('');
            setActionSuccess('');

            const response = await api.put(
                `/appointments/${id}/reschedule/${customerId}`,
                {
                    appointmentDate: rescheduleData.appointmentDate,
                    startTime: rescheduleData.startTime
                }
            );

            setAppointment(response.data);
            setShowReschedule(false);
            setRescheduleData({
                appointmentDate: '',
                startTime: ''
            });
            setActionSuccess('Appointment rescheduled successfully.');
        } catch (err) {
            setActionError(
                err.response?.data?.message ||
                'Unable to reschedule the appointment.'
            );
        } finally {
            setRescheduling(false);
        }
    };

    const handleReviewChange = (e) => {
        setReviewData({
            ...reviewData,
            comment: e.target.value
        });
    };

    const handleRatingSelect = (rating) => {
        setReviewData({
            ...reviewData,
            rating
        });
        setReviewError('');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            setReviewError('Please select a rating from 1 to 5.');
            return;
        }

        if (!localStorage.getItem('token')) {
            setReviewError('Your session has expired. Please login again.');
            return;
        }

        try {
            setReviewSubmitting(true);
            setReviewError('');
            setReviewSuccess('');

            await api.post('/reviews', {
                appointmentId: Number(id),
                rating: Number(reviewData.rating),
                comment: reviewData.comment
            });

            setReviewSuccess('Review submitted successfully.');
            setShowReview(false);
            setReviewData({
                rating: 0,
                comment: ''
            });
        } catch (err) {
            setReviewError(
                err.response?.data?.message ||
                'Unable to submit the review.'
            );
        } finally {
            setReviewSubmitting(false);
        }
    };

    const canManageAppointment = () => {
        if (!appointment?.appointmentDate) {
            return false;
        }

        const appointmentDateTime = new Date(
            `${appointment.appointmentDate}T${appointment.startTime || '00:00:00'}`
        );

        return (
            appointmentDateTime > new Date() &&
            !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(appointment.status)
        );
    };

    const today = new Date().toISOString().split('T')[0];

    if (loading) {
        return (
            <div className="appointment-details-loading">
                Loading appointment details...
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="appointment-details-error">
                <h2>Unable to Load Appointment</h2>
                <p>{error || 'Appointment not found.'}</p>
                <button onClick={() => navigate('/appointments')}>
                    Back to My Appointments
                </button>
            </div>
        );
    }

    return (
        <div className="appointment-details-page">
            <nav className="appointment-details-navbar">
                <div
                    className="appointment-details-brand"
                    onClick={() => navigate('/customer')}
                >
                    <span className="brand-mark">SP</span>
                    <span>ServicePro</span>
                </div>

                <div className="appointment-details-nav-links">
                    <button onClick={() => navigate('/customer')}>
                        Home
                    </button>

                    <button onClick={() => navigate('/services')}>
                        Services
                    </button>

                    <button onClick={() => navigate('/appointments')}>
                        My Appointments
                    </button>
                </div>
            </nav>

            <main className="appointment-details-container">
                <button
                    className="appointment-back-button"
                    onClick={() => navigate('/appointments')}
                >
                    ← Back to My Appointments
                </button>

                <div className="appointment-details-header">
                    <div>
                        <span>APPOINTMENT DETAILS</span>
                        <h1>{appointment.serviceName}</h1>
                        <p>Appointment #{appointment.id}</p>
                    </div>

                    <div className={`appointment-status ${getStatusClass(appointment.status)}`}>
                        {appointment.status}
                    </div>
                </div>

                {actionError && (
                    <div className="appointment-action-alert error-alert">
                        {actionError}
                    </div>
                )}

                {actionSuccess && (
                    <div className="appointment-action-alert success-alert">
                        {actionSuccess}
                    </div>
                )}

                {reviewSuccess && (
                    <div className="appointment-action-alert success-alert">
                        {reviewSuccess}
                    </div>
                )}

                {showReschedule && (
                    <div className="reschedule-card">
                        <div className="reschedule-header">
                            <span>RESCHEDULE APPOINTMENT</span>
                            <h2>Choose a New Date & Time</h2>
                        </div>

                        <form onSubmit={handleReschedule}>
                            <div className="reschedule-form-grid">
                                <div className="reschedule-form-group">
                                    <label>New Appointment Date</label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={rescheduleData.appointmentDate}
                                        onChange={handleRescheduleChange}
                                        min={today}
                                        required
                                    />
                                </div>

                                <div className="reschedule-form-group">
                                    <label>New Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={rescheduleData.startTime}
                                        onChange={handleRescheduleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="reschedule-actions">
                                <button
                                    type="button"
                                    className="reschedule-cancel-button"
                                    onClick={() => {
                                        setShowReschedule(false);
                                        setActionError('');
                                    }}
                                >
                                    Close
                                </button>

                                <button
                                    type="submit"
                                    className="reschedule-confirm-button"
                                    disabled={rescheduling}
                                >
                                    {rescheduling
                                        ? 'Rescheduling...'
                                        : 'Confirm Reschedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showReview && appointment.status === 'COMPLETED' && (
                    <div className="review-card">
                        <div className="review-header">
                            <span>SHARE YOUR EXPERIENCE</span>
                            <h2>Rate This Service</h2>
                            <p>Tell us about your experience with this appointment.</p>
                        </div>

                        {reviewError && (
                            <div className="appointment-action-alert error-alert">
                                {reviewError}
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit}>
                            <div className="rating-section">
                                <label>Your Rating</label>

                                <div className="rating-buttons">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            className={`rating-option ${
                                                reviewData.rating === rating ? 'active' : ''
                                            }`}
                                            onClick={() => handleRatingSelect(rating)}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>

                                {reviewData.rating > 0 && (
                                    <span className="rating-text">
                                        {reviewData.rating} out of 5
                                    </span>
                                )}
                            </div>

                            <div className="review-form-group">
                                <label>Review</label>

                                <textarea
                                    value={reviewData.comment}
                                    onChange={handleReviewChange}
                                    placeholder="Share your experience with this service..."
                                    rows="5"
                                    maxLength="2000"
                                />

                                <span className="character-count">
                                    {reviewData.comment.length}/2000
                                </span>
                            </div>

                            <div className="review-actions">
                                <button
                                    type="button"
                                    className="review-close-button"
                                    onClick={() => {
                                        setShowReview(false);
                                        setReviewError('');
                                    }}
                                >
                                    Close
                                </button>

                                <button
                                    type="submit"
                                    className="review-submit-button"
                                    disabled={reviewSubmitting}
                                >
                                    {reviewSubmitting
                                        ? 'Submitting...'
                                        : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="appointment-details-grid">
                    <div className="appointment-info-card">
                        <h2>Appointment Information</h2>

                        <div className="details-row">
                            <span>Date</span>
                            <strong>{formatDate(appointment.appointmentDate)}</strong>
                        </div>

                        <div className="details-row">
                            <span>Time</span>
                            <strong>
                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </strong>
                        </div>

                        <div className="details-row">
                            <span>Service</span>
                            <strong>{appointment.serviceName}</strong>
                        </div>

                        <div className="details-row">
                            <span>Service Address</span>
                            <strong>{appointment.serviceAddress || '-'}</strong>
                        </div>

                        <div className="details-row">
                            <span>Booking Date</span>
                            <strong>{formatDateTime(appointment.bookingDate)}</strong>
                        </div>
                    </div>

                    <div className="appointment-info-card">
                        <h2>Service & Pricing</h2>

                        <div className="details-row">
                            <span>Estimated Price</span>
                            <strong>₹{appointment.estimatedPrice ?? '0'}</strong>
                        </div>

                        <div className="details-row">
                            <span>Final Service Charge</span>
                            <strong>
                                {appointment.finalServiceCharge != null
                                    ? `₹${appointment.finalServiceCharge}`
                                    : 'Not available yet'}
                            </strong>
                        </div>

                        <div className="details-row">
                            <span>Service Staff</span>
                            <strong>{appointment.staffName || 'Not assigned yet'}</strong>
                        </div>
                    </div>

                    <div className="appointment-info-card full-width">
                        <h2>Additional Information</h2>

                        <div className="details-section">
                            <span>Special Instructions</span>
                            <p>
                                {appointment.customerInstructions ||
                                    'No special instructions provided.'}
                            </p>
                        </div>

                        <div className="details-section">
                            <span>Staff Notes</span>
                            <p>
                                {appointment.staffNotes ||
                                    'No staff notes available yet.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="appointment-details-actions">
                    <button
                        className="secondary-action-button"
                        onClick={() => navigate('/appointments')}
                    >
                        Back to Appointments
                    </button>

                    {appointment.status === 'COMPLETED' && !showReview && (
                        <button
                            className="review-submit-button"
                            onClick={() => {
                                setShowReview(true);
                                setReviewError('');
                                setReviewSuccess('');
                            }}
                        >
                            Write a Review
                        </button>
                    )}

                    {canManageAppointment() && (
                        <>
                            <button
                                className="reschedule-appointment-button"
                                onClick={() => {
                                    setShowReschedule(!showReschedule);
                                    setActionError('');
                                    setActionSuccess('');
                                }}
                            >
                                {showReschedule ? 'Close Reschedule' : 'Reschedule Appointment'}
                            </button>

                            <button
                                className="cancel-appointment-button"
                                onClick={handleCancel}
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                            </button>
                        </>
                    )}
                </div>
            </main>

            <footer className="appointment-details-footer">
                <div className="footer-brand">
                    <span className="brand-mark">SP</span>
                    <span>ServicePro</span>
                </div>

                <p>Reliable services. Professional care.</p>
            </footer>
        </div>
    );
}

export default AppointmentDetails;