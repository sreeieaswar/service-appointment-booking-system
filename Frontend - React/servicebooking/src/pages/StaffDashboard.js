import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';

function StaffDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        navigate('/login');
    };

    return (
        <div className="staff-dashboard">

            <header className="staff-header">
                <div className="staff-brand">
                    <div className="staff-brand-icon">SP</div>
                    <div>
                        <h2>ServicePro</h2>
                        <span>Staff Portal</span>
                    </div>
                </div>

                <button
                    className="staff-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <main className="staff-main">

                <section className="staff-welcome">
                    <div>
                        <p className="staff-label">STAFF DASHBOARD</p>
                        <h1>Welcome back!</h1>
                        <p>
                            Manage your assigned appointments and keep
                            track of your service progress.
                        </p>
                    </div>
                </section>

                <section className="staff-panel">

                    <div className="staff-panel-header">
                        <div>
                            <h2>Staff Panel</h2>
                            <p>
                                View your assigned appointments and update
                                their service progress.
                            </p>
                        </div>
                    </div>

                    <div className="staff-actions">

                        <button
                            className="staff-primary-button"
                            onClick={() =>
                                navigate('/staff/appointments')
                            }
                        >
                            <span>Assigned Appointments</span>
                            <span className="button-arrow">→</span>
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default StaffDashboard;