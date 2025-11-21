# Polygons Canvas Assignment

A full-stack application for managing and visualizing polygons on a canvas. The backend provides a REST API for polygon CRUD operations(except update), while the frontend offers an interactive canvas interface.

## Prerequisites

- **Node.js** (v18 or higher, v22.12.0 recommended)
- **npm** (comes with Node.js)

## Project Structure

```
polygons-canvas-assignment/
├── backend/          # Express.js API server (TypeScript)
├── frontend/         # React application (Vite)
└── README.md         # This file
```

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3001`

4. **Run tests:**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173` (or another port if 5173 is busy)

## Running Both Services - Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## API Endpoints

The backend provides the following endpoints:

- `GET /polygons` - Retrieve all polygons
- `POST /polygons` - Create a new polygon
- `DELETE /polygons/:id` - Delete a polygon by ID

**Base URL:** `http://localhost:3001`

## Data Storage

The backend uses **file-based storage** for persistence:

- **Storage Location:** `backend/src/data/polygons.json`
- **Persistence:** All polygon data is saved to disk and persists across server restarts
- **Format:** JSON file containing an array of polygon objects
- **Consistency:** Data remains consistent between server restarts - any polygons created or deleted will be preserved

**Note:** The data file is automatically created if it doesn't exist. The file is read and written synchronously for each API operation, ensuring data consistency.

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server (requires build first)
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Frontend

The frontend uses the following environment variable (optional):

- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:3001`)

Create a `.env` file in the `frontend` directory if you need to override the default:

```
VITE_API_URL=http://localhost:3001
```

## Testing

### Backend Tests

The backend includes comprehensive test coverage:

- **Unit Tests:** Controllers, Services, Utils
- **Integration Tests:** Routes

Run all tests:
```bash
cd backend
npm test
```

## Troubleshooting

### Port Already in Use

If port 3001 (backend) or 5173 (frontend) is already in use:

- **Backend:** Change `PORT` in `backend/src/server.ts`
- **Frontend:** Vite will automatically use the next available port

### Node Version Issues

If you encounter Node version compatibility issues:

1. Use `nvm` (Node Version Manager) to switch versions:
   ```bash
   nvm use 22.12.0
   ```

2. Set as default:
   ```bash
   nvm alias default 22.12.0
   ```

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## License

ISC

