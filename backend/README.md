# Student JDBC CRUD Spring Boot App

This project is a Spring Boot application that uses JDBC (JdbcTemplate) with PostgreSQL to perform CRUD operations on a single `students` table.

## Functional Coverage

- Entity: Student (id, name, email, course)
- Database setup using `schema.sql`
- JDBC-based CRUD (manual SQL, no ORM)
- Layered architecture:
  - Controller
  - Service
  - Repository
- REST endpoints:
  - POST /students
  - GET /students
  - GET /students/{id}
  - PUT /students/{id}
  - DELETE /students/{id}

## Prerequisites

- Java 17+
- Maven 3.9+
- PostgreSQL running locally

## Database Setup

Create database:

```sql
CREATE DATABASE studentdb;
```

Table creation is handled by `src/main/resources/schema.sql` at app startup.

Update DB credentials in `src/main/resources/application.properties` if needed.

## Run

```bash
mvn spring-boot:run
```

The app runs at:

- http://localhost:8080

## API Examples

Create student:

```bash
curl -X POST http://localhost:8080/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","course":"Math"}'
```

Get all:

```bash
curl http://localhost:8080/students
```

Get by id:

```bash
curl http://localhost:8080/students/1
```

Update:

```bash
curl -X PUT http://localhost:8080/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated","email":"alice.updated@example.com","course":"Physics"}'
```

Delete:

```bash
curl -X DELETE http://localhost:8080/students/1
```
