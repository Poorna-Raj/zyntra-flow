# 📊 Sales Forecasting System (Supabase Project)

## 📌 Project Overview

This project is a Sales Forecasting Database System built using Supabase (PostgreSQL).  
It transforms raw CSV sales data into a **normalized relational database** using a **star schema design**.

The system is designed to support:
- Sales prediction analysis
- Data-driven decision making
- Scalable analytics structure

---

## 🛠️ Technologies Used

- Supabase (PostgreSQL Database)
- SQL (Database Design)
- Mermaid.js (ER Diagram)
- Git & GitHub (Version Control)

---

## 📂 Dataset Structure (CSV Input)

The original dataset includes:
week_number, month, province, product_name, category, avg_temperature_level, rainfall_level, tourism_level, payday_week, holiday_type, festival_season, school_season, urbanization_level, avg_income_level, demand_score, estimated_units_sold

---

## 🏗️ Database Design

The CSV is normalized into a **Star Schema**:

### 🟦 Dimension Tables
- province
- product
- time_dimension
- season_info
- context_dimension
- user_profiles (Supabase Auth extension)

### 🟨 Fact Table
- sales_forecast

---

## 🗃️ Folder Structure
docs/ database/ er-diagram.md

---

## 🧠 Key Features

- Fully normalized relational database design
- Foreign key relationships for data integrity
- Role-based user authentication (Supabase Auth)
- Indexed tables for faster queries
- Scalable structure for analytics and forecasting

---

## 🔐 Authentication

This project uses **Supabase built-in authentication**.

A custom user profile table is linked to:
- `auth.users`

Roles supported:
- admin
- analyst
- user

---

## 📊 ER Diagram

The database relationship diagram is created using **Mermaid.js**.

📍 Location:
docs/database/er-diagram.md

---

## 🚀 Setup Instructions

### 1. Create Supabase Project
- Go to https://supabase.com/dashboard
- Create a new project

### 2. Create Tables
Run SQL scripts in Supabase SQL Editor:
- dimension tables
- fact table
- user_profiles

### 3. Enable Authentication
Use Supabase Auth for user management.

### 4. Insert Data
Insert CSV data into dimension tables and fact table.

---

## 📈 Example Use Cases

- Predict product demand trends
- Analyze seasonal sales behavior
- Understand regional sales performance
- Support business decision making

---

## 📌 Project Outcome

This project demonstrates:
- Database normalization
- Star schema design
- Real-world analytics structure
- Supabase backend integration

---

## 👨‍💻 Author

Kusal Adithya
Backend Engineer

---

## 📎 Notes

- Ensure foreign key relationships are correctly maintained
- Use indexes for frequently queried columns
- Keep Supabase project credentials secure