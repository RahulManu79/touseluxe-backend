# TousLux Backend - Quick Start Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (running locally on port 27017 or cloud instance)
3. **Firebase Project** with Admin SDK credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/touslux

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Firebase Service Account (see Firebase Setup below)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file
6. Convert the JSON to a single-line string and paste it in the `.env` file as `FIREBASE_SERVICE_ACCOUNT`

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application

**Development mode with hot-reload:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The server will start on http://localhost:3000

### 6. Access API Documentation

Once the server is running, open your browser and navigate to:

**Swagger UI:** http://localhost:3000/api

## Testing the API

### 1. Authentication Flow

#### a) Get Firebase ID Token (from your frontend/client)

```javascript
// Example using Firebase Client SDK
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();
```

#### b) Exchange Firebase Token for JWT

```bash
POST http://localhost:3000/auth/firebase
Content-Type: application/json

{
  "idToken": "YOUR_FIREBASE_ID_TOKEN_HERE"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "roles": ["user"]
  }
}
```

#### c) Use JWT Token for Protected Endpoints

Add the JWT token to the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 2. Example API Calls

#### Get All Products (Public)

```bash
GET http://localhost:3000/products
```

#### Create a Product (Admin Only)

```bash
POST http://localhost:3000/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Luxury Eau de Parfum",
  "slug": "luxury-eau-de-parfum",
  "description": "A sophisticated fragrance...",
  "price": 49.99,
  "sizeMl": 100,
  "images": ["https://example.com/image1.jpg"],
  "notes": [
    { "type": "top", "name": "Bergamot" },
    { "type": "heart", "name": "Rose" },
    { "type": "base", "name": "Sandalwood" }
  ],
  "mood": "Fresh and Energetic",
  "longevity": "6-8 hours",
  "projection": "Moderate"
}
```

#### Create a Review (Authenticated Users)

```bash
POST http://localhost:3000/reviews
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product": "PRODUCT_ID_HERE",
  "rating": 5,
  "comment": "Amazing fragrance! Long-lasting and unique."
}
```

#### Get Reviews for a Product (Public)

```bash
GET http://localhost:3000/reviews/by-product?productId=PRODUCT_ID_HERE
```

## API Endpoints Summary

### Authentication
- `POST /auth/firebase` - Get JWT token (Public)

### Users
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user by ID (Authenticated)
- `POST /users` - Create user (Admin)
- `PATCH /users/:id` - Update user (Authenticated)
- `DELETE /users/:id` - Delete user (Admin)

### Products
- `GET /products` - Get all products (Public)
- `GET /products/:id` - Get product by ID (Public)
- `GET /products/slug/:slug` - Get product by slug (Public)
- `GET /products/search?q=query` - Search products (Public)
- `POST /products` - Create product (Admin)
- `PATCH /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Comparisons
- `GET /comparisons` - Get all comparisons (Public)
- `GET /comparisons/:id` - Get comparison by ID (Public)
- `GET /comparisons/by-product?productId=id` - Get comparisons by product (Public)
- `POST /comparisons` - Create comparison (Admin)
- `PATCH /comparisons/:id` - Update comparison (Admin)
- `DELETE /comparisons/:id` - Delete comparison (Admin)

### Reviews
- `GET /reviews` - Get all reviews (Public)
- `GET /reviews/:id` - Get review by ID (Public)
- `GET /reviews/by-product?productId=id` - Get reviews by product (Public)
- `GET /reviews/by-user` - Get current user's reviews (Authenticated)
- `POST /reviews` - Create review (Authenticated)
- `PATCH /reviews/:id` - Update own review (Owner)
- `DELETE /reviews/:id` - Delete own review (Owner)

## Creating an Admin User

By default, all users created through Firebase authentication have the `["user"]` role. To create an admin user:

### Option 1: Directly in MongoDB

```javascript
// Connect to MongoDB
use touslux

// Update a user to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["user", "admin"] } }
)
```

### Option 2: Through the API (requires initial admin)

```bash
PATCH http://localhost:3000/users/USER_ID
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "roles": ["user", "admin"]
}
```

## Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── dto/                   # Data Transfer Objects
│   │   └── firebase-auth.dto.ts
│   ├── strategies/            # Passport strategies
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts     # Auth endpoints
│   ├── auth.service.ts        # Auth business logic
│   └── auth.module.ts         # Auth module definition
├── users/                     # Users module
│   ├── dto/                   # DTOs for users
│   ├── schemas/               # Mongoose schemas
│   ├── users.controller.ts    # User endpoints
│   ├── users.service.ts       # User business logic
│   └── users.module.ts        # User module definition
├── products/                  # Products module
├── comparisons/               # Comparisons module
├── reviews/                   # Reviews module
├── common/                    # Shared utilities
│   ├── guards/                # Auth and Role guards
│   ├── decorators/            # Custom decorators
│   └── interfaces/            # TypeScript interfaces
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

## Common Issues & Solutions

### Issue: "JWT_SECRET is not defined"
**Solution:** Make sure you have set `JWT_SECRET` in your `.env` file.

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Verify MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- If using MongoDB Atlas, ensure your IP is whitelisted

### Issue: "Firebase token verification failed"
**Solution:**
- Ensure `FIREBASE_SERVICE_ACCOUNT` is correctly formatted JSON
- Verify the service account has proper permissions
- Make sure the Firebase project ID matches

### Issue: "Forbidden" when accessing admin endpoints
**Solution:** The user's roles must include `"admin"`. Update the user document in MongoDB to add admin role.

## Development Tips

1. **Use Swagger UI** for testing: http://localhost:3000/api
2. **Check logs** for detailed error messages
3. **Use MongoDB Compass** for database inspection
4. **Enable debug mode** with `npm run start:debug`

## Next Steps

1. Configure CORS for your frontend domain (update `main.ts`)
2. Set up production MongoDB (MongoDB Atlas recommended)
3. Configure environment-specific settings
4. Set up CI/CD pipeline
5. Add rate limiting for production
6. Implement refresh tokens for better security

## Support

For issues or questions:
- Check the Swagger documentation at `/api`
- Review the code comments
- Check NestJS documentation: https://docs.nestjs.com/
