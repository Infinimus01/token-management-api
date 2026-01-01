# Token Management System API

A production-ready token management API built with Next.js, TypeScript, DOCKER and Redis.
This project provides a secure, reliable backend API for creating, managing, and validating temporary access tokens. It is built using modern TypeScript, Next.js, and uses Redis for high-speed storage.


## Features

- ✅ RESTful API for token management
- ✅ TypeScript with strict typing
- ✅ Redis for fast, expiring token storage
- ✅ Input validation using Zod
- ✅ API key authentication
- ✅ Docker & Docker Compose setup
- ✅ Unit tests with Jest
- ✅ Clean, responsive frontend UI
- ✅ Modular, scalable architecture

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Redis
- **Validation**: Zod
- **Testing**: Jest
- **Containerization**: Docker




### Quick Start (How to Run the Project)

The entire application, including the API server and the Redis database, is pre-configured to run instantly using Docker.

### Prerequisites

You need Docker and Docker Compose installed on your system, and the Docker Desktop application must be running before executing any docker-compose commands.

## Setup & Run : 

# 1. Unzip the folder
# 2. Open terminal and run:

cd token-management-system
docker-compose up --build -d




This command starts two services: the API server on http://localhost:3000 and the connected Redis database.

## 3. Check the Status

Wait about 30 seconds for the application to fully start, then check the status:

docker-compose ps


---
This command checks the running status of the API and Redis containers.
Both the app and redis services should show a status of Up.

## 🛠️ API Usage (Testing the Endpoints)

📍 API Endpoints & cURL Examples: 

## 1️⃣ Create a New Token: 

curl -X POST http://localhost:3000/api/tokens \
  -H "x-api-key: dev-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{"userId": "alice", "scopes": ["read"], "expiresInMinutes": 30}'


## Example Response

{
  "id": "token_abc123",
  "userId": "alice",
  "scopes": ["read"],
  "createdAt": "2025-01-01T10:00:00.000Z",
  "expiresAt": "2025-01-01T10:30:00.000Z",
  "token": "9f0c2d6a3b..."
}

## 2️⃣ Validate a Token

curl "http://localhost:3000/api/tokens?userId=alice&token=TOKEN_HERE" \
  -H "x-api-key: dev-api-key-12345"

## 3️⃣ List All Active Tokens for a User

curl "http://localhost:3000/api/tokens?userId=alice" \
  -H "x-api-key: dev-api-key-12345"

## 4️⃣ Validate an Invalid Token


curl "http://localhost:3000/api/tokens?userId=alice&token=BAD_TOKEN" \
  -H "x-api-key: dev-api-key-12345"

## 5️⃣ Tokens for Non-Existent User


curl "http://localhost:3000/api/tokens?userId=user123" \
  -H "x-api-key: dev-api-key-12345"


## Response:

[]



# Technical Choices & Overview

| Topic                 | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| Redis TTL             | Automatically removes expired tokens without cleanup scripts     |
| Integrated Validation | Token validation handled within `/api/tokens` using query params |
| Security              | Simple API key middleware to protect endpoints                   |
| Scalability           | Redis enables distributed token validation                       |


## Technology Stack: 

## Framework: 
Next.js (API Routes) with TypeScript.

## Database: 
Redis, chosen for its speed and native support for time-to-live (TTL) expiration, which is perfect for managing temporary tokens.

## Containerization: 
Docker Compose for easy deployment and setup isolation.

## Assumptions & Simplifications

## Validation Endpoint: 
We chose to integrate the validation logic into the existing /api/tokens endpoint using query parameters (userId and token), as this was the most stable path in the current configuration.

## API Key: 
Basic API key authentication via the x-api-key header was implemented as a security measure for all endpoints.

## Token Lifespan: 
Tokens are stored in Redis with an automatic expiration time based on the expiresInMinutes parameter.
