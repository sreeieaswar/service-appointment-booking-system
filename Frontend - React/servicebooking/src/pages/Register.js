import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const response = await api.post('/register', formData);

            setMessage(response.data.message || 'Registration successful');

            setFormData({
                name: '',
                email: '',
                password: ''
            });

        } catch (err) {
            if (err.response && err.response.data) {
                setError(
                    err.response.data.message ||
                    'Registration failed'
                );
            } else {
                setError('Unable to connect to the server');
            }
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                <div className="auth-left">

                    <div className="brand-section">
                        <div className="brand-icon">SP</div>
                        <h1>Service<span>Pro</span></h1>
                    </div>

                    <div className="welcome-section">
                        <h2>Book. Relax.<br />We'll Handle the Rest.</h2>

                        <p>
                            Find trusted professionals and book your
                            service appointments with ease.
                        </p>

                        <div className="feature-list">
                            <div>✓ Easy online booking</div>
                            <div>✓ Trusted service professionals</div>
                            <div>✓ Manage appointments anytime</div>
                        </div>
                    </div>

                </div>

                <div className="auth-right">

                    <div className="auth-form">

                        <div className="mobile-brand">
                            <div className="brand-icon">SP</div>
                            <h1>Service<span>Pro</span></h1>
                        </div>

                        <h2>Create your account</h2>

                        <p className="form-subtitle">
                            Join ServicePro and book your services easily.
                        </p>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="input-group-custom">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group-custom">
                                <label>Email Address</label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group-custom">
                                <label>Password</label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                            >
                                Create Account
                            </button>

                        </form>

                        <p className="login-link">
                            Already have an account?
                            <span onClick={() => navigate('/login')}>
                                Login
                            </span>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;