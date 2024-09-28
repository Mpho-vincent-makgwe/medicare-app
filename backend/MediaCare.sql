CREATE DATABASE medicare_db;

USE medicare_db;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255),
    seller VARCHAR(255),  -- Added seller field
    image_url VARCHAR(255)
);



INSERT INTO products (`id`,`name`,`description`,`price`,`category`,`seller`,`image_url`) VALUES 
(1,'Blood Pressure Monitor','A device used to monitor blood pressure at home.',75.00,'Medical Devices','HealthTech Inc.','https://th.bing.com/th/id/OIP.dmWkWHYN30YoXmimjw6rygHaFi?rs=1&pid=ImgDetMain'),
(2,'Glucose Meter','A compact device for checking blood sugar levels.',40.00,'Medical Devices','Diabetes Care Co.','https://th.bing.com/th/id/OIP.Bmq6omhfLBH_u078tqOVaAHaJX?rs=1&pid=ImgDetMain'),
(3,'Pulse Oximeter','A small device to measure oxygen levels in blood.',25.00,'Medical Devices','OxyCheck Ltd.','https://th.bing.com/th/id/OIP.SsojmXavW5_34dRMEY22-QHaHa?rs=1&pid=ImgDetMain'),
(4,'Wheelchair','Lightweight, foldable wheelchair for mobility assistance.',150.00,'Mobility Aids','Mobility Solutions','https://th.bing.com/th/id/R.2a3d5ea18496785ed9ebdf86fc680f93?rik=QEj404U8qEEh%2fA&pid=ImgRaw&r=0'),
(5,'CPAP Machine','A device used to treat sleep apnea by providing continuous air pressure.',500.00,'Respiratory Devices','SleepWell Devices','https://th.bing.com/th/id/R.0652a5c30383b5a9f64aebfa89d78937?rik=URYqB5MA2V6nVw&pid=ImgRaw&r=0'),
(6,'Walking Cane','Adjustable cane for walking support.',20.00,'Mobility Aids','Supportive Gear','https://th.bing.com/th/id/OIP.UAU0KNDcLg1zAt0gpq27hQHaHO?rs=1&pid=ImgDetMain'),
(7,'Shower Chair','Chair designed to provide support in the shower for elderly or disabled individuals.',60.00,'Home Safety','Safe Home Products','https://th.bing.com/th/id/OIP.ZpaXPE3KxQNswj6XKiHlLwHaHa?rs=1&pid=ImgDetMain'),
(8,'Hearing Aid','Behind-the-ear hearing aid to improve sound perception.',250.00,'Hearing Aids','Auditory Solutions','https://th.bing.com/th/id/OIP.6feiTC-x9zzrrFhVAZyfuwHaEK?rs=1&pid=ImgDetMain'),
(9,'Compression Socks','Socks designed to improve circulation and reduce swelling in legs.',30.00,'Health & Wellness','Circulation Care Co.','https://th.bing.com/th/id/OIP.UCEn-uyqBkuQcJiK2cWE3gHaFG?w=3871&h=2665&rs=1&pid=ImgDetMain'),
(10,'Medical Alert System','Emergency alert system with GPS tracking for seniors.',200.00,'Safety Devices','Senior Alert Systems','https://th.bing.com/th/id/OIP.rjWBYNPtR3iwbS11rXzfywHaGM?rs=1&pid=ImgDetMain');

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_price DECIMAL(10, 2) NOT NULL,
    product_category VARCHAR(255),
    product_image_url VARCHAR(10000),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

