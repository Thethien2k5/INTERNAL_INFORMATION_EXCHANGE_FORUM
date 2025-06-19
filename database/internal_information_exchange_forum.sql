-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 19, 2025 lúc 09:23 AM
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
  `created_by_user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_forums`
--

INSERT INTO `if_forums` (`id`, `name`, `topic`, `created_by_user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(3, 'An toàn thông tin', 'Bảo vệ dữ liệu, chống tấn công mạng.', 9999, '2025-06-19 03:44:07', '2025-06-19 03:44:07', NULL),
(4, 'Hệ điều hành', 'Nền tảng máy tính: quản lý tài nguyên, vận hành.', 9999, '2025-06-19 03:44:34', '2025-06-19 03:44:34', NULL),
(5, 'Lập trình mạng', 'Xây dựng ứng dụng giao tiếp, kết nối qua mạng.', 9999, '2025-06-19 03:45:05', '2025-06-19 03:45:05', NULL),
(6, 'Mạng máy tính', 'Cách thiết bị kết nối, trao đổi dữ liệu.', 9999, '2025-06-19 03:45:19', '2025-06-19 03:45:19', NULL),
(7, 'Tư duy thiết kế và đổi mới sáng tạo', 'Giải quyết vấn đề sáng tạo, đổi mới ý tưởng.', 9999, '2025-06-19 03:45:34', '2025-06-19 03:45:34', NULL),
(8, 'Công nghệ phần mềm', 'Phát triển phần mềm chất lượng, hiệu quả.', 9999, '2025-06-19 03:45:49', '2025-06-19 03:45:49', NULL),
(9, 'Cấu trúc dữ liệu và giải thuật', 'Tổ chức dữ liệu, thiết kế thuật toán tối ưu.', 9999, '2025-06-19 03:46:02', '2025-06-19 03:46:02', NULL),
(10, 'Lập trình trí tuệ nhân tạo', 'Xây dựng hệ thống thông minh, học hỏi, suy luận.', 9999, '2025-06-19 03:46:13', '2025-06-19 03:46:13', NULL),
(11, 'Chung', 'Nhận thông báo chung', 9999, '2025-06-19 03:46:27', '2025-06-19 03:46:27', NULL);

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

--
-- Đang đổ dữ liệu cho bảng `if_forum_members`
--

INSERT INTO `if_forum_members` (`id`, `forum_id`, `user_id`, `joined_at`) VALUES
(6, 3, 9999, '2025-06-19 03:44:07'),
(7, 4, 9999, '2025-06-19 03:44:34'),
(8, 5, 9999, '2025-06-19 03:45:05'),
(9, 6, 9999, '2025-06-19 03:45:19'),
(10, 7, 9999, '2025-06-19 03:45:34'),
(11, 8, 9999, '2025-06-19 03:45:49'),
(12, 9, 9999, '2025-06-19 03:46:02'),
(13, 10, 9999, '2025-06-19 03:46:13'),
(14, 11, 9999, '2025-06-19 03:46:27');

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
-- Cấu trúc bảng cho bảng `if_refresh_tokens`
--

CREATE TABLE `if_refresh_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_refresh_tokens`
--

INSERT INTO `if_refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(11, 9999, 'ae65104c3015817a5bdd2d128a66f0b0ccaa0f001389bc9656cb9d4a1d18355d902e873973ea40ce734925f2d5080038b87c3f9469dfbb4e16d11cac82137b28', '2025-06-26 10:39:39', '2025-06-19 03:39:39'),
(12, 9999, '33234decf2aa76abf050a66d83d8163f4d27434f684afe7c070609d35fcbdc03eb0c569cf3a83ab636585e43468a2de76a364a7608ee275ae54e392189eb0fbf', '2025-06-26 11:37:10', '2025-06-19 04:37:10'),
(13, 9999, '9c807fe2c4143842fbc6930e622438ef8f8c3027142897c431d26754a08a96fd002b1d4a581fc8ac537a2fd860a738ebf300f09dcf995c2f5c418ff77003752f', '2025-06-26 14:09:27', '2025-06-19 07:09:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_users`
--

CREATE TABLE `if_users` (
  `id` int(12) UNSIGNED NOT NULL,
  `Name` varchar(225) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_users`
--

INSERT INTO `if_users` (`id`, `Name`, `username`, `email`, `password_hash`, `avatar`) VALUES
(9999, 'T3V', 'admin', 'thienobita0203@gmail.com', '$2b$10$u7RlU.oheJM3pD35sXUoJOMnO/todjT1M0lnzNXyqH2UgFQO7YTM6', NULL),
(4294967295, 'thien', 'thien', 'thethien2k5@gmail.com', '$2b$10$U.D6R/W4cPojkDl21nukcOKH5OJqe5upDzieXeRA40EM4mSk0EkCm', NULL);

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
-- Chỉ mục cho bảng `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `if_forum_members`
--
ALTER TABLE `if_forum_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `if_messages`
--
ALTER TABLE `if_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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

--
-- Các ràng buộc cho bảng `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  ADD CONSTRAINT `fk_refresh_tokens_users` FOREIGN KEY (`user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
