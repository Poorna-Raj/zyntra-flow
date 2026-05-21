# StockIQ — Full System Architecture & Development Overview

## HND Software Engineering Final Project

---

# 1. Project Vision

StockIQ is an AI-powered inventory intelligence platform designed for Sri Lankan SMEs.

The system combines:

- A lightweight POS system
- Spring Boot microservices
- A machine learning forecasting engine
- Inventory intelligence and restock recommendations

The core goal of the system is:

> Predict future inventory demand using sales data.

---

# 2. Main System Idea

The system flow is:

```text
POS System
     ↓
Sales Data Collection
     ↓
Database Storage
     ↓
ML Forecasting Engine
     ↓
Future Sales Predictions
     ↓
Restock Recommendations
```

---

# 3. Recommended Technology Stack

| Component        | Technology                |
| ---------------- | ------------------------- |
| Frontend         | React                     |
| Backend          | Spring Boot Microservices |
| Database         | PostgreSQL                |
| ML Service       | FastAPI + Prophet         |
| Charts           | Recharts                  |
| Version Control  | GitHub                    |
| Containerization | Docker                    |
| Deployment       | Railway / Render          |
| CI/CD            | GitHub Actions            |

---

# 4. Why This Architecture?

The project uses two separate ecosystems:

## Spring Boot

Handles:

- POS operations
- Inventory management
- Product management
- Authentication
- Business logic

---

## FastAPI

Handles:

- Machine learning
- Forecast generation
- Model inference
- Prediction APIs

---

This architecture is good because:

- Clean separation of concerns
- Easier debugging
- Easier scaling
- Real enterprise architecture style
- Better portfolio value for internships

---

# 5. Simplified Microservice Architecture

The system should NOT become overly complex.

Avoid:

- Kafka
- Kubernetes
- RabbitMQ
- Service Mesh
- Distributed transactions

For HND level:

> Simple REST microservices are enough.

---

# 6. Recommended Services

| Service             | Responsibility              |
| ------------------- | --------------------------- |
| Auth Service        | Authentication and JWT      |
| Product Service     | Product management          |
| Sales Service       | Sales transactions          |
| Inventory Service   | Inventory and restock logic |
| Forecasting Service | ML predictions              |

---

# 7. High-Level System Architecture

```mermaid
flowchart LR
    A[React Dashboard] --> B[API Gateway]

    B --> C[Auth Service]
    B --> D[Sales Service]
    B --> E[Product Service]
    B --> F[Inventory Service]

    C --> G[(PostgreSQL)]
    D --> G
    E --> G
    F --> G

    D -->|batch nightly| H[Forecasting Service\nFastAPI + Prophet]
    H -->|predictions| F

    F --> I[Restock Alerts]

    H --> J[(ML Model Files)]
```

---

# 8. Forecasting Workflow

```mermaid
sequenceDiagram
    participant Scheduler
    participant SalesService
    participant Database
    participant MLService
    participant InventoryService

    Scheduler->>SalesService: Trigger nightly batch
    SalesService->>Database: Fetch last 90 days of sales
    Database-->>SalesService: Sales data per product

    SalesService->>MLService: Send historical data

    MLService->>MLService: Run Prophet per product
    MLService-->>Database: Store forecast results

    InventoryService->>Database: Read forecasts
    InventoryService->>InventoryService: Compare vs reorder level
    InventoryService-->>Database: Write restock alerts
```

---

# 9. Use Case Diagram

```mermaid
flowchart TB
    Cashier((Cashier))
    Owner((Owner))
    Admin((Admin))

    UC1[Login]
    UC2[Record sale]
    UC3[Search product / barcode]
    UC4[Process return or refund]
    UC5[View or print receipt]
    UC6[View inventory levels]

    UC7[View sales dashboard]
    UC8[View forecast graphs]
    UC9[View restock alerts]
    UC10[Upload CSV sales data]
    UC11[Approve restock orders]
    UC12[Set reorder thresholds]

    UC13[Manage users]
    UC14[Manage products]
    UC15[View audit logs]
    UC16[Generate reports]

    Cashier --> UC1
    Cashier --> UC2
    Cashier --> UC3
    Cashier --> UC4
    Cashier --> UC5
    Cashier --> UC6

    Owner --> UC1
    Owner --> UC7
    Owner --> UC8
    Owner --> UC9
    Owner --> UC10
    Owner --> UC11
    Owner --> UC12

    Admin --> UC1
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
```

---

# 10. Machine Learning Pipeline

```mermaid
flowchart LR
    A[Raw sales data] --> B[Data cleaning]
    B --> C[Aggregate by product]
    C --> D[Feature engineering]
    D --> E[Holiday injection\nAurudu / Vesak / Poya]
    E --> F[Train Prophet\nper product]
    F --> G[30-day forecast]
    G --> H[Compare vs reorder level]
    H --> I[Restock recommendation]
```

---

# 11. Dataset Structure

The ML model requires:

| ds         | y   |
| ---------- | --- |
| 2025-01-01 | 12  |
| 2025-01-02 | 15  |

Where:

- ds = date
- y = sales quantity

---

# 12. Feature Engineering

The forecasting model should learn:

| Feature       | Purpose                         |
| ------------- | ------------------------------- |
| Weekends      | Detect weekend spikes           |
| Payday cycles | Detect monthly demand increases |
| Aurudu        | Detect festive demand           |
| Vesak         | Seasonal behavior               |
| Weather       | Rain impact                     |

---

# 13. ML Workflow

```text
Sales Data
    ↓
Cleaning
    ↓
Feature Engineering
    ↓
Holiday Injection
    ↓
Train Prophet Model
    ↓
Generate Forecast
    ↓
Evaluate Accuracy
```

---

# 14. Database ER Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string password
        string role
    }
    PRODUCTS {
        int id PK
        string name
        string category
        int stock_quantity
        int reorder_level
    }
    SALES {
        int id PK
        int user_id FK
        date sale_date
        decimal total_amount
    }
    SALE_ITEMS {
        int id PK
        int sale_id FK
        int product_id FK
        int quantity_sold
        decimal unit_price
    }
    FORECASTS {
        int id PK
        int product_id FK
        int predicted_quantity
        date forecast_date
        date generated_on
    }
    RESTOCK_ALERTS {
        int id PK
        int product_id FK
        int suggested_quantity
        string status
        date created_at
    }

    USERS ||--o{ SALES : records
    SALES ||--|{ SALE_ITEMS : contains
    PRODUCTS ||--o{ SALE_ITEMS : included_in
    PRODUCTS ||--o{ FORECASTS : has
    PRODUCTS ||--o{ RESTOCK_ALERTS : triggers
```

---

# 15. Recommended Development Timeline

## Weeks 1–2

- Learn Prophet
- Create synthetic sales dataset
- Train first forecasting model
- Generate prediction graphs

---

## Weeks 3–4

- Build Spring Boot microservices
- Create PostgreSQL database
- Build REST APIs

---

## Weeks 5–6

- Export ML model through FastAPI
- Connect Spring Boot services with ML service

---

## Weeks 7–8

- Build React dashboard
- Create lightweight POS UI
- Display charts and alerts

---

## Weeks 9–10

- Dockerize services
- Deployment setup
- Basic CI/CD pipeline

---

# 16. Recommended Deployment Architecture

```mermaid
flowchart TB
    A[React Frontend\nVercel]
    B[API Gateway\nRailway]
    C[Spring Boot Services\nRailway]
    D[FastAPI ML Service\nRailway]
    E[(PostgreSQL\nRailway)]
    F[(ML Model Files\nVolume / S3)]

    A --> B
    B --> C
    C --> E
    C --> D
    D --> F
```

---

# 17. Important Technical Advice

The team should avoid:

- Complex distributed systems
- Kubernetes
- Event streaming
- Large-scale infrastructure
- Overengineering

The project should remain:

> Small, stable, modular, and fully functional.

---

# 18. Final Recommendation

The strongest part of this project is not the POS system.

The strongest part is:

> Sri Lankan inventory forecasting intelligence.

The POS system should only support:

- Sales recording
- Inventory updates
- Historical data collection

The forecasting engine should remain the core innovation of the project.

---

# 19. Final Goal

The ideal final demo should work like this:

```text
Cashier records sale
        ↓
Inventory updates
        ↓
Sales data stored
        ↓
ML model predicts future demand
        ↓
System recommends restocking
```

This demonstrates:

- Machine learning
- Forecasting
- Microservice architecture
- Inventory intelligence
- Data engineering
- Full-stack software engineering
- DevOps workflow understanding
