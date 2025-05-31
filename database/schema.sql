-- Tạo CSDL nếu chưa có
CREATE DATABASE IF NOT EXISTS INTERNAL_INFORMATION_EXCHANGE_FORUM CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE INTERNAL_INFORMATION_EXCHANGE_FORUM;

-- Bảng users
CREATE TABLE if_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Bảng forums
CREATE TABLE if_forums (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    topic TEXT,
    password_hash VARCHAR(255) NOT NULL,
    created_by_user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_forums_users FOREIGN KEY (created_by_user_id)
        REFERENCES if_users(id) ON DELETE CASCADE
);

-- Bảng forum_members
CREATE TABLE if_forum_members (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    forum_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (forum_id, user_id),
    CONSTRAINT fk_forum_members_forums FOREIGN KEY (forum_id)
        REFERENCES if_forums(id) ON DELETE CASCADE,
    CONSTRAINT fk_forum_members_users FOREIGN KEY (user_id)
        REFERENCES if_users(id) ON DELETE CASCADE
);

-- Bảng messages
CREATE TABLE if_messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    forum_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    content_type ENUM('text', 'file') NOT NULL,
    content_text TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(512),
    file_size INT,
    file_mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_forums FOREIGN KEY (forum_id)
        REFERENCES if_forums(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_users FOREIGN KEY (user_id)
        REFERENCES if_users(id) ON DELETE CASCADE
);


