import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Services.css';

function Services() {

    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchServices = async () => {

            try {

                const response = await api.get('/services');

                const activeServices = response.data.filter(
                    service => service.active === true
                );

                setServices(activeServices);

            } catch (error) {

                console.error('Failed to load services:', error);

                setError(
                    'Unable to load services. Please try again.'
                );

            } finally {

                setLoading(false);

            }

        };

        fetchServices();

    }, []);


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


    return (

        <div className="services-page">


            {/* Navbar */}

            <nav className="services-navbar">

                <div className="services-navbar-inner">

                    <div
                        className="services-brand"
                        onClick={() => navigate('/customer')}
                    >

                        <div className="services-brand-icon">
                            SP
                        </div>

                        <div className="services-brand-name">
                            Service<span>Pro</span>
                        </div>

                    </div>


                    <div className="services-nav-links">

                        <span
                            onClick={() => navigate('/customer')}
                        >
                            Home
                        </span>

                        <span className="active">
                            Services
                        </span>

                        <span
                            onClick={() => navigate('/appointments')}
                        >
                            My Appointments
                        </span>

                    </div>


                    <button
                        className="services-profile-button"
                        onClick={() => navigate('/profile')}
                    >
                        My Profile
                    </button>

                </div>

            </nav>



            {/* Page Header */}

            <section className="services-header">

                <div className="services-header-content">

                    <span className="services-eyebrow">
                        OUR SERVICES
                    </span>

                    <h1>
                        Find the right service
                        <br />
                        <span>for your needs.</span>
                    </h1>

                    <p>
                        Choose from our professional services and
                        book an appointment at your convenience.
                    </p>

                </div>

            </section>



            {/* Services */}

            <section className="services-content">

                <div className="services-content-top">

                    <div>
                        <h2>
                            Available Services
                        </h2>

                        <p>
                            {loading
                                ? 'Loading services...'
                                : `${services.length} service${services.length !== 1 ? 's' : ''} available`
                            }
                        </p>
                    </div>

                </div>


                {loading && (

                    <div className="services-state">

                        <div className="services-loader"></div>

                        <p>
                            Loading available services...
                        </p>

                    </div>

                )}


                {!loading && error && (

                    <div className="services-state error-state">

                        <div className="state-icon">
                            !
                        </div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {!loading && !error && services.length === 0 && (

                    <div className="services-state">

                        <div className="state-icon">
                            —
                        </div>

                        <h3>
                            No services available
                        </h3>

                        <p>
                            There are currently no active services.
                            Please check again later.
                        </p>

                    </div>

                )}


                {!loading && !error && services.length > 0 && (

                    <div className="services-grid">

                        {services.map((service, index) => (

                            <div
                                className="service-page-card"
                                key={service.id}
                            >

                                <div className="service-card-header">

                                    <div className="service-page-icon">
                                        {getInitials(service.serviceName)}
                                    </div>

                                    <span className="service-card-number">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                </div>


                                <div className="service-card-category">
                                    {service.category}
                                </div>


                                <h3>
                                    {service.serviceName}
                                </h3>


                                <p>
                                    {service.description}
                                </p>


                                <div className="service-card-details">

                                    <div>

                                        <small>
                                            Starting from
                                        </small>

                                        <strong>
                                            ₹{Number(service.price).toLocaleString('en-IN')}
                                        </strong>

                                    </div>


                                    <div>

                                        <small>
                                            Estimated time
                                        </small>

                                        <strong>
                                            {formatDuration(
                                                service.estimatedDuration
                                            )}
                                        </strong>

                                    </div>

                                </div>


                                <button
                                    className="service-book-button"
                                    onClick={() =>
                                        navigate(
                                            `/services/${service.id}`
                                        )
                                    }
                                >
                                    View Service
                                    <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </section>



            {/* CTA */}

            <section className="services-cta">

                <div>

                    <span>
                        NEED A SERVICE?
                    </span>

                    <h2>
                        Choose a service.
                        <br />
                        We'll handle the rest.
                    </h2>

                    <p>
                        Book professional services quickly and
                        manage your appointments in one place.
                    </p>

                </div>


                <button
                    onClick={() => navigate('/appointments')}
                >
                    View My Appointments →
                </button>

            </section>



            {/* Footer */}

            <footer className="services-footer">

                <div className="services-footer-inner">

                    <div className="services-footer-brand">

                        <div className="services-brand">

                            <div className="services-brand-icon">
                                SP
                            </div>

                            <div className="services-brand-name">
                                Service<span>Pro</span>
                            </div>

                        </div>

                        <p>
                            Making service appointments simple,
                            reliable and convenient.
                        </p>

                    </div>


                    <div className="services-footer-copy">
                        © 2026 ServicePro. All rights reserved.
                    </div>

                </div>

            </footer>

        </div>

    );

}

export default Services;