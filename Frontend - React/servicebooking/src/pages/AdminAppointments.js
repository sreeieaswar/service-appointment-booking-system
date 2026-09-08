import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminAppointments.css';

function AdminAppointments() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [staff, setStaff] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [assigningAppointmentId, setAssigningAppointmentId] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState('');

    const [statusAppointmentId, setStatusAppointmentId] = useState(null);
    const [selectedNewStatus, setSelectedNewStatus] = useState('');

    useEffect(() => {
        loadAppointments();
        loadStaff();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/appointments');

            setAppointments(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to load appointments.'
            );
        } finally {
            setLoading(false);
        }
    };

    const loadStaff = async () => {
        try {
            const response = await api.get('/staff');

            const activeStaff = response.data.filter(
                (member) => member.active
            );

            setStaff(activeStaff);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to load staff.'
            );
        }
    };

    const handleFilter = async () => {

        setMessage('');
        setError('');
        setLoading(true);

        try {

            let response;

            if (selectedDate && selectedStatus) {

                response = await api.get(
                    `/appointments/filter?date=${selectedDate}&status=${selectedStatus}`
                );

            } else if (selectedDate) {

                response = await api.get(
                    `/appointments/date/${selectedDate}`
                );

            } else if (selectedStatus) {

                response = await api.get(
                    `/appointments/status/${selectedStatus}`
                );

            } else {

                response = await api.get('/appointments');

            }

            setAppointments(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to filter appointments.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSelectedDate('');
        setSelectedStatus('');
        loadAppointments();
    };

    const handleAssignStaff = async (appointmentId) => {

        if (!selectedStaffId) {
            setError('Please select a staff member.');
            return;
        }

        setMessage('');
        setError('');

        try {

            await api.put(
                `/appointments/${appointmentId}/assign-staff`,
                {
                    staffId: Number(selectedStaffId)
                }
            );

            setMessage('Staff assigned successfully.');

            setAssigningAppointmentId(null);
            setSelectedStaffId('');

            loadAppointments();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to assign staff.'
            );
        }
    };

    const handleUpdateStatus = async (appointmentId) => {

        if (!selectedNewStatus) {
            setError('Please select a status.');
            return;
        }

        setMessage('');
        setError('');

        try {

            await api.put(
                `/appointments/${appointmentId}/status`,
                {
                    status: selectedNewStatus
                }
            );

            setMessage('Appointment status updated successfully.');

            setStatusAppointmentId(null);
            setSelectedNewStatus('');

            loadAppointments();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to update appointment status.'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        const parts = date.split('-');

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const formatTime = (time) => {
        if (!time) {
            return '-';
        }

        return time.substring(0, 5);
    };

    const formatStatus = (status) => {
        if (!status) {
            return '-';
        }

        return status
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <div className="admin-appointments">

            <header className="admin-appointments-header">

                <div className="admin-appointments-brand">

                    <div className="admin-appointments-brand-icon">
                        SP
                    </div>

                    <div>
                        <h2>ServicePro</h2>
                        <span>Admin Portal</span>
                    </div>

                </div>

                <button
                    className="admin-appointments-back"
                    onClick={() => navigate('/admin')}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-appointments-main">

                <div className="admin-appointments-title">

                    <p>ADMIN / APPOINTMENTS</p>

                    <h1>Appointment Management</h1>

                    <span>
                        View, filter, assign and manage customer appointments.
                    </span>

                </div>

                <section className="admin-appointment-filter-card">

                    <div className="admin-filter-header">

                        <div>
                            <h2>Filter Appointments</h2>

                            <p>
                                Find appointments by date or status.
                            </p>
                        </div>

                    </div>

                    <div className="admin-filter-controls">

                        <div className="admin-filter-group">

                            <label>Date</label>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                            />

                        </div>

                        <div className="admin-filter-group">

                            <label>Status</label>

                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="CONFIRMED">
                                    Confirmed
                                </option>

                                <option value="ASSIGNED">
                                    Assigned
                                </option>

                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>

                                <option value="REJECTED">
                                    Rejected
                                </option>

                            </select>

                        </div>

                        <div className="admin-filter-buttons">

                            <button
                                className="admin-filter-button"
                                onClick={handleFilter}
                            >
                                Apply Filter
                            </button>

                            <button
                                className="admin-clear-filter-button"
                                onClick={handleClearFilters}
                            >
                                Clear
                            </button>

                        </div>

                    </div>

                </section>

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

                <section className="admin-appointment-list-card">

                    <div className="admin-appointment-list-header">

                        <div>
                            <h2>All Appointments</h2>

                            <p>
                                Manage appointments and assign service staff.
                            </p>
                        </div>

                        <span className="admin-appointment-count">
                            {appointments.length} appointment
                            {appointments.length !== 1 ? 's' : ''}
                        </span>

                    </div>

                    {loading ? (

                        <p className="admin-appointment-status">
                            Loading appointments...
                        </p>

                    ) : appointments.length === 0 ? (

                        <p className="admin-appointment-status">
                            No appointments found.
                        </p>

                    ) : (

                        <div className="admin-appointment-table-wrapper">

                            <table className="admin-appointment-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Staff</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {appointments.map((appointment) => (

                                        <tr key={appointment.id}>

                                            <td>
                                                #{appointment.id}
                                            </td>

                                            <td>

                                                <strong>
                                                    {appointment.customerName}
                                                </strong>

                                                <div className="appointment-secondary-text">
                                                    ID: {appointment.customerId}
                                                </div>

                                            </td>

                                            <td>

                                                <strong>
                                                    {appointment.serviceName}
                                                </strong>

                                                <div className="appointment-secondary-text">
                                                    ID: {appointment.serviceId}
                                                </div>

                                            </td>

                                            <td>

                                                {appointment.staffName ? (
                                                    <>

                                                        <strong>
                                                            {appointment.staffName}
                                                        </strong>

                                                        <div className="appointment-secondary-text">
                                                            ID: {appointment.staffId}
                                                        </div>

                                                    </>
                                                ) : (
                                                    <span className="unassigned-text">
                                                        Unassigned
                                                    </span>
                                                )}

                                            </td>

                                            <td>
                                                {formatDate(
                                                    appointment.appointmentDate
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    appointment.startTime
                                                )}
                                                {' - '}
                                                {formatTime(
                                                    appointment.endTime
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    appointment.finalServiceCharge ??
                                                    appointment.estimatedPrice ??
                                                    0
                                                ).toFixed(2)}
                                            </td>

                                            <td>
                                                <span
                                                    className="appointment-status"
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '5px 9px',
                                                        borderRadius: '20px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        whiteSpace: 'nowrap',
                                                        background:
                                                            appointment.status === 'COMPLETED'
                                                                ? '#dcfce7'
                                                                : appointment.status === 'CANCELLED'
                                                                ? '#fee2e2'
                                                                : appointment.status === 'CONFIRMED'
                                                                ? '#dbeafe'
                                                                : appointment.status === 'ASSIGNED'
                                                                ? '#e0e7ff'
                                                                : appointment.status === 'IN_PROGRESS'
                                                                ? '#f3e8ff'
                                                                : appointment.status === 'REJECTED'
                                                                ? '#f3f4f6'
                                                                : '#fef3c7',
                                                        color:
                                                            appointment.status === 'COMPLETED'
                                                                ? '#166534'
                                                                : appointment.status === 'CANCELLED'
                                                                ? '#991b1b'
                                                                : appointment.status === 'CONFIRMED'
                                                                ? '#1e40af'
                                                                : appointment.status === 'ASSIGNED'
                                                                ? '#3730a3'
                                                                : appointment.status === 'IN_PROGRESS'
                                                                ? '#6b21a8'
                                                                : appointment.status === 'REJECTED'
                                                                ? '#374151'
                                                                : '#92400e'
                                                    }}
                                                >
                                                    {formatStatus(
                                                        appointment.status || 'PENDING'
                                                    )}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    className="admin-view-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/appointments/${appointment.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="admin-assign-button"
                                                    onClick={() => {
                                                        setAssigningAppointmentId(
                                                            appointment.id
                                                        );

                                                        setSelectedStaffId(
                                                            appointment.staffId || ''
                                                        );

                                                        setStatusAppointmentId(
                                                            null
                                                        );

                                                        setMessage('');
                                                        setError('');
                                                    }}
                                                >
                                                    Assign
                                                </button>

                                                {appointment.status === 'PENDING' && (

                                                    <button
                                                        className="admin-status-button"
                                                        onClick={() => {
                                                            setStatusAppointmentId(
                                                                appointment.id
                                                            );

                                                            setSelectedNewStatus(
                                                                ''
                                                            );

                                                            setAssigningAppointmentId(
                                                                null
                                                            );

                                                            setMessage('');
                                                            setError('');
                                                        }}
                                                    >
                                                        Status
                                                    </button>

                                                )}

                                                {assigningAppointmentId === appointment.id && (

                                                    <div className="admin-inline-action">

                                                        <select
                                                            value={selectedStaffId}
                                                            onChange={(e) =>
                                                                setSelectedStaffId(
                                                                    e.target.value
                                                                )
                                                            }
                                                        >

                                                            <option value="">
                                                                Select staff
                                                            </option>

                                                            {staff.map(
                                                                (member) => (
                                                                    <option
                                                                        key={
                                                                            member.id
                                                                        }
                                                                        value={
                                                                            member.id
                                                                        }
                                                                    >
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}

                                                        </select>

                                                        <button
                                                            className="admin-confirm-action"
                                                            onClick={() =>
                                                                handleAssignStaff(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            className="admin-cancel-action"
                                                            onClick={() => {
                                                                setAssigningAppointmentId(
                                                                    null
                                                                );

                                                                setSelectedStaffId(
                                                                    ''
                                                                );
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                )}

                                                {statusAppointmentId === appointment.id && (

                                                    <div className="admin-inline-action">

                                                        <select
                                                            value={selectedNewStatus}
                                                            onChange={(e) =>
                                                                setSelectedNewStatus(
                                                                    e.target.value
                                                                )
                                                            }
                                                        >

                                                            <option value="">
                                                                Select status
                                                            </option>

                                                            <option value="CONFIRMED">
                                                                Confirmed
                                                            </option>

                                                            <option value="REJECTED">
                                                                Rejected
                                                            </option>

                                                        </select>

                                                        <button
                                                            className="admin-confirm-action"
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            className="admin-cancel-action"
                                                            onClick={() => {
                                                                setStatusAppointmentId(
                                                                    null
                                                                );

                                                                setSelectedNewStatus(
                                                                    ''
                                                                );
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

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

export default AdminAppointments;