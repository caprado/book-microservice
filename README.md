# Online Book Store - Microservice

An online book store that provides services like user registration, book inventory, order handling, and reviewing/rating books.

## Tech Stack:

1. Backend: Node.js with gRPC
    - Why? Node.js is heavily used in the industry and it's JavaScript-based.
      
2. Microservices Communication: gRPC
    - Why? gRPC is a high-performance, open-source universal RPC framework which is gaining popularity in microservices communication.

3. Database: MongoDB and PostgreSQL
    - Why? MongoDB, a NoSQL database, is good for unstructured data. It can be used for user data and reviews. PostgreSQL, a relational database, can be used for structured data like book inventory and orders.

4. Frontend: React.js with Redux, MUI, and TypeScript
    - Why? React is widely used and very popular in the industry, good for creating dynamic UIs. Redux will helps manage our application's state.

5. Containerization: Docker
    - Why? Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. Each of our microservices can be a separate container.

6. Orchestration: Kubernetes
    - Why? Kubernetes is an open-source container-orchestration system for automating application deployment, scaling, and management.

7. API Gateway: Kong
    - Why? Kong is a widely used, scalable, open-source Microservice & API Gateway.

8. Authentication: JSON Web Tokens (JWT)
    - Why? JWT is a compact, URL-safe means of representing claims to be transferred between two parties.

9. CI/CD: Jenkins
    - Why? Jenkins is a free and open-source automation server. It helps automate the parts of software development related to building, testing, and deploying, facilitating continuous integration and continuous delivery.

## The project can be broken down into the following microservices:

1. **User service**: This microservice will handle all the user-related operations like user registration, user login, user profile details, etc.
2. **Book service**: This microservice will handle all the operations related to books. For example, adding new books, updating the details of the books, deleting the books, etc.
3. **Order service**: This microservice will handle the operations related to the orders. For example, placing a new order, canceling an order, updating the order details, etc.
4. **Review service**: This microservice will handle operations related to book reviews and ratings.

All these microservices are developed and deployed separately. They will communicate with each other using gRPC. For example, when a user places an order, the order service needs to communicate with the book service to update the inventory.

For the frontend, we create a nice interface using React.js. It will communicate with the backend services through an API Gateway (Kong), which will route requests to the appropriate services.

### **Frontend:**

- **React.js:**
    - Pages:
        - Registration/Login Page
        - User Profile Page
        - Books Listing Page
        - Single Book Page with Reviews
        - Order Page
    - Redux for state management
    - Axios for handling HTTP requests to the backend

### **API Gateway:**

- **Kong:**
    - Route incoming requests to the appropriate microservice

### **Containerization and Orchestration:**

- **Docker:**
    - Dockerfiles for each microservice
    - Build and runs the containers
- **Kubernetes:**
    - YAML configuration files for each service
    - Set up for deployment and services

### **Authentication:**

- **JWT:**
    - Generates and verifies JWT tokens with our User service
    - Protect routes in Book, Order, and Review service by verifying the JWT token with each request

### **CI/CD:**

- **Jenkins:**
    - Jenkins pipeline for CI/CD
    - Performs testing and building Docker images
    - Pushes Docker images to DockerHub or any other Docker Registry we have
    - Deploy's the app to Kubernetes
