# Hiring Task Frontend

## Project Overview
A modern, responsive Todo application built with React, TypeScript, and MobX for state management.

## Tech Stack
- **Framework**: React
- **Language**: TypeScript
- **State Management**: MobX
- **Styling**: Ant Design
- **Testing**: Jest, React Testing Library

## Features
- User Authentication (Login/Register)
- Todo Management (Create, Read, Update, Delete)
- Responsive Design
- Dark/Light Theme Toggle

## Project Structure
```
frontend/
├── src/
│   ├── api/           # API interaction modules
│   ├── components/    # Reusable React components
│   ├── models/        # TypeScript interfaces
│   ├── pages/         # Page components
│   ├── stores/        # MobX stores
│   └── utils/         # Utility functions
```

## Key Stores
### AuthStore
- Manages user authentication state
- Handles login, logout, and registration
- Securely stores authentication token

### TodoStore
- Manages todo items
- Provides methods for CRUD operations
- Integrates with backend API

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to frontend directory
3. Install dependencies
```bash
cd frontend
npm install
```

### Running the Application
```bash
npm start
```

### Running Tests
```bash
npm test
```

## Environment Configuration

The application uses environment variables to configure the backend API connection.

### .env File
Create a `.env` file in the project root with the following configuration:

```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

- `REACT_APP_API_URL`: Base URL for the backend API
- Ensure this matches your backend server's address and port

### Important Notes
- The `.env` file is not tracked by version control
- Always add `.env` to your `.gitignore`
- Provide a `.env.example` file with placeholder values for other developers

## Authentication Flow
1. User registers or logs in
2. Backend returns authentication token
3. Token stored in secure storage
4. MobX store manages authentication state

## Error Handling
- Comprehensive error handling in API calls
- User-friendly error messages

## Security Features
- Secure token storage
- Protected routes
- Client-side validation

## Performance Optimizations
- MobX for efficient state management
- Minimal re-renders with observer pattern

## Future Improvements
- Implement user profile management
- More comprehensive test coverage

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
