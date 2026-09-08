import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './ServiceDetails.css';

function ServiceDetails() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchService = async () => {

            try {

                const response = await api.get(`/services/${id}`);

                setService(response.data);

            } catch (error) {

                console.error('Failed to load service:', error);

                setError(
                    'Unable to load this service. Please try again.'
                );

            } finally {

                setLoading(false);

            }

        };

        fetchService();

    }, [id]);


    const formatDuration = (duration) => {

        if (!duration) {
            return '';
        }

        if (duration < 60) {
            return `${duration} mins`;
        }

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (minutes === 0) {
            return `${hours} hr${hours > 1 ? 's' : ''}`;
        }

        return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} mins`;
    };


    const getInitials = (serviceName) => {

        if (!serviceName) {
            return 'SP';
        }

        return serviceName
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };


    if (loading) {

        return (
            <div className="service-details-page">

                <div className="service-details-loading">

                    <div className="service-details-loader"></div>

                    <p>
                        Loading service details...
                    </p>

                </div>

            </div>
        );

    }


    if (error || !service) {

        return (
            <div className="service-details-page">

                <nav className="service-details-navbar">

                    <div className="service-details-navbar-inner">

                        <div
                            className="service-details-brand"
                            onClick={() => navigate('/customer')}
                        >
                            <div className="service-details-brand-icon">
                                SP
                            </div>

                            <div className="service-details-brand-name">
                                Service<span>Pro</span>
                            </div>
                        </div>

                    </div>

                </nav>

                <div className="service-details-error">

                    <div className="service-details-error-icon">
                        !
                    </div>

                    <h2>
                        Service not found
                    </h2>

                    <p>
                        {error || 'The requested service could not be found.'}
                    </p>

                    <button
                        onClick={() => navigate('/services')}
                    >
                        Back to Services
                    </button>

                </div>

            </div>
        );

    }


    return (

        <div className="service-details-page">

            <nav className="service-details-navbar">

                <div className="service-details-navbar-inner">

                    <div
                        className="service-details-brand"
                        onClick={() => navigate('/customer')}
                    >
                        <div className="service-details-brand-icon">
                            SP
                        </div>

                        <div className="service-details-brand-name">
                            Service<span>Pro</span>
                        </div>
                    </div>

                    <div className="service-details-nav-links">

                        <span
                            onClick={() => navigate('/customer')}
                        >
                            Home
                        </span>

                        <span
                            className="active"
                            onClick={() => navigate('/services')}
                        >
                            Services
                        </span>

                        <span
                            onClick={() => navigate('/appointments')}
                        >
                            My Appointments
                        </span>

                    </div>

                    <button
                        className="service-details-profile-button"
                        onClick={() => navigate('/profile')}
                    >
                        My Profile
                    </button>

                </div>

            </nav>


            <main className="service-details-main">

                <div className="service-details-breadcrumb">

                    <span
                        onClick={() => navigate('/services')}
                    >
                        Services
                    </span>

                    <span>
                        /
                    </span>

                    <strong>
                        {service.serviceName}
                    </strong>

                </div>


                <section className="service-details-hero">

                    <div className="service-details-visual">

                        <div className="service-details-large-icon">
                            {getInitials(service.serviceName)}
                        </div>

                        <div className="service-details-visual-label">
                            PROFESSIONAL SERVICE
                        </div>

                    </div>


                    <div className="service-details-info">

                        <div className="service-details-category">
                            {service.category}
                        </div>

                        <h1>
                            {service.serviceName}
                        </h1>

                        <p className="service-details-description">
                            {service.description}
                        </p>


                        <div className="service-details-highlights">

                            <div className="service-highlight">

                                <span>
                                    Starting price
                                </span>

                                <strong>
                                    ₹{Number(service.price).toLocaleString('en-IN')}
                                </strong>

                            </div>


                            <div className="service-highlight">

                                <span>
                                    Estimated duration
                                </span>

                                <strong>
                                    {formatDuration(service.estimatedDuration)}
                                </strong>

                            </div>

                        </div>


                        <div className="service-details-actions">

                            <button
                                className="service-details-book-button"
                                onClick={() =>
                                    navigate(`/services/${service.id}/book`)
                                }
                            >
                                Book This Service
                                <span>→</span>
                            </button>

                            <button
                                className="service-details-back-button"
                                onClick={() => navigate('/services')}
                            >
                                Back to Services
                            </button>

                        </div>

                    </div>

                </section>


                <section className="service-details-bottom">

                    <div className="service-details-bottom-card">

                        <div className="bottom-card-number">
                            01
                        </div>

                        <div>
                            <h3>
                                Professional Service
                            </h3>

                            <p>
                                Get reliable service from our
                                available professionals.
                            </p>
                        </div>

                    </div>


                    <div className="service-details-bottom-card">

                        <div className="bottom-card-number">
                            02
                        </div>

                        <div>
                            <h3>
                                Convenient Booking
                            </h3>

                            <p>
                                Choose a date and time that works
                                best for you.
                            </p>
                        </div>

                    </div>


                    <div className="service-details-bottom-card">

                        <div className="bottom-card-number">
                            03
                        </div>

                        <div>
                            <h3>
                                Easy Management
                            </h3>

                            <p>
                                Track and manage your appointment
                                from your dashboard.
                            </p>
                        </div>

                    </div>

                </section>

            </main>


            <footer className="service-details-footer">

                <div className="service-details-footer-inner">

                    <div>

                        <div className="service-details-footer-brand">

                            <div className="service-details-brand-icon">
                                SP
                            </div>

                            <div className="service-details-brand-name">
                                Service<span>Pro</span>
                            </div>

                        </div>

                        <p>
                            Making service appointments simple,
                            reliable and convenient.
                        </p>

                    </div>

                    <div className="service-details-footer-copy">
                        © 2026 ServicePro. All rights reserved.
                    </div>

                </div>

            </footer>

        </div>
    );
}

export default ServiceDetails;