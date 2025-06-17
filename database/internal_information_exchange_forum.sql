-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2025 at 11:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `internal_information_exchange_forum`
--

-- --------------------------------------------------------

--
-- Table structure for table `if_forums`
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

--
-- Dumping data for table `if_forums`
--

INSERT INTO `if_forums` (`id`, `name`, `topic`, `password_hash`, `created_by_user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Thong chat', '', '', 2, '2025-06-16 06:37:31', '2025-06-16 06:37:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `if_forum_members`
--

CREATE TABLE `if_forum_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `forum_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `if_forum_members`
--

INSERT INTO `if_forum_members` (`id`, `forum_id`, `user_id`, `joined_at`) VALUES
(1, 1, 2, '2025-06-16 06:37:31'),
(2, 1, 3, '2025-06-16 07:14:01');

-- --------------------------------------------------------

--
-- Table structure for table `if_messages`
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

--
-- Dumping data for table `if_messages`
--

INSERT INTO `if_messages` (`id`, `forum_id`, `user_id`, `content_type`, `content_text`, `file_name`, `file_path`, `file_size`, `file_mime_type`, `created_at`) VALUES
(1, 1, 2, 'text', 'rgrg', NULL, NULL, NULL, NULL, '2025-06-16 06:39:07'),
(2, 1, 2, 'text', 'dfsdfds', NULL, NULL, NULL, NULL, '2025-06-16 06:48:03'),
(3, 1, 2, 'text', 'dsf', NULL, NULL, NULL, NULL, '2025-06-16 06:52:17'),
(4, 1, 2, 'text', 'fsfs', NULL, NULL, NULL, NULL, '2025-06-16 06:52:30'),
(5, 1, 2, 'text', 'dsfsdg', NULL, NULL, NULL, NULL, '2025-06-16 06:55:11'),
(6, 1, 2, 'text', 'Thongu', NULL, NULL, NULL, NULL, '2025-06-16 06:56:15'),
(7, 1, 2, 'text', 'sdgg', NULL, NULL, NULL, NULL, '2025-06-16 07:02:18'),
(8, 1, 2, 'text', 'Sure, it\'s a calming notion', NULL, NULL, NULL, NULL, '2025-06-16 07:07:34'),
(9, 1, 2, 'text', 'thong', NULL, NULL, NULL, NULL, '2025-06-16 07:07:53'),
(10, 1, 3, 'text', 'Thong', NULL, NULL, NULL, NULL, '2025-06-16 07:19:20'),
(11, 1, 3, 'text', 'ádfdsf', NULL, NULL, NULL, NULL, '2025-06-16 07:20:21'),
(12, 1, 3, 'text', 'gsdgđg', NULL, NULL, NULL, NULL, '2025-06-16 07:21:02'),
(13, 1, 2, 'text', 'agdgad', NULL, NULL, NULL, NULL, '2025-06-16 07:21:04'),
(14, 1, 3, 'text', 'hdfh', NULL, NULL, NULL, NULL, '2025-06-16 07:22:09'),
(15, 1, 3, 'text', 'zxcbxb', NULL, NULL, NULL, NULL, '2025-06-16 07:22:46'),
(16, 1, 3, 'text', 'sdgg', NULL, NULL, NULL, NULL, '2025-06-16 07:28:54'),
(17, 1, 3, 'text', 'dee', NULL, NULL, NULL, NULL, '2025-06-16 07:30:46'),
(18, 1, 2, 'text', 'hello', NULL, NULL, NULL, NULL, '2025-06-16 07:30:57'),
(19, 1, 3, 'text', 'xin chao', NULL, NULL, NULL, NULL, '2025-06-16 07:40:37'),
(20, 1, 2, 'text', 'uk', NULL, NULL, NULL, NULL, '2025-06-16 07:40:48'),
(21, 1, 3, 'text', 'Thông 1 ơi', NULL, NULL, NULL, NULL, '2025-06-16 07:42:34'),
(22, 1, 2, 'text', 'không có được :(((', NULL, NULL, NULL, NULL, '2025-06-16 07:42:44'),
(23, 1, 3, 'text', '2', NULL, NULL, NULL, NULL, '2025-06-16 08:00:17'),
(24, 1, 3, 'text', 'ồ', NULL, NULL, NULL, NULL, '2025-06-16 08:00:31'),
(25, 1, 3, 'text', 'được chưa', NULL, NULL, NULL, NULL, '2025-06-16 08:03:05'),
(26, 1, 3, 'text', 'được rồi này', NULL, NULL, NULL, NULL, '2025-06-16 08:03:12'),
(27, 1, 3, 'text', 'thấy sao', NULL, NULL, NULL, NULL, '2025-06-16 08:07:23'),
(28, 1, 3, 'text', 'd', NULL, NULL, NULL, NULL, '2025-06-16 08:09:16'),
(29, 1, 3, 'text', 'd', NULL, NULL, NULL, NULL, '2025-06-16 08:12:07'),
(30, 1, 3, 'text', 'xin chào tôi tên THông', NULL, NULL, NULL, NULL, '2025-06-16 08:13:03'),
(31, 1, 3, 'text', 'cc', NULL, NULL, NULL, NULL, '2025-06-16 08:13:28'),
(32, 1, 2, 'text', 'cc 2', NULL, NULL, NULL, NULL, '2025-06-16 08:13:35'),
(33, 1, 2, 'text', 'xin chào bạn đó', NULL, NULL, NULL, NULL, '2025-06-17 03:32:06'),
(34, 1, 2, 'text', 'hello', NULL, NULL, NULL, NULL, '2025-06-17 03:33:13'),
(35, 1, 2, 'text', 'vương gà', NULL, NULL, NULL, NULL, '2025-06-17 08:53:10'),
(36, 1, 2, 'text', 'thien gà', NULL, NULL, NULL, NULL, '2025-06-17 08:53:23'),
(37, 1, 3, 'text', 'hhhh', NULL, NULL, NULL, NULL, '2025-06-17 08:54:22'),
(38, 1, 2, 'text', 'dfhdh', NULL, NULL, NULL, NULL, '2025-06-17 08:55:20');

-- --------------------------------------------------------

--
-- Table structure for table `if_refresh_tokens`
--

CREATE TABLE `if_refresh_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `if_refresh_tokens`
--

INSERT INTO `if_refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 2, 'c2dea95d8dfae440a08d023a7503cc3296b195a34c02001dd55d2886778006ab5aac6df9be43afd4dad3ff694a8b7a07d4983b74129535f157c4b2bc3a708e8f', '2025-06-23 10:08:27', '2025-06-16 03:08:27'),
(2, 2, '053eb8d93c5555a66abc4566d683a812b41711d3fbcce1f6375c959be226e419e3eddf3827bbcec00384188fbc77bd2753b24496e572defc8a4d8f1c47a0f649', '2025-06-23 10:08:55', '2025-06-16 03:08:55'),
(3, 3, '52a5d81b786711611b6f7568efb60a1e3df8e9861fa8add6d5212237b4690119d1f911a44480ab78543093ea8c0998dda72475e8f5d488c14bf24cac72a0d7b4', '2025-06-23 10:15:36', '2025-06-16 03:15:36'),
(4, 2, '978a42b1673286f1680b60893ff79251b467c05e911500168c108a58ddacecaec90169ed100a2bae037619d43e5cb470629207b59ddf798452a7ba2ede12243e', '2025-06-23 12:11:16', '2025-06-16 05:11:16'),
(5, 2, '03521dfd25ccef87a7319fc80613ebd45ff2a9ffab7cdff8af6fea9b53d2df15afab13e331576461ba78e6a80f30d2ef222856ff119d8bce9a92b98c68f4e35a', '2025-06-23 12:50:25', '2025-06-16 05:50:25'),
(6, 2, 'e4f74cc9f5523c22f50c271a4b1b84560f932dc87023ef999cbdf442acdb24304c10bcad666ec138627eadadb0fd4f5dc13a8491d500cecb0c61f853edef0543', '2025-06-23 13:14:39', '2025-06-16 06:14:39'),
(7, 2, 'b406b0cc0b1809bfc8018e4add5ef2af03cb42fd38a54d6fffc377c0d27b9af69c6fb9300d6510cfa49881a693513f7a28642915045461898f746ce9801ef1f3', '2025-06-23 13:15:06', '2025-06-16 06:15:06'),
(8, 2, '12ea8a6f9d87de90a5c9b75ac1a0100dad08d4f37d2b39d9d455662bf9d38847b068a4a71290b017101082ea0dcbffbb3c4875419295f98c0b99d2e35c8a5822', '2025-06-23 13:16:04', '2025-06-16 06:16:04'),
(9, 2, 'cb81c217eec2cf38719a077a9421990b7b12e1b951665f555c856af5aee9eceaf9dfe8b9ba76c36c1f48c319b8ec4e168aa584f7a81e916b2fdb21a4138ea55e', '2025-06-23 13:21:04', '2025-06-16 06:21:04'),
(10, 2, 'eeaf8801021f26663828425374f232b266162f3d2514295a8d81eae658b229b53ba0f24b2b6449d3304e4a3eab1aba980a1b581c94fa815bbfa74d27d1d0b6ca', '2025-06-23 13:37:21', '2025-06-16 06:37:21'),
(11, 2, 'c75c8e12ad4d35dfd66cdc056250363493e53b9984673f67315b6beacfc7986bf0feab10ad2beea61f30332518d080cf4def47f7179428ecfb38ac9ec80c70f6', '2025-06-23 13:52:24', '2025-06-16 06:52:24'),
(12, 2, '2548ea9926be4870836fcf38f7a2da804c72f258ce6252d7f5f3d7aac95a77bbce90ad1e9bd18e011539b7b0b6130104eb25a6da1f6d95c7487de3f516813761', '2025-06-23 14:07:43', '2025-06-16 07:07:43'),
(13, 3, '780baba4cc561577a91a96008b5974c843e68a1caa8d4027e0fa3315e9269a209c6fda76566ef3055a9ff033ce47ccd723e16e35c5cea57314d7d7818625c23c', '2025-06-23 14:16:32', '2025-06-16 07:16:32'),
(14, 2, '76c5cf54d327868180e9ae046380f9ac847b4c9849581e8d60ed61ea422f73f8a6766d1c647489f6826e813b8fb4e9896f1c40cc480265eda741dfcb2da76605', '2025-06-23 14:29:25', '2025-06-16 07:29:25'),
(15, 3, '484fa254e379c7f15af606276a6601edb8b6d079f0e07d499b3d50dcea3e68206e86e9524f467e7c3551e0c07b2114abc8a975279ffc39baaedecac156d5722c', '2025-06-23 14:40:27', '2025-06-16 07:40:27'),
(16, 2, '2920bc9a805d39a9e8c37c8e6bd9442f004f518e5775eee3f8058633610e44d4db1308ac8ce46687d573e1402fa0e58db8fd22eb66a28212cce5b0477a36a724', '2025-06-23 15:00:01', '2025-06-16 08:00:01'),
(17, 3, '3c83c0c9a1dc4da2e23deb15d97ef1d49567fd486f99608ad389295de49b170a735588cd626b115dc4ea57b546782579b481f3931af2f28f6bb75f5b621c3828', '2025-06-23 15:00:10', '2025-06-16 08:00:10'),
(18, 3, '1d70e6ea9d590aff7d95e33eb062906b55c69ef74e48538eebdfc39c0eb8954db2a7fa153d4d6fc46647d7b3a111b49ca2657c855892b663c32a255576626d24', '2025-06-23 15:07:12', '2025-06-16 08:07:12'),
(19, 3, 'ef444b6faaf504e14af6bc3cdc90e47c7ef0085b3ee795a06d6ea89d84d1699630693796a1ebdaabb004a6ca4cccbb7f0fd66135363e0159ff055a5bb7169c9b', '2025-06-23 15:10:24', '2025-06-16 08:10:24'),
(20, 2, 'f62dfeb1c20cbeeabe23c8e50cff5ee32957703ef66f3caf941bacb1d34d070ae2eb57d5417c1686ff06568b808488637411e8567d815f7e55b5384e56a0a54d', '2025-06-23 15:12:25', '2025-06-16 08:12:25'),
(21, 3, 'dbb2697c1755b112000e9242642658d720762637523bb018af133a3ca22fdebc466c834cff4437816c8a5f265f9f530e9a01bebe5f6bc890222d0eb7b0e96e8c', '2025-06-24 10:30:40', '2025-06-17 03:30:40'),
(22, 2, 'c1bd8257a545b573d571f4c77cf878996826f192036aa71645df7af1e5b5109bd7ad9d4cb69532e086afcd8db796357a5b16174416616ea2f9627277dac7bb53', '2025-06-24 10:31:54', '2025-06-17 03:31:54'),
(23, 2, '40a3392780ec9e131fb5b9ea6fdb6e80246856fb057459612a8ee907c477b59f64788470c4fa079cdfd5f093834105494b30643878e827a83611b4d5e7360a44', '2025-06-24 10:32:58', '2025-06-17 03:32:58'),
(24, 2, 'a9e1c33553e8caf089cab7ce282b698a20cc5753c5739ad1443a8aa6686c53296185ffd588c4338c451a4d88b2fce7789dace94c5e4f3d67b0a46ac0703ea613', '2025-06-24 15:50:25', '2025-06-17 08:50:25'),
(25, 3, 'ce76fa6cab93f1dd508b460a4bf653d7cf26ad670818abb5c585891a1034f92c36d98edebd68413400cf3003c11d563dd216b9f96d37f33321c1f5ee4a89abb8', '2025-06-24 15:52:42', '2025-06-17 08:52:42'),
(26, 3, '7bb1ced25724c479ccc84fe47993eac6361d8c8c41982d531c7074e135dd237839b948abc5942690cc6178add61fb19915b39617c1ec8ef38350ba10abb18278', '2025-06-24 15:54:14', '2025-06-17 08:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `if_users`
--

CREATE TABLE `if_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `if_users`
--

INSERT INTO `if_users` (`id`, `username`, `email`, `password_hash`, `avatar`) VALUES
(2, 'thong1', 'thongthuanduong675@gmail.com', '$2b$10$FBG1xCUyM97PAo.c//l.I.5BVuMSGQwmmm/YeQC/M5Rn9vLsvTMLq', NULL),
(3, 'thong2', 'thuanthong675@gmail.com', '$2b$10$pjOaOJ1pb/o/y6IcTcBppuWmhj.jKzbwLG8kBsJdabGxGjHL3F9e2', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `if_forums`
--
ALTER TABLE `if_forums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_forums_users` (`created_by_user_id`);

--
-- Indexes for table `if_forum_members`
--
ALTER TABLE `if_forum_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `forum_id` (`forum_id`,`user_id`),
  ADD KEY `fk_forum_members_users` (`user_id`);

--
-- Indexes for table `if_messages`
--
ALTER TABLE `if_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_messages_forums` (`forum_id`),
  ADD KEY `fk_messages_users` (`user_id`);

--
-- Indexes for table `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `if_users`
--
ALTER TABLE `if_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `if_forums`
--
ALTER TABLE `if_forums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `if_forum_members`
--
ALTER TABLE `if_forum_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `if_messages`
--
ALTER TABLE `if_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `if_users`
--
ALTER TABLE `if_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `if_forums`
--
ALTER TABLE `if_forums`
  ADD CONSTRAINT `fk_forums_users` FOREIGN KEY (`created_by_user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `if_forum_members`
--
ALTER TABLE `if_forum_members`
  ADD CONSTRAINT `fk_forum_members_forums` FOREIGN KEY (`forum_id`) REFERENCES `if_forums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_forum_members_users` FOREIGN KEY (`user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `if_messages`
--
ALTER TABLE `if_messages`
  ADD CONSTRAINT `fk_messages_forums` FOREIGN KEY (`forum_id`) REFERENCES `if_forums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_messages_users` FOREIGN KEY (`user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  ADD CONSTRAINT `fk_refresh_tokens_users` FOREIGN KEY (`user_id`) REFERENCES `if_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
