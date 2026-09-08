import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminServices.css';

function AdminServices() {

    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);

    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [category, setCategory] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadServices();
        loadCategories();
    }, []);

    const loadServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data);
        } catch (error) {
            setError('Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');

            const activeCategories = response.data.filter(
                (item) => item.active
            );

            setCategories(activeCategories);
        } catch (error) {
            setError('Failed to load categories.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        const requestData = {
            serviceName,
            description,
            price: Number(price),
            estimatedDuration: Number(estimatedDuration),
            category
        };

        try {
            if (editingId) {
                await api.put(`/services/${editingId}`, requestData);
                setMessage('Service updated successfully.');
            } else {
                await api.post('/services', requestData);
                setMessage('Service created successfully.');
            }

            clearForm();
            loadServices();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to save service.'
            );
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setServiceName(service.serviceName);
        setDescription(service.description || '');
        setPrice(service.price);
        setEstimatedDuration(service.estimatedDuration);
        setCategory(service.category || '');
        setMessage('');
        setError('');
    };

    const handleDeactivate = async (id) => {

        if (!window.confirm('Are you sure you want to deactivate this service?')) {
            return;
        }

        setMessage('');
        setError('');

        try {
            await api.delete(`/services/${id}`);

            setMessage('Service deactivated successfully.');

            loadServices();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to deactivate service.'
            );
        }
    };

    const clearForm = () => {
        setEditingId(null);
        setServiceName('');
        setDescription('');
        setPrice('');
        setEstimatedDuration('');
        setCategory('');
    };

    const handleCancelEdit = () => {
        clearForm();
        setMessage('');
        setError('');
    };

    return (
        <div className="admin-services">

            <header className="admin-services-header">

                <div className="admin-services-brand">
                    <div className="admin-services-brand-icon">SP</div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <button
                    className="admin-services-back"
                    onClick={() => navigate('/admin')}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-services-main">

                <div className="admin-services-title">
                    <p>ADMIN / SERVICES</p>
                    <h1>Service Management</h1>
                    <span>
                        Create and manage the services offered by ServicePro.
                    </span>
                </div>

                <section className="admin-service-form-card">

                    <h2>
                        {editingId ? 'Edit Service' : 'Add Service'}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="admin-service-form-grid">

                            <div className="admin-form-group">
                                <label>Service Name</label>
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) =>
                                        setServiceName(e.target.value)
                                    }
                                    placeholder="Enter service name"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Category</label>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    placeholder="Enter price"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Estimated Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={estimatedDuration}
                                    onChange={(e) =>
                                        setEstimatedDuration(e.target.value)
                                    }
                                    placeholder="Enter duration"
                                    min="1"
                                    required
                                />
                            </div>

                        </div>

                        <div className="admin-form-group">
                            <label>Description</label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Enter service description"
                                rows="4"
                            />
                        </div>

                        <div className="admin-form-buttons">

                            <button
                                type="submit"
                                className="admin-save-button"
                            >
                                {editingId
                                    ? 'Update Service'
                                    : 'Add Service'}
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

                <section className="admin-service-list-card">

                    <div className="admin-service-list-header">
                        <div>
                            <h2>All Services</h2>
                            <p>Manage existing services.</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="admin-service-status">
                            Loading services...
                        </p>
                    ) : services.length === 0 ? (
                        <p className="admin-service-status">
                            No services found.
                        </p>
                    ) : (
                        <div className="admin-service-table-wrapper">

                            <table className="admin-service-table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Service</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {services.map((service) => (
                                        <tr key={service.id}>

                                            <td>{service.id}</td>

                                            <td>
                                                <strong>
                                                    {service.serviceName}
                                                </strong>
                                                <div className="service-description">
                                                    {service.description || '-'}
                                                </div>
                                            </td>

                                            <td>{service.category}</td>

                                            <td>
                                                ₹{Number(service.price).toFixed(2)}
                                            </td>

                                            <td>
                                                {service.estimatedDuration} min
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        service.active
                                                            ? 'service-active'
                                                            : 'service-inactive'
                                                    }
                                                >
                                                    {service.active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        handleEdit(service)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {service.active && (
                                                    <button
                                                        className="admin-deactivate-button"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                service.id
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

export default AdminServices;