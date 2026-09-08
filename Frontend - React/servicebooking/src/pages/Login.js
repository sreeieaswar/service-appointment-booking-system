import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        try {
            const response = await api.post('/login', formData);

            localStorage.setItem('token', response.data.token);

            const tokenPayload = JSON.parse(
                atob(response.data.token.split('.')[1])
            );

            localStorage.setItem('userId', tokenPayload.userId);
            localStorage.setItem('role', response.data.role);

            if (response.data.role === 'CUSTOMER') {
                window.location.href = '/customer';
            } else if (response.data.role === 'STAFF') {
                window.location.href = '/staff';
            } else if (response.data.role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                setError('Invalid user role');
            }

        } catch (err) {
            if (err.response && err.response.data) {
                setError(
                    err.response.data.message ||
                    'Invalid email or password'
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
                        <h2>Welcome<br />Back!</h2>

                        <p>
                            Your next appointment is just a few
                            clicks away. Sign in and continue managing
                            your services.
                        </p>

                        <div className="feature-list">
                            <div>✓ Manage your appointments</div>
                            <div>✓ Discover professional services</div>
                            <div>✓ Track your service requests</div>
                        </div>
                    </div>

                </div>

                <div className="auth-right">

                    <div className="auth-form">

                        <div className="mobile-brand">
                            <div className="brand-icon">SP</div>
                            <h1>Service<span>Pro</span></h1>
                        </div>

                        <h2>Welcome back</h2>

                        <p className="form-subtitle">
                            Sign in to your ServicePro account.
                        </p>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

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
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                            >
                                Sign In
                            </button>

                        </form>

                        <p className="login-link">
                            Don't have an account?
                            <span onClick={() => navigate('/register')}>
                                Register
                            </span>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;