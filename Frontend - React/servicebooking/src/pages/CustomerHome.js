import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CustomerHome.css';

function CustomerHome() {

    const navigate = useNavigate();

    const [upcomingAppointment, setUpcomingAppointment] = useState(null);

    useEffect(() => {

        const customerId = localStorage.getItem('userId');

        if (!customerId) {
            return;
        }

        const fetchAppointments = async () => {

            try {

                const response = await api.get(
                    `/appointments/customer/${customerId}`
                );

                const appointments = response.data;

                const now = new Date();

                const upcoming = appointments
                    .filter((appointment) => {

                        if (
                            appointment.status === 'CANCELLED' ||
                            appointment.status === 'REJECTED' ||
                            appointment.status === 'COMPLETED'
                        ) {
                            return false;
                        }

                        const appointmentDateTime = new Date(
                            `${appointment.appointmentDate}T${appointment.startTime}`
                        );

                        return appointmentDateTime >= now;
                    })
                    .sort((a, b) => {

                        const dateA = new Date(
                            `${a.appointmentDate}T${a.startTime}`
                        );

                        const dateB = new Date(
                            `${b.appointmentDate}T${b.startTime}`
                        );

                        return dateA - dateB;
                    });

                setUpcomingAppointment(upcoming[0] || null);

            } catch (error) {

                console.error(
                    'Failed to load appointments:',
                    error
                );

            }

        };

        fetchAppointments();

    }, []);


    const formatMonth = (date) => {

        if (!date) {
            return '--';
        }

        return new Date(date)
            .toLocaleString('en-US', {
                month: 'short'
            })
            .toUpperCase();

    };


    const formatDay = (date) => {

        if (!date) {
            return '--';
        }

        return new Date(date).getDate();

    };


    const formatFullDate = (date) => {

        if (!date) {
            return '';
        }

        return new Date(date).toLocaleDateString(
            'en-US',
            {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }
        );

    };


    const formatTime = (time) => {

        if (!time) {
            return '';

        }

        const [hours, minutes] = time.split(':');

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: '2-digit'
            }
        );

    };


    const getServiceInitials = (serviceName) => {

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


    return (

        <div className="customer-home">


            {/* Navbar */}

            <nav className="home-navbar">

                <div className="home-navbar-inner">

                    <div
                        className="home-brand"
                        onClick={() => navigate('/customer')}
                    >

                        <div className="home-brand-icon">
                            SP
                        </div>

                        <div className="home-brand-name">
                            Service<span>Pro</span>
                        </div>

                    </div>


                    <div className="home-nav-links">

                        <span
                            className="active"
                            onClick={() => navigate('/customer')}
                        >
                            Home
                        </span>

                        <span
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
                        className="profile-button"
                        onClick={() => navigate('/profile')}
                    >
                        My Profile
                    </button>

                </div>

            </nav>



            {/* Hero Section */}

            <section className="home-hero">

                <div className="hero-content">


                    {/* Hero Text */}

                    <div className="hero-text">

                        <div className="hero-tag">
                            SIMPLE. RELIABLE. PROFESSIONAL.
                        </div>


                        <h1>
                            Quality services,
                            <br />
                            <span>
                                right when you need them.
                            </span>
                        </h1>


                        <p>
                            Book trusted professionals, manage your
                            appointments and get your services done
                            without the hassle.
                        </p>


                        <div className="hero-buttons">

                            <button
                                className="primary-home-button"
                                onClick={() => navigate('/services')}
                            >
                                Explore Services
                                <span>→</span>
                            </button>


                            <button
                                className="secondary-home-button"
                                onClick={() => navigate('/appointments')}
                            >
                                My Appointments
                            </button>

                        </div>


                        <div className="hero-trust">

                            <div className="trust-people">

                                <span>✓</span>
                                <span>✓</span>
                                <span>✓</span>

                            </div>


                            <div>

                                <strong>
                                    Trusted by customers
                                </strong>

                                <small>
                                    Easy booking · Reliable service
                                </small>

                            </div>

                        </div>

                    </div>



                    {/* Booking Visual */}

                    <div className="hero-visual">

                        <div className="booking-card">


                            <div className="booking-card-header">

                                <div>

                                    <small>
                                        YOUR APPOINTMENT
                                    </small>

                                    <h3>
                                        Upcoming Service
                                    </h3>

                                </div>


                                <div className="calendar-box">

                                    <span>
                                        {upcomingAppointment
                                            ? formatMonth(
                                                upcomingAppointment.appointmentDate
                                            )
                                            : '--'}
                                    </span>

                                    <strong>
                                        {upcomingAppointment
                                            ? formatDay(
                                                upcomingAppointment.appointmentDate
                                            )
                                            : '--'}
                                    </strong>

                                </div>

                            </div>



                            <div className="booking-date">

                                {upcomingAppointment ? (

                                    <>

                                        <div className="date-icon">

                                            {formatDay(
                                                upcomingAppointment.appointmentDate
                                            )}

                                        </div>


                                        <div>

                                            <strong>

                                                {formatFullDate(
                                                    upcomingAppointment.appointmentDate
                                                )}

                                            </strong>


                                            <small>

                                                {formatTime(
                                                    upcomingAppointment.startTime
                                                )}

                                                {' – '}

                                                {formatTime(
                                                    upcomingAppointment.endTime
                                                )}

                                            </small>

                                        </div>

                                    </>

                                ) : (

                                    <>

                                        <div className="date-icon">
                                            —
                                        </div>


                                        <div>

                                            <strong>
                                                No upcoming appointments
                                            </strong>

                                            <small>
                                                Book a service to get started
                                            </small>

                                        </div>

                                    </>

                                )}

                            </div>



                            <div className="booking-service">

                                <div className="service-icon-box">

                                    {getServiceInitials(
                                        upcomingAppointment?.serviceName
                                    )}

                                </div>


                                <div className="booking-service-info">

                                    <strong>

                                        {upcomingAppointment
                                            ? upcomingAppointment.serviceName
                                            : 'No service booked'}

                                    </strong>


                                    <small>

                                        {upcomingAppointment
                                            ? 'Professional Service'
                                            : 'Choose a service to book'}

                                    </small>

                                </div>


                                {upcomingAppointment && (

                                    <span className="status-badge">

                                        {upcomingAppointment.status}

                                    </span>

                                )}

                            </div>



                            <div className="booking-divider"></div>



                            <div className="booking-footer">

                                <div>

                                    <small>
                                        Service Address
                                    </small>


                                    <strong>

                                        {upcomingAppointment
                                            ? upcomingAppointment.serviceAddress
                                            : 'No appointment scheduled'}

                                    </strong>

                                </div>


                                <div className="booking-arrow">
                                    →
                                </div>

                            </div>

                        </div>



                        {upcomingAppointment && (

                            <div className="confirmed-card">

                                <div className="confirmed-icon">
                                    ✓
                                </div>


                                <div>

                                    <strong>
                                        Booking Confirmed
                                    </strong>

                                    <small>
                                        Your appointment is scheduled
                                    </small>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </section>



            {/* Stats */}

            <section className="home-stats">

                <div className="stat-item">

                    <strong>
                        100+
                    </strong>

                    <span>
                        Services Available
                    </span>

                </div>


                <div className="stat-divider"></div>


                <div className="stat-item">

                    <strong>
                        50+
                    </strong>

                    <span>
                        Professional Staff
                    </span>

                </div>


                <div className="stat-divider"></div>


                <div className="stat-item">

                    <strong>
                        1K+
                    </strong>

                    <span>
                        Happy Customers
                    </span>

                </div>


                <div className="stat-divider"></div>


                <div className="stat-item">

                    <strong>
                        4.8
                    </strong>

                    <span>
                        Average Rating
                    </span>

                </div>

            </section>



            {/* Popular Services */}

            <section className="popular-section">

                <div className="section-heading">

                    <div>

                        <span>
                            OUR SERVICES
                        </span>

                        <h2>
                            Popular Services
                        </h2>

                        <p>
                            Professional services for your everyday needs.
                        </p>

                    </div>


                    <button
                        onClick={() => navigate('/services')}
                    >
                        View All Services →
                    </button>

                </div>



                <div className="service-preview-grid">


                    <div className="service-preview-card">

                        <div className="service-card-top">

                            <div className="service-preview-icon">
                                HR
                            </div>

                            <span className="service-number">
                                01
                            </span>

                        </div>


                        <h3>
                            Home Repairs
                        </h3>


                        <p>
                            Professional repair and maintenance
                            services for your home.
                        </p>


                        <button
                            onClick={() => navigate('/services')}
                        >
                            Explore Service →
                        </button>

                    </div>



                    <div className="service-preview-card">

                        <div className="service-card-top">

                            <div className="service-preview-icon">
                                HC
                            </div>

                            <span className="service-number">
                                02
                            </span>

                        </div>


                        <h3>
                            Home Cleaning
                        </h3>


                        <p>
                            Keep your home clean and comfortable
                            with trusted professionals.
                        </p>


                        <button
                            onClick={() => navigate('/services')}
                        >
                            Explore Service →
                        </button>

                    </div>



                    <div className="service-preview-card">

                        <div className="service-card-top">

                            <div className="service-preview-icon">
                                AC
                            </div>

                            <span className="service-number">
                                03
                            </span>

                        </div>


                        <h3>
                            AC Services
                        </h3>


                        <p>
                            Reliable AC maintenance and repair
                            whenever you need it.
                        </p>


                        <button
                            onClick={() => navigate('/services')}
                        >
                            Explore Service →
                        </button>

                    </div>

                </div>

            </section>



            {/* CTA */}

            <section className="home-cta">

                <div className="cta-content">

                    <span>
                        READY WHEN YOU ARE
                    </span>


                    <h2>
                        Need a service?
                        <br />
                        Let's get it done.
                    </h2>


                    <p>
                        Choose a service and book your appointment
                        in just a few clicks.
                    </p>

                </div>


                <button
                    onClick={() => navigate('/services')}
                >
                    Book a Service →
                </button>

            </section>



            {/* Footer */}

            <footer className="home-footer">

                <div className="footer-inner">


                    <div className="footer-brand">

                        <div className="home-brand">

                            <div className="home-brand-icon">
                                SP
                            </div>


                            <div className="home-brand-name">
                                Service<span>Pro</span>
                            </div>

                        </div>


                        <p>
                            Making service appointments simple,
                            reliable and convenient.
                        </p>

                    </div>


                    <div className="footer-copy">

                        © 2026 ServicePro. All rights reserved.

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default CustomerHome;