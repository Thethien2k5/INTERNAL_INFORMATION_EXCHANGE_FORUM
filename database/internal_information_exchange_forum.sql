-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 07, 2025 lúc 11:12 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `internal_information_exchange_forum`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_forums`
--

CREATE TABLE `if_forums` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `topic` text DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_by_user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_forum_members`
--

CREATE TABLE `if_forum_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `forum_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_messages`
--

CREATE TABLE `if_messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `forum_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `content_type` enum('text','file') NOT NULL,
  `content_text` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(512) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `file_mime_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_users`
--

CREATE TABLE `if_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `AvatarsUser` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_users`
--

INSERT INTO `if_users` (`id`, `username`, `email`, `password_hash`, `AvatarsUser`) VALUES
(4, 'thien123', 'thienobita0203@gmail.com', '$2b$10$GqTMT6nu3klQN6J2p4EhmekK5WUuqnUp.XiIftTZFbKlp4DN9MKBq', '');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `if_forums`
--
ALTER TABLE `if_forums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_forums_users` (`created_by_user_id`);

--
-- Chỉ mục cho bảng `if_forum_members`
--
ALTER TABLE `if_forum_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `forum_id` (`forum_id`,`user_id`),
  ADD KEY `fk_forum_members_users` (`user_id`);

--
-- Chỉ mục cho bảng `if_messages`
--
ALTER TABLE `if_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_messages_forums` (`forum_id`),
  ADD KEY `fk_messages_users` (`user_id`);

--
-- Chỉ mục cho bảng `if_users`
--
ALTER TABLE `if_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `if_forums`
--
ALTER TABLE `if_forums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `if_forum_members`
--
ALTER TABLE `if_forum_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `if_messages`
--
ALTER TABLE `if_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `if_users`
--
ALTER TABLE `if_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `if_forums`
--
ALTER TABLE `if_forums`
  ADD CONSTRAINT `fk_forums_users` FOREIGN KEY (`created_by_user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `if_forum_members`
--
ALTER TABLE `if_forum_members`
  ADD CONSTRAINT `fk_forum_members_forums` FOREIGN KEY (`forum_id`) REFERENCES `if_forums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_forum_members_users` FOREIGN KEY (`user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `if_messages`
--
ALTER TABLE `if_messages`
  ADD CONSTRAINT `fk_messages_forums` FOREIGN KEY (`forum_id`) REFERENCES `if_forums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_messages_users` FOREIGN KEY (`user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
