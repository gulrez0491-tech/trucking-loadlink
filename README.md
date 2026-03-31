# 🚛 Trucking LoadLink App

A full-stack application for managing trucking loads and drivers. Built with Node.js/Express backend, React frontend, and Docker.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- (Optional) Node.js 18+ and npm for local development

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Once running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## 📁 Project Structure

```
trucking/
├── backend/              # Express.js API server
│   ├── server.js        # Main server file
│   ├── package.json     # Dependencies
│   ├── Dockerfile       # Backend container
│   └── .env            # Environment variables
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.js      # Main app component
│   │   ├── App.css     # Styles
│   │   └── index.js    # Entry point
│   ├── public/
│   │   └── index.html  # HTML template
│   ├── package.json    # Dependencies
│   └── Dockerfile      # Frontend container
├── docker-compose.yml  # Docker orchestration
└── README.md          # This file
```

## 🛠️ Local Development Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs on `http://localhost:3000`

## 📚 API Endpoints

### Loads

- `GET /api/loads` - Get all loads
- `POST /api/loads` - Create new load
- `GET /api/loads/:id` - Get load details
- `PUT /api/loads/:id` - Update load
- `DELETE /api/loads/:id` - Delete load

### Drivers

- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create new driver

### Health Check

- `GET /api/health` - Check backend status

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Execute command in container
docker-compose exec backend npm install
docker-compose exec frontend npm install

# Remove all data
docker-compose down -v
```

## ⚙️ Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/trucking-loadlink
```

### Frontend

- `REACT_APP_API_URL=http://localhost:5000` (set in docker-compose.yml)

## 📦 Database

MongoDB is included in docker-compose.yml:

- Image: mongo:6.0-alpine
- Port: 27017
- Data persisted in named volume `mongo-data`

## 🔄 Development Workflow

1. **Modify code** in `backend/` or `frontend/`
2. **Rebuild specific service**:
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```
3. **View logs** to debug:
   ```bash
   docker-compose logs -f
   ```

## 🐛 Troubleshooting

### Ports already in use

```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Clear Docker cache

```bash
docker system prune -a
docker volume prune
```

### MongoDB connection issues

```bash
# Check MongoDB logs
docker-compose logs mongo

# Verify connection
docker-compose exec mongo mongosh
```

## 📝 Features

- ✅ Create and manage trucking loads
- ✅ View available loads and drivers
- ✅ Clean, responsive UI
- ✅ Real-time API integration
- ✅ Docker containerization
- ✅ Database persistence

## 🎯 Future Enhancements

- Authentication & authorization
- Payment processing
- GPS tracking
- Push notifications
- Advanced search/filtering
- Analytics dashboard
- Mobile app

## 📄 License

MIT License
