# E-commerce API Project

This project is a Node.js and Express-based API server designed for e-commerce applications. It provides a set of essential APIs required to manage an e-commerce platform, including product management, user management, order processing, and more. The project is built with a focus on clean, scalable code following best practices in software development.

## Features

- **RESTful API Design:** Structured and consistent endpoints for easy integration.
- **MongoDB Integration:** Using Mongoose for data modeling, with a robust schema design.
- **CRUD Operations:** Basic Create, Read, Update, and Delete operations for key resources like products, users, and orders.
- **Error Handling:** Centralized error handling for consistent API responses.
- **Validation:** Input validation and sanitization to ensure data integrity.
- **Authentication:** Secure user authentication and authorization mechanisms.
- **Scalable Code Structure:** Modular and scalable code structure for easy maintenance and future enhancements.

## Developer Notes

### Naming Conventions

- **Snake Case for MongoDB Properties:** All property names in MongoDB collections are written in snake_case. This ensures consistency and clarity across the database schema.

- **Camel Case for Function Names:** All function names throughout the project are written in camelCase. This follows JavaScript conventions and improves readability.

### Project Structure

The project is organized into the following main sections:

- **`config/`**: Configuration files and environment settings.
- **`constants/`**: Constant variables used accross the entire project.
- **`controllers/`**: Contains the logic for handling requests and responses.
- **`helper/`**: Reusable helper functions for business logics.
- **`middlewares/`**: Includes reusable middleware functions. .
- **`models/`**: Defines the MongoDB schemas and models.
- **`routes/`**: Manages the API routes and middleware.
- **`uploads/`**: Contains file uploaded from client side.
- **`utils/`**: Contains utility functions and helper methods.

### Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/trisers/ecommerce-node-apis.git
   ```

2. Install dependencies:

   ```bash
   cd ecommerce-node-apis
   npm install
   ```

3. Set up environment variables:

   Create a .env file in the root directory and configure the necessary environment variables, such as database connection strings, API keys, etc as example file given in project root directory.

4. Start the server:

   ```bash
   npm start
   ```

### Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

### License

This project is licensed under the [MIT License](LICENSE).
