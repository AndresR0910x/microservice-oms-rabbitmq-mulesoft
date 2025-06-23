# Order Management System (OMS) with RabbitMQ and MuleSoft

This project is a scalable and modular **Order Management System (OMS)** designed for **mass consumption businesses**. It demonstrates the integration of **RabbitMQ** as a messaging broker and **MuleSoft** as the middleware platform for connecting and orchestrating services.

## 🔧 Technologies Used

- **MuleSoft Anypoint Platform** – For API integration and orchestration
- **RabbitMQ** – Message broker to enable asynchronous communication
- **Java / Spring Boot** *(optional or depending on your stack)* – For backend services
- **Docker** – For containerized deployment
- **PostgreSQL / MySQL** – As the database for order persistence

## 🚀 Key Features

- Order creation, processing, and status tracking
- Event-driven architecture using RabbitMQ
- Reliable and decoupled service communication
- Scalable integration flows with MuleSoft
- Ready for deployment in microservices environments

## 📦 Use Cases

- Retail and wholesale order management
- Real-time integration with ERP or inventory systems
- Distributed order processing for high-demand systems

## 📁 Structure

```bash
/order-api/           # API endpoints for order management
/mule-integration/    # MuleSoft flows and configurations
/rabbitmq-config/     # RabbitMQ exchange/queue setup
/database/            # SQL scripts and DB schema
/docker/              # Docker Compose and container config
