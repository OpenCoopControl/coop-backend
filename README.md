# OpenCoopControl API

A modern, scalable backend API for the OpenCoopControl project - an open-source platform for managing and controlling chicken coops and small agriculture automation systems.

## Description

[OpenCoopControl](https://github.com/OpenCoopControl) is an open-source automation solution for chicken coops and small agriculture. Building affordable hardware and user-friendly software, our project aims to make agricultural automation accessible to everyone.

This backend API is built on the [NestJS](https://github.com/nestjs/nest) framework, a progressive Node.js framework for building efficient and scalable server-side applications. It provides a robust API for device management, user authentication, and real-time communication with ESP32-based hardware controllers.

## Project Overview

OpenCoopControl consists of three main components:

1. **coop-backend** (this repository) - Server application that collects data from coop controllers, provides an API for the frontend, and manages historical data and automation rules.
2. **coop-controller** - ESP32-based hardware controller for automated chicken coop management. Handles door operations, feeding schedules, and environmental monitoring via sensors.
3. **coop-frontend** - Web interface for monitoring coop status and controlling functions remotely. Features responsive design for both desktop and mobile access.

## Features

- **RESTful API** with versioning (`/api/v1/`)
- **Real-time communication** using WebSockets for device status updates
- **User authentication** with JWT
- **Device management** for chicken coop controllers
- **API documentation** with Swagger
- **MongoDB integration** for data persistence
- **Docker support** for easy deployment

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (or Docker for containerized setup)
- Git

### Installation

```bash
# Clone the repository
$ git clone https://github.com/OpenCoopControl/coop-backend.git
$ cd coop-backend

# Install dependencies
$ npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
# MongoDB Configuration
MONGO_CONTAINER_NAME=mongodb
MONGO_PORT=27017
MONGO_USERNAME=coopuser
MONGO_PASSWORD=cooppassword
MONGO_DATABASE=coop-control
MONGO_EXPRESS_PORT=8081

# NestJS API Configuration
API_PORT=3000
JWT_SECRET=super-secure-jwt-secret-for-coop-control

# MongoDB Connection URI for NestJS
MONGODB_URI=mongodb://coopuser:cooppassword@localhost:27017/coop-control?authSource=admin
```

## Running the Application

### Development Mode

```bash
# Start MongoDB with Docker
$ docker-compose up -d

# Start the application in watch mode
$ npm run start:dev
```

### Production Mode

```bash
# Build the application
$ npm run build

# Start the application in production mode
$ npm run start:prod
```

## API Documentation

The API documentation is automatically generated with Swagger and can be accessed at:

```
http://localhost:3000/api-docs
```

The base URL for all API endpoints is:

```
http://localhost:3000/api/v1
```

## Testing

```bash
# Run unit tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Run test coverage
$ npm run test:cov
```

## Docker Deployment

You can deploy the entire application stack using Docker Compose:

```bash
# Start all services (MongoDB + API)
$ docker-compose up -d
```

## Project Structure

```
src/
├── auth/                 # Authentication module
├── common/               # Shared DTOs, interfaces, guards
├── devices/              # Device management module
├── users/                # User management module
├── websockets/           # WebSocket communication module
├── app.controller.ts     # App controller
├── app.module.ts         # App module
├── app.service.ts        # App service
└── main.ts               # Application entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is [MIT licensed](LICENSE).

## Stay in Touch

- GitHub Organization - [OpenCoopControl](https://github.com/OpenCoopControl)
- Website - [http://opencoopcontrol.org](http://opencoopcontrol.org)
- Contact - [pomazbcg@opencoopcontrol.org](mailto:pomazbcg@opencoopcontrol.org)
- Location - Serbia

---

<p align="center">🐔 Made with love in the beautiful Republic of Serbia 🇷🇸</p>

## Related Repositories

- [coop-controller](https://github.com/OpenCoopControl/coop-controller) - ESP32-based hardware controller for automated chicken coop management
- [coop-frontend](https://github.com/OpenCoopControl/coop-frontend) - Web interface for monitoring and controlling coop systems

## Acknowledgements

- [NestJS](https://nestjs.com/) - The framework used
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - WebSocket library
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- All contributors and supporters of affordable agricultural automation!

<p align="left">
  <img src="https://nestjs.com/img/logo-small.svg" width="21" alt="Nest Logo" />
</p>
