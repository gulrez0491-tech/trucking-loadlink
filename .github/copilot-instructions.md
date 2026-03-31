# Trucking LoadLink App - Workspace Instructions

## Overview
Full-stack trucking load management application with Docker containerization.

## Project Structure
- **Backend**: Node.js/Express API (port 5000)
- **Frontend**: React web application (port 3000)
- **Database**: MongoDB (port 27017)
- **Orchestration**: Docker Compose

## Quick Commands

### Start Everything
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Access Applications
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

### Stop Everything
```bash
docker-compose down
```

## Development Workflow

1. **Modify backend**: Changes auto-reflected in container
2. **Modify frontend**: Changes auto-reflected in browser
3. **Rebuild if needed**: `docker-compose build <service>`

## API Endpoints

**Loads**:
- GET /api/loads
- POST /api/loads
- GET /api/loads/:id
- PUT /api/loads/:id
- DELETE /api/loads/:id

**Drivers**:
- GET /api/drivers
- POST /api/drivers

**Health**:
- GET /api/health

