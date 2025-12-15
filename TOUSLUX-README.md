# TousLux Backend

Backend API for the TousLux perfume platform built with NestJS, MongoDB, and Firebase Authentication.

## Features

- 🔐 Firebase Authentication with JWT tokens
- 👥 User management with role-based access control
- 🧴 Product management (perfumes)
- 🔍 Product comparisons
- ⭐ Product reviews
- 📚 API documentation with Swagger
- ✅ Request validation with class-validator
- 🗄️ MongoDB with Mongoose ODM

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB + Mongoose
- **Authentication**: Firebase Admin SDK + JWT
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Guards**: JWT Auth Guard, Roles Guard

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Firebase project with Admin SDK credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd touslux-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - Set your MongoDB connection string
   - Set a secure JWT secret
   - Add your Firebase service account credentials

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

## API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api

## API Endpoints

### Authentication
- `POST /auth/firebase` - Authenticate with Firebase ID token

### Users (Admin only for most endpoints)
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (Admin)
- `PATCH /users/:id` - Update user
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
- `PATCH /reviews/:id` - Update own review (Owner only)
- `DELETE /reviews/:id` - Delete own review (Owner only)

## Data Models

### User
```typescript
{
  firebaseUid: string;
  email: string;
  name?: string;
  avatar?: string;
  roles: string[] // default: ["user"]
}
```

### Product
```typescript
{
  name: string;
  slug: string;
  description: string;
  price: number;
  sizeMl: number;
  images: string[];
  notes: { type: string; name: string }[];
  mood?: string;
  longevity?: string;
  projection?: string;
  inspiredFrom: Product[];
}
```

### Comparison
```typescript
{
  baseProduct: Product;
  inspiredProduct: Product;
  similarityScore?: number;
  differences: string[];
}
```

### Review
```typescript
{
  user: User;
  product: Product;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
```

## Authentication Flow

1. Client authenticates with Firebase and receives an ID token
2. Client sends ID token to `POST /auth/firebase`
3. Server verifies token with Firebase Admin SDK
4. Server creates/finds user in database
5. Server issues JWT token
6. Client uses JWT token for subsequent requests

## Role-Based Access Control

- **user**: Default role, can create reviews, view products
- **admin**: Can manage products, comparisons, and users

Use the `@Roles()` decorator to protect endpoints:
```typescript
@Roles('admin')
@Get()
findAll() {
  return this.productsService.findAll();
}
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/
│   ├── strategies/
│   └── auth.module.ts
├── users/               # Users module
│   ├── dto/
│   ├── schemas/
│   └── users.module.ts
├── products/            # Products module
│   ├── dto/
│   ├── schemas/
│   └── products.module.ts
├── comparisons/         # Comparisons module
│   ├── dto/
│   ├── schemas/
│   └── comparisons.module.ts
├── reviews/             # Reviews module
│   ├── dto/
│   ├── schemas/
│   └── reviews.module.ts
├── common/              # Shared utilities
│   ├── guards/
│   └── decorators/
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## Scripts

```bash
npm run start           # Start in production mode
npm run start:dev       # Start in development mode with watch
npm run start:debug     # Start in debug mode
npm run build           # Build for production
npm run lint            # Run ESLint
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development/production |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/touslux |
| JWT_SECRET | Secret for JWT signing | your-secret-key |
| FIREBASE_SERVICE_ACCOUNT | Firebase service account JSON | {...} |

## Firebase Setup

1. Go to Firebase Console
2. Select your project
3. Navigate to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the JSON content
6. Paste it as a single-line string in `FIREBASE_SERVICE_ACCOUNT` env variable

## License

MIT
