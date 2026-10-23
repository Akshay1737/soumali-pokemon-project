
-- Create database
CREATE DATABASE ecommerce_db;

USE ecommerce_db;

-- Create customers table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample customers
INSERT INTO customers (
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    city,
    state,
    postal_code,
    country
) VALUES
(
    'Rahul', 'Sharma',
    'rahul@example.com',
    '9876543210',
    'replace_with_password_hash',
    'Pune', 'Maharashtra', '411001', 'India'
),
(
    'Priya', 'Patil',
    'priya@example.com',
    '9876501234',
    'replace_with_password_hash',
    'Mumbai', 'Maharashtra', '400001', 'India'
),
(
    'Amit', 'Verma',
    'amit@example.com',
    '9123456780',
    'replace_with_password_hash',
    'Nashik', 'Maharashtra', '422001', 'India'
);

-- View all customers
SELECT
    customer_id,
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    created_at
FROM customers;

-- Find a customer by email
SELECT *
FROM customers
WHERE email = 'rahul@example.com';

-- Update customer address
UPDATE customers
SET address_line1 = 'MG Road',
    city = 'Pune',
    postal_code = '411001'
WHERE customer_id = 1;

-- Deactivate a customer
UPDATE customers
SET is_active = FALSE
WHERE customer_id = 2;
