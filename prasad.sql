
-- Select database
USE ecommerce_db;

-- Create orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM(
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'PENDING',
    order_status ENUM(
        'PLACED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ) DEFAULT 'PLACED',
    shipping_address VARCHAR(500) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT
);

-- Insert sample orders
INSERT INTO orders (
    customer_id,
    total_amount,
    payment_method,
    payment_status,
    order_status,
    shipping_address,
    city,
    state,
    postal_code
) VALUES
(
    1, 2499.00, 'UPI', 'PAID', 'DELIVERED',
    'MG Road', 'Pune', 'Maharashtra', '411001'
),
(
    2, 1599.50, 'Credit Card', 'PAID', 'SHIPPED',
    'Andheri West', 'Mumbai', 'Maharashtra', '400001'
),
(
    3, 799.00, 'Cash on Delivery', 'PENDING', 'PLACED',
    'College Road', 'Nashik', 'Maharashtra', '422001'
);

-- View all orders
SELECT * FROM orders;

-- View orders with customer names
SELECT
    o.order_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    c.email,
    o.total_amount,
    o.payment_status,
    o.order_status,
    o.order_date
FROM orders o
JOIN customers c
    ON o.customer_id = c.customer_id;

-- Update order status
UPDATE orders
SET order_status = 'DELIVERED'
WHERE order_id = 2;

-- Find pending payments
SELECT *
FROM orders
WHERE payment_status = 'PENDING';
