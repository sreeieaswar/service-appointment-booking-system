# Service Appointment Booking System

A full-stack web application for managing service appointments. Customers can browse available services and book appointments, while administrators manage services, categories, staff, appointments, and reviews. Service staff can view their assigned appointments and update appointment progress.

## Project Overview

The **Service Appointment Booking System** is designed to provide a structured platform for service businesses to manage the complete appointment workflow.

The application follows a role-based architecture with three main users:

- **Customer** – registers, logs in, views services, books and manages appointments, and submits reviews for completed appointments.
- **Admin** – manages service categories, services, staff, appointments, and reviews.
- **Service Staff** – views assigned appointments and updates appointment progress/status.

The project consists of a **Spring Boot REST API backend**, a **React frontend**, and a **MySQL database**.

---

## Features

### Authentication & Security

- Customer registration
- User login
- BCrypt password encryption
- JWT-based authentication
- JWT request filtering and validation
- Role-based authorization
- Protected frontend routes
- Logout functionality
- Global exception handling
- Validation of incoming requests

### Customer Features

- Customer registration and login
- View available services
- View service details
- Book an appointment
- View own appointments
- View appointment details
- Reschedule appointments
- Cancel appointments
- Track appointment status
- Submit a rating/review after a completed appointment

### Admin Features

- Admin dashboard
- Manage service categories
- Add, update, view, and manage services
- Manage service staff
- View appointments
- View appointment details
- Assign staff to appointments
- Update/manage appointment status
- View customer reviews

### Service Staff Features

- Staff dashboard
- View assigned appointments
- View appointment details
- Update appointment progress/status

### Review Features

- Customers can review completed appointments
- Rating and review support
- One review per completed appointment
- View reviews associated with services
- Admin review management

---

## Technology Stack

### Backend

| Technology | Usage |
|---|---|
| Java 21 | Programming language |
| Spring Boot 4.1.1 | Backend framework |
| Spring Data JPA | Database persistence |
| Spring Security | Authentication and authorization |
| JWT | Token-based authentication |
| BCrypt | Password encryption |
| Spring Validation | Request validation |
| REST APIs | Backend communication |
| Maven | Build and dependency management |
| Lombok | Boilerplate reduction |

The backend dependencies include Spring Data JPA, Spring Security, Validation, WebMVC, MySQL Connector/J, Lombok, and JJWT. 

### Frontend

| Technology | Usage |
|---|---|
| React.js | Frontend framework |
| JavaScript | Application logic |
| HTML | Page structure |
| CSS | Styling |
| Bootstrap | UI and responsive design |

### Database

- MySQL
- Database name: `service_booking`

---

## Project Structure

```text
service-appointment-booking-system/
│
├── Backend - Springboot/
│   └── service-booking/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/servicebooking/service_booking/
│       │   │   │       ├── controller/
│       │   │   │       ├── dto/
│       │   │   │       ├── entity/
│       │   │   │       ├── exception/
│       │   │   │       ├── repository/
│       │   │   │       ├── security/
│       │   │   │       └── service/
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
│
├── Frontend - React/
│   └── servicebooking/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── services/
│       ├── package.json
│       └── package-lock.json
│
└── README.md
```

### Application Flow

```text
                 ┌─────────────────────┐
                 │     React Frontend  │
                 │   Customer / Admin  │
                 │     / Staff UI      │
                 └──────────┬──────────┘
                            │
                       REST API + JWT
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Spring Boot API   │
                 │                     │
                 │ Controllers         │
                 │ Services            │
                 │ Repositories        │
                 │ Security / JWT      │
                 └──────────┬──────────┘
                            │
                       Spring Data JPA
                            │
                            ▼
                 ┌─────────────────────┐
                 │       MySQL         │
                 │  service_booking    │
                 └─────────────────────┘
```

---

## Database Configuration

The backend uses MySQL with the database:

```text
service_booking
```

Create the database before starting the backend:

```sql
CREATE DATABASE service_booking;
```

The application is configured to use environment variables for database credentials and the JWT secret.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/service_booking
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
jwt.expiration=3600000
```

### Environment Variables

Set the following environment variables on your local machine:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
```

**Do not commit actual database passwords or JWT secrets to GitHub.**

The application uses Hibernate's `ddl-auto=update` configuration, so the required tables are created/updated by Hibernate when the application runs.

---

# Backend Installation

## Prerequisites

Install the following:

- Java 21
- MySQL
- Maven (optional because Maven Wrapper is included)
- Git

## 1. Clone the repository

```bash
git clone https://github.com/sreeieaswar/service-appointment-booking-system.git
```

## 2. Navigate to the backend

```bash
cd service-appointment-booking-system/Backend - Springboot/service-booking
```

## 3. Configure MySQL

Create the database:

```sql
CREATE DATABASE service_booking;
```

Configure:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET
```

as environment variables.

## 4. Run the backend

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Or, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend REST API runs on the configured Spring Boot server port.

---

# Frontend Installation

## Prerequisites

Install:

- Node.js
- npm
- Git

## 1. Navigate to the frontend

From the repository root:

```bash
cd "Frontend - React/servicebooking"
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start the React application

```bash
npm start
```

The React development server will start on its configured development port.

Make sure the Spring Boot backend is also running so that frontend API requests can be processed.

---

# API Endpoint Documentation

The backend provides REST APIs for authentication, service categories, services, staff, appointments, and reviews.

> **Note:** Protected endpoints require a valid JWT token in the `Authorization` header unless the endpoint is explicitly public.

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a customer |
| POST | `/login` | Authenticate a user and receive JWT |

Example authentication header for protected requests:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Service Categories

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/service-categories` | View service categories |
| POST | `/service-categories` | Create a category |
| PUT | `/service-categories/{id}` | Update a category |
| DELETE | `/service-categories/{id}` | Delete a category |

## Services

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/services` | View services |
| GET | `/services/{id}` | View service details |
| POST | `/services` | Create a service |
| PUT | `/services/{id}` | Update a service |
| DELETE | `/services/{id}` | Delete a service |

## Staff

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/staff` | View staff |
| GET | `/staff/{id}` | View staff details |
| POST | `/staff` | Create staff |
| PUT | `/staff/{id}` | Update staff |
| DELETE | `/staff/{id}` | Delete staff |

## Appointments

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/appointments` | Book an appointment |
| GET | `/appointments` | Retrieve appointments |
| GET | `/appointments/{id}` | View appointment details |
| PUT | `/appointments/{id}/reschedule` | Reschedule an appointment |
| PUT | `/appointments/{id}/cancel` | Cancel an appointment |
| PUT | `/appointments/{id}/assign-staff` | Assign staff |
| PUT | `/appointments/{id}/status` | Update appointment status |

## Reviews

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/reviews` | Submit a review |
| GET | `/reviews` | View reviews |
| GET | `/reviews/service/{serviceId}` | View reviews for a service |

> Endpoint paths above reflect the implemented module structure and should be checked against the controller mappings if the API base paths are changed in a future version.

---

# Default Admin Login Credentials

The application supports the **ADMIN** role.

For security, actual production credentials should never be committed to a public GitHub repository.

If an admin account is already configured in the local database, use that configured account:

```text
Role: ADMIN
Email: <configured admin email>
Password: <configured admin password>
```

For a fresh installation, create/configure the admin account according to the application's user/role setup before accessing admin-protected functionality.

---

# Authentication & Authorization

The application uses JWT-based authentication.

The general authentication flow is:

```text
User Login
    │
    ▼
Spring Boot Authentication
    │
    ▼
JWT Token Generated
    │
    ▼
Frontend Stores/Uses Token
    │
    ▼
Protected API Request
    │
    ▼
JWT Authentication Filter
    │
    ▼
Role-Based Authorization
    │
    ▼
Controller / API
```

Frontend protected pages use authentication checks so unauthenticated users cannot proceed to protected application features.

---

# Known Limitations

- The application is currently intended primarily as a development/project implementation rather than a production deployment.
- Database credentials and JWT configuration must be supplied through environment variables when running locally.
- No production cloud database configuration is included by default.
- The default development setup uses Hibernate `ddl-auto=update`.
- The application does not include a production-grade deployment configuration in this repository.
- Notification integrations such as SMS, WhatsApp, or email are not part of the current system.
- Admin credentials should be configured securely rather than stored in the repository.

---

# Future Improvements

Possible future improvements include:

- Production deployment configuration
- Cloud database integration
- Improved centralized configuration management
- Automated CI/CD pipeline
- Automated API and integration test coverage
- Enhanced reporting and analytics
- Additional appointment scheduling capabilities

---

# License

This project is currently maintained as a personal/academic full-stack development project.

---

## Author

**Sreei Easwar**

GitHub: https://github.com/sreeieaswar
