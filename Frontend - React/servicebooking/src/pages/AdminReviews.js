import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminReviews.css';

function AdminReviews() {

    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                const response = await api.get('/reviews');

                setReviews(response.data);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    'Unable to load reviews.'
                );

            } finally {

                setLoading(false);

            }
        };

        fetchReviews();

    }, []);

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

    const renderStars = (rating) => {

        return (
            <div className="admin-review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? 'filled' : ''}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="admin-reviews-page">

            <header className="admin-reviews-header">

                <div className="admin-reviews-brand">

                    <div className="admin-reviews-brand-icon">
                        SP
                    </div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>

                </div>

                <button
                    className="admin-reviews-dashboard-button"
                    onClick={() => navigate('/admin')}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-reviews-container">

                <button
                    className="admin-reviews-back-button"
                    onClick={() => navigate('/admin')}
                >
                    ← Back to Admin Panel
                </button>

                <div className="admin-reviews-title">

                    <p>ADMIN / REVIEWS</p>

                    <h1>Customer Reviews</h1>

                    <span>
                        View feedback and ratings submitted by customers.
                    </span>

                </div>

                {loading && (
                    <div className="admin-reviews-message">
                        Loading reviews...
                    </div>
                )}

                {!loading && error && (
                    <div className="admin-reviews-error">
                        {error}
                    </div>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <div className="admin-reviews-empty">
                        <h2>No Reviews Yet</h2>
                        <p>
                            Customer reviews will appear here once they are submitted.
                        </p>
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="admin-reviews-list">

                        {reviews.map((review) => (

                            <div
                                className="admin-review-card"
                                key={review.id}
                            >

                                <div className="admin-review-card-top">

                                    <div>

                                        <h2>
                                            {review.serviceName || 'Service'}
                                        </h2>

                                        <p>
                                            Review #{review.id}
                                        </p>

                                    </div>

                                    {renderStars(review.rating)}

                                </div>

                                <div className="admin-review-divider"></div>

                                <div className="admin-review-details">

                                    <div>
                                        <span>Customer</span>
                                        <strong>
                                            {review.customerName || '-'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Customer ID</span>
                                        <strong>
                                            {review.customerId
                                                ? `#${review.customerId}`
                                                : '-'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Appointment</span>
                                        <strong>
                                            {review.appointmentId
                                                ? `#${review.appointmentId}`
                                                : '-'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Submitted</span>
                                        <strong>
                                            {formatDateTime(review.createdAt)}
                                        </strong>
                                    </div>

                                </div>

                                <div className="admin-review-comment">

                                    <span>Customer Feedback</span>

                                    <p>
                                        {review.comment || 'No comment provided.'}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </main>

            <footer className="admin-reviews-footer">

                <div className="admin-reviews-footer-brand">

                    <div className="admin-reviews-footer-icon">
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

export default AdminReviews;