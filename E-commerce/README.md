# E-Commerce Backend

## Introduction

Welcome to the E-Commerce Backend project! This application is built using the MERN stack, which consists of MongoDB, Express.js, React.js, and Node.js. The backend serves as the server-side component of an e-commerce platform, providing RESTful APIs for managing products, users, orders, and much more.

### Features

- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing and management
- Payment integration (e.g., Razorpay)
- Admin dashboard for managing products and orders
- Responsive and scalable architecture

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [Other](#Other)

## Technologies Used

- **MongoDB**: NoSQL database for storing data.
- **Express.js**: Web framework for Node.js. It is used at backend side to creating many RESTful API's and server.
- **Node.js**: JavaScript runtime environment for server-side development.
- **Mongoose**: ODM ( Object Data Modeling ) for MongoDB and Node.js. And Mongoose is used for creating Database schema and model's of database.
- **JWT**: JSON Web Tokens for user authentication
- **Bcrypt**: Library for hashing passwords
- **Razorpay**: Payment processing service
- **Cloudinary**: I used Cloudinary to store pictures of users, products and other.
- **Nodemailer**: For sending emails (e.g., order confirmations,email verification and other)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/javed-shekh777/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up your MongoDB database. You can use MongoDB Atlas or a local MongoDB instance.

4. Create a .env file in the root directory and add the following environment variables:

   ```bash

   # Your MongoDB Database name and url
   DB_NAME = e-commerce
   MONGODB_URI = mongodb://localhost:27017

   # Frontend URL
   CROSS_ORIGIN = *

   # Server Port
   PORT = 8080

   # Secret Tokens
   SECRET_TOKEN = ABCDEFGHIJK
   SECRET_TOKEN_EXPIRY = 10d

   # Google App passsword email and password
   AUTH_EMAIL =text@gmail.com
   AUTH_KEY = 1234 1234 1234 1234

   # From Cloudinary
   CLOUD_NAME = john-seth
   CLOUD_API_KEY = 12345678912345
   CLOUD_API_SECRET = fdsfmdskndskfndsf

   ```

## Usage

1. Start the server

   ```bash
   npm run dev
   ```

2. Use tools like Postman or Insomnia to test the API endpoints.

## API Documentation

### Authentication

- POST `/api/v1/auth/user/register` : Register a new user
- POST `/api/v1/auth/user/login` : Log in an existing user
- POST `/api/v1/auth/user/logout` : Log out the user
- POST `/api/v1/auth/user/forget-password` : Log out the user
- POST `/api/v1/auth/user/reset-password` : Log out the user
- PATCH `/api/v1/auth/user/update-user/:id` : Log out the user
- GET `/api/v1/auth/user/get-user/:id` : Log out the user
- GET `/api/v1/auth/user/get-all-user` : Log out the user
- DELETE `/api/v1/auth/user/delete-user/:id` : Log out the user

### Products

- GET `/api/v1/products` : Get all products
- GET `/api/v1/products/:id` : Get a product by ID
- POST `/api/v1/products` : Create a new product (Admin only)
- PATCH `/api/v1/products/:id` : Update a product (Admin only)
- DELETE `/api/v1/products/:id` : Delete a product (Admin only)

## Environment Variables

#### Make sure to set the following environment variables in your .env file:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for signing JWT tokens
- `RAZORPAY_SECRET_KEY` : Your Stripe secret key
- `NODE_ENV` : Set to development or production

## Testing

#### Note please first choose Tester (Mocha,jasmine..etc) then install and also write command for test

To run tests, use the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Please follow these steps:

- Fork the repository
- Create a new branch (git checkout -b feature/YourFeature)
- Make your changes and commit them (git commit -m 'Add some feature')
- Push to the branch (git push origin feature/YourFeature)
- Open a pull request.

## Other

#### 1. Some used HTTP Methods

- `POST` : Used for send data to server fo crucial security reason.
- `GET` : Used for normally get the details etc.
- `PATCH` : Used to update.
- `DELETE` : Used to delete.

#### 2. Used HTTP Codes

- `400` : For Missing fields in request.
- `401` : For Unauthorized request.
- `403` : For Forbidden (user is not admin) response.
- `404` : For Data is missing in Database (e.g. User not found).
- `409` : For Data already exist (e.g. User already exist).
- `200` : For Successfull response.
- `500` : Internal Server error.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

---

# 💞❤️🥰 Thanks 🥰❤️💞

Thank you for checking out the E-Commerce Backend project! If you have any questions or suggestions, feel free to reach out.

## Connect with Us

<div style="border: 1px solid #ccc; padding: 10px; display: flex;align-items:center;justify-content:space-evenly; border-radius: 5px; text-align: center;">
    <a style="border-right:1px solid #fff;padding-right:10px;margin-top:5px;" href="https://github.com/Javed-Shekh777">
        <img src="https://img.shields.io/badge/GitHub-000000?style=flat&logo=github&logoColor=white" alt="GitHub">
    </a>&nbsp;&nbsp;
    <a style="border-right:1px solid #fff;padding-right:10px;margin-top:5px;" 
    href="https://instagram.com/javedshekh6943">
        <img src="https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram">
    </a>&nbsp;&nbsp;
    <a style="border-right:1px solid #fff;padding-right:10px;margin-top:5px;" 
    href="https://www.linkedin.com/in/md-javed-shekh/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn">
    </a>
</div>
