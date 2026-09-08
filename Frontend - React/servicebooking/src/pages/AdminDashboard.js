import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        navigate('/login');
    };

    return (
        <div className="admin-dashboard">

            <header className="admin-header">
                <div className="admin-brand">
                    <div className="admin-brand-icon">SP</div>
                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <main className="admin-main">

                <section className="admin-welcome">
                    <div>
                        <p className="admin-label">ADMIN DASHBOARD</p>
                        <h1>Welcome back, Admin!</h1>
                        <p>
                            Manage services, staff, appointments, customers
                            and reviews from one place.
                        </p>
                    </div>
                </section>

                <section className="admin-panel">

                    <div className="admin-panel-header">
                        <div>
                            <h2>Admin Panel</h2>
                            <p>
                                Select an area to manage the ServicePro system.
                            </p>
                        </div>
                    </div>

                    <div className="admin-actions">

                        <button
                            className="admin-primary-button"
                            onClick={() => navigate('/admin/categories')}
                        >
                            <span>Service Categories</span>
                            <span className="button-arrow">→</span>
                        </button>

                        <button
                            className="admin-primary-button"
                            onClick={() => navigate('/admin/services')}
                        >
                            <span>Services</span>
                            <span className="button-arrow">→</span>
                        </button>

                        <button
                            className="admin-primary-button"
                            onClick={() => navigate('/admin/staff')}
                        >
                            <span>Staff Management</span>
                            <span className="button-arrow">→</span>
                        </button>

                        <button
                            className="admin-primary-button"
                            onClick={() => navigate('/admin/appointments')}
                        >
                            <span>Appointments</span>
                            <span className="button-arrow">→</span>
                        </button>

                        <button
                            className="admin-primary-button"
                            onClick={() => navigate('/admin/reviews')}
                        >
                            <span>Reviews</span>
                            <span className="button-arrow">→</span>
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;