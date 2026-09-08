import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './Booking.css';

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({
        appointmentDate: '',
        startTime: '',
        serviceAddress: '',
        customerInstructions: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/services/${id}`);
                setService(response.data);
            } catch (err) {
                setError('Unable to load service details.');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const customerId = localStorage.getItem('userId');

        if (!customerId) {
            setError('Customer information not found. Please login again.');
            return;
        }

        try {
            setSubmitting(true);

            const appointmentData = {
                customerId: Number(customerId),
                serviceId: Number(id),
                appointmentDate: formData.appointmentDate,
                startTime: formData.startTime,
                serviceAddress: formData.serviceAddress,
                customerInstructions: formData.customerInstructions
            };

            await api.post('/appointments', appointmentData);

            setSuccess('Appointment booked successfully!');

            setTimeout(() => {
                navigate('/customer');
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to book the appointment. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="booking-loading">
                Loading service details...
            </div>
        );
    }

    if (!service) {
        return (
            <div className="booking-error">
                {error || 'Service not found.'}
            </div>
        );
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="booking-page">

            <nav className="booking-navbar">
                <div
                    className="booking-brand"
                    onClick={() => navigate('/customer')}
                >
                    <span className="brand-mark">SP</span>
                    <span>ServicePro</span>
                </div>

                <div className="booking-nav-links">
                    <button onClick={() => navigate('/customer')}>
                        Home
                    </button>

                    <button onClick={() => navigate('/services')}>
                        Services
                    </button>

                    <button onClick={() => navigate('/customer')}>
                        My Appointments
                    </button>
                </div>
            </nav>

            <main className="booking-container">

                <button
                    className="back-button"
                    onClick={() => navigate(`/services/${id}`)}
                >
                    ← Back to Service
                </button>

                <div className="booking-layout">

                    <div className="booking-service-card">

                        <div className="service-category">
                            {service.category}
                        </div>

                        <h1>{service.serviceName}</h1>

                        <p className="service-description">
                            {service.description}
                        </p>

                        <div className="service-info-row">
                            <div>
                                <span>Starting Price</span>
                                <strong>₹{service.price}</strong>
                            </div>

                            <div>
                                <span>Duration</span>
                                <strong>{service.estimatedDuration} mins</strong>
                            </div>
                        </div>

                    </div>

                    <div className="booking-form-card">

                        <div className="form-header">
                            <span>BOOK SERVICE</span>
                            <h2>Schedule Your Appointment</h2>
                            <p>
                                Choose your preferred date and time.
                            </p>
                        </div>

                        {error && (
                            <div className="booking-alert error-alert">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="booking-alert success-alert">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Appointment Date</label>

                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Preferred Start Time</label>

                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Service Address</label>

                                <textarea
                                    name="serviceAddress"
                                    value={formData.serviceAddress}
                                    onChange={handleChange}
                                    placeholder="Enter the address where the service is required"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Special Instructions
                                    <span className="optional">
                                        Optional
                                    </span>
                                </label>

                                <textarea
                                    name="customerInstructions"
                                    value={formData.customerInstructions}
                                    onChange={handleChange}
                                    placeholder="Add any additional information for the service staff"
                                    rows="3"
                                />
                            </div>

                            <button
                                type="submit"
                                className="confirm-booking-button"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Booking...'
                                    : 'Confirm Booking'}
                            </button>

                        </form>
                    </div>

                </div>
            </main>

            <footer className="booking-footer">
                <div className="footer-brand">
                    <span className="brand-mark">SP</span>
                    <span>ServicePro</span>
                </div>

                <p>
                    Reliable services. Professional care.
                </p>
            </footer>

        </div>
    );
}

export default Booking;