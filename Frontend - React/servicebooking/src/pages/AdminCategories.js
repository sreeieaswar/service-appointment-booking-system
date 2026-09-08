import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminCategories.css';

function AdminCategories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, {
                    name,
                    description
                });

                setMessage('Category updated successfully.');
            } else {
                await api.post('/categories', {
                    name,
                    description
                });

                setMessage('Category created successfully.');
            }

            setName('');
            setDescription('');
            setEditingId(null);

            loadCategories();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to save category.'
            );
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
        setDescription(category.description || '');
        setMessage('');
        setError('');
    };

    const handleDeactivate = async (id) => {

        if (!window.confirm('Are you sure you want to deactivate this category?')) {
            return;
        }

        setMessage('');
        setError('');

        try {
            await api.delete(`/categories/${id}`);

            setMessage('Category deactivated successfully.');

            loadCategories();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to deactivate category.'
            );
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setMessage('');
        setError('');
    };

    return (
        <div className="admin-categories">

            <header className="admin-categories-header">

                <div className="admin-categories-brand">
                    <div className="admin-categories-brand-icon">SP</div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <button
                    className="admin-categories-back"
                    onClick={() => navigate('/admin')}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-categories-main">

                <div className="admin-categories-title">
                    <p>ADMIN / CATEGORIES</p>
                    <h1>Service Categories</h1>
                    <span>
                        Create and manage the categories used for services.
                    </span>
                </div>

                <section className="admin-category-form-card">

                    <h2>
                        {editingId ? 'Edit Category' : 'Add Category'}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="admin-form-group">
                            <label>Category Name</label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter category name"
                                maxLength="100"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Description</label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Enter category description"
                                maxLength="500"
                                rows="4"
                            />
                        </div>

                        <div className="admin-form-buttons">

                            <button
                                type="submit"
                                className="admin-save-button"
                            >
                                {editingId ? 'Update Category' : 'Add Category'}
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

                <section className="admin-category-list-card">

                    <div className="admin-category-list-header">
                        <div>
                            <h2>All Categories</h2>
                            <p>Manage existing service categories.</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="admin-category-status">
                            Loading categories...
                        </p>
                    ) : categories.length === 0 ? (
                        <p className="admin-category-status">
                            No categories found.
                        </p>
                    ) : (
                        <div className="admin-category-table-wrapper">

                            <table className="admin-category-table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {categories.map((category) => (
                                        <tr key={category.id}>

                                            <td>{category.id}</td>

                                            <td>{category.name}</td>

                                            <td>
                                                {category.description || '-'}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        category.active
                                                            ? 'category-active'
                                                            : 'category-inactive'
                                                    }
                                                >
                                                    {category.active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {category.active && (
                                                    <button
                                                        className="admin-deactivate-button"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                category.id
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

export default AdminCategories;