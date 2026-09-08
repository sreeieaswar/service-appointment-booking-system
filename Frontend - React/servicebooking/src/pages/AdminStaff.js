import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminStaff.css';

function AdminStaff() {

    const navigate = useNavigate();

    const [staff, setStaff] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const response = await api.get('/staff');
            setStaff(response.data);
        } catch (error) {
            setError('Failed to load staff.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        const requestData = {
            name,
            email,
            password,
            skills,
            experience
        };

        try {
            if (editingId) {
                await api.put(`/staff/${editingId}`, requestData);
                setMessage('Staff member updated successfully.');
            } else {
                await api.post('/staff', requestData);
                setMessage('Staff member created successfully.');
            }

            clearForm();
            loadStaff();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to save staff member.'
            );
        }
    };

    const handleEdit = (member) => {
        setEditingId(member.id);
        setName(member.name);
        setEmail(member.email);
        setPassword('');
        setSkills(member.skills || '');
        setExperience(member.experience || '');
        setMessage('');
        setError('');
    };

    const handleDeactivate = async (id) => {

        if (!window.confirm('Are you sure you want to deactivate this staff member?')) {
            return;
        }

        setMessage('');
        setError('');

        try {
            await api.delete(`/staff/${id}`);

            setMessage('Staff member deactivated successfully.');

            loadStaff();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to deactivate staff member.'
            );
        }
    };

    const clearForm = () => {
        setEditingId(null);
        setName('');
        setEmail('');
        setPassword('');
        setSkills('');
        setExperience('');
    };

    const handleCancelEdit = () => {
        clearForm();
        setMessage('');
        setError('');
    };

    return (
        <div className="admin-staff">

            <header className="admin-staff-header">

                <div className="admin-staff-brand">
                    <div className="admin-staff-brand-icon">SP</div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <button
                    className="admin-staff-back"
                    onClick={() => navigate('/admin')}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-staff-main">

                <div className="admin-staff-title">
                    <p>ADMIN / STAFF</p>
                    <h1>Staff Management</h1>
                    <span>
                        Create and manage the staff members who handle customer appointments.
                    </span>
                </div>

                <section className="admin-staff-form-card">

                    <h2>
                        {editingId ? 'Edit Staff Member' : 'Add Staff Member'}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="admin-staff-form-grid">

                            <div className="admin-form-group">
                                <label>Name</label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter staff name"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter staff email"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Password
                                    {editingId && (
                                        <span className="admin-password-note">
                                            {' '} (enter a new password only if required)
                                        </span>
                                    )}
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={
                                        editingId
                                            ? 'Enter new password'
                                            : 'Enter password'
                                    }
                                    required={!editingId}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Experience</label>

                                <input
                                    type="text"
                                    value={experience}
                                    onChange={(e) =>
                                        setExperience(e.target.value)
                                    }
                                    placeholder="e.g. 3 years"
                                    required
                                />
                            </div>

                        </div>

                        <div className="admin-form-group">
                            <label>Skills</label>

                            <textarea
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="Enter staff skills"
                                rows="3"
                                required
                            />
                        </div>

                        <div className="admin-form-buttons">

                            <button
                                type="submit"
                                className="admin-save-button"
                            >
                                {editingId
                                    ? 'Update Staff'
                                    : 'Add Staff'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                    {message && (
                        <p className="admin-success-message">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="admin-error-message">
                            {error}
                        </p>
                    )}

                </section>

                <section className="admin-staff-list-card">

                    <div className="admin-staff-list-header">
                        <div>
                            <h2>All Staff</h2>
                            <p>Manage existing service staff members.</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="admin-staff-status">
                            Loading staff...
                        </p>
                    ) : staff.length === 0 ? (
                        <p className="admin-staff-status">
                            No staff members found.
                        </p>
                    ) : (
                        <div className="admin-staff-table-wrapper">

                            <table className="admin-staff-table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Skills</th>
                                        <th>Experience</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {staff.map((member) => (
                                        <tr key={member.id}>

                                            <td>{member.id}</td>

                                            <td>
                                                <strong>{member.name}</strong>
                                            </td>

                                            <td>{member.email}</td>

                                            <td>{member.skills}</td>

                                            <td>{member.experience}</td>

                                            <td>
                                                <span
                                                    className={
                                                        member.active
                                                            ? 'staff-active'
                                                            : 'staff-inactive'
                                                    }
                                                >
                                                    {member.active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        handleEdit(member)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {member.active && (
                                                    <button
                                                        className="admin-deactivate-button"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                member.id
                                                            )
                                                        }
                                                    >
                                                        Deactivate
                                                    </button>
                                                )}

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminStaff;