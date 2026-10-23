
-- Select the database
USE ecommerce_db;

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

-- View orders with customer details
SELECT
    o.order_id,
    o.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    c.email,
    c.phone,
    o.total_amount,
    o.payment_method,
    o.payment_status,
    o.order_status,
    o.order_date
FROM orders AS o
INNER JOIN customers AS c
    ON o.customer_id = c.customer_id;

-- Update an order status
UPDATE orders
SET order_status = 'DELIVERED'
WHERE order_id = 2;

-- Find orders with pending payments
SELECT *
FROM orders
WHERE payment_status = 'PENDING';

-- Find all orders for a specific customer
SELECT *
FROM orders
WHERE customer_id = 1;
