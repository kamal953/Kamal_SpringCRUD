# Spring CRUD Full-Stack

This repo contains a Spring Boot backend (JDBC CRUD) and a React frontend.

## Structure

- backend/ - Spring Boot JDBC API
- frontend/ - React UI (Vite)

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL

## Backend Setup

Create the database:

```sql
CREATE DATABASE studentdb;
```

Update DB credentials if needed:

- backend/src/main/resources/application.properties

Run the backend:

```bash
cd backend
mvn spring-boot:run
```

The API runs at:

- http://localhost:8080/students

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at:

- http://localhost:5173

The frontend expects the backend at `http://localhost:8080`. Override with:

```bash
# frontend/.env
VITE_API_BASE=http://localhost:8080
```

## API Endpoints

- POST /students
- GET /students
- GET /students/{id}
- PUT /students/{id}
- DELETE /students/{id}
