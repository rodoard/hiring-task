# Hiring Task Backend

## Project Overview
A robust backend service for the Hiring Task Todo application, providing RESTful API endpoints for authentication and todo management.

## Tech Stack
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL (Production/Development), SQLite3 (Testing)
- **ORM**: TypeORM
- **Authentication**: JSON Web Tokens (JWT)

## Features
- User Registration
- User Authentication
- Todo CRUD Operations
- Secure API Endpoints
- Input Validation

## Project Structure
```
backend/
├── src/
│   ├── entities/     # TypeORM database entities
│   ├── controllers/  # Route handlers
│   ├── middleware/  # Express middleware
│   ├── models/      # Data models
│   ├── routes/      # API route definitions
│   ├── services/    # Business logic
│   └── utils/       # Utility functions
```

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL database
- SQLite3 (for testing)

## Environment Configuration

### .env File
Create a `.env` file in the project root with the following configuration:

```
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=hiring_task_db

# Testing Database
TEST_DB_TYPE=sqlite
TEST_DB_PATH=./test.sqlite

# Authentication
JWT_SECRET=your_secret_key
PORT=8000
```

- `DB_TYPE`: MySQL database type
- `DB_HOST`: MySQL host
- `DB_PORT`: MySQL port
- `DB_USERNAME`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_DATABASE`: MySQL database name
- `TEST_DB_TYPE`: SQLite3 database type
- `TEST_DB_PATH`: SQLite3 database path
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port number

## Installation

1. Clone the repository
2. Install dependencies
```bash
cd hiring-task
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register`: User registration
- `POST /api/v1/auth/login`: User login

### Todos
- `GET /api/v1/todos`: List todos
- `POST /api/v1/todos`: Create todo
- `PUT /api/v1/todos/:id`: Update todo
- `DELETE /api/v1/todos/:id`: Delete todo

## Testing
```bash
npm test
```

## Security Features
- Password hashing
- JWT-based authentication
- Input validation
- Error handling

## Future Improvements
- Implement refresh tokens
- Implement rate limiting

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
