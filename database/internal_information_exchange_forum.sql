-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 29, 2025 lúc 09:15 AM
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
-- Cấu trúc bảng cho bảng `if_courses`
--

CREATE TABLE `if_courses` (
  `CourseID` int(12) NOT NULL COMMENT 'mã học phần',
  `CourseName` varchar(100) NOT NULL COMMENT 'Tên học phần',
  `Credits` int(11) DEFAULT NULL COMMENT 'Số tín chỉ',
  `TuitionFee` decimal(10,2) DEFAULT NULL COMMENT 'Học phí'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_courses`
--

INSERT INTO `if_courses` (`CourseID`, `CourseName`, `Credits`, `TuitionFee`) VALUES
(0, 'Chung', 0, 0.00),
(104005004, 'Hệ điều hành', 3, 3400000.00),
(104005105, 'Lập trình mạng', 3, 3400000.00),
(104007201, 'Mạng máy tính', 3, 3400000.00),
(104007202, 'Tư duy thiết kế và đổi mới sáng tạo', 3, 3400000.00),
(104007203, 'Công nghệ phần mềm', 2, 1700000.00),
(104007204, 'Cấu trúc dữ liệu và giải thuật', 3, 3400000.00),
(104122042, 'Lập trình trí tuệ nhân tạo', 3, 3400000.00),
(2147483647, 'An toàn thông tin', 3, 3400000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_forums`
--

CREATE TABLE `if_forums` (
  `id` int(10) UNSIGNED NOT NULL,
  `CourseID` int(12) NOT NULL,
  `CourseName` varchar(100) NOT NULL,
  `topic` text DEFAULT NULL,
  `created_by_user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_forums`
--

INSERT INTO `if_forums` (`id`, `CourseID`, `CourseName`, `topic`, `created_by_user_id`, `created_at`, `updated_at`) VALUES
(3, 2147483647, 'An toàn thông tin', 'Bảo vệ dữ liệu, chống tấn công mạng.', 9999, '2025-06-19 03:44:07', '2025-06-19 13:40:21'),
(4, 104005004, 'Hệ điều hành', 'Nền tảng máy tính: quản lý tài nguyên, vận hành.', 9999, '2025-06-19 03:44:34', '2025-06-19 13:40:21'),
(5, 104005105, 'Lập trình mạng', 'Xây dựng ứng dụng giao tiếp, kết nối qua mạng.', 9999, '2025-06-19 03:45:05', '2025-06-19 13:40:21'),
(6, 104007201, 'Mạng máy tính', 'Cách thiết bị kết nối, trao đổi dữ liệu.', 9999, '2025-06-19 03:45:19', '2025-06-19 13:40:21'),
(7, 104007202, 'Tư duy thiết kế và đổi mới sáng tạo', 'Giải quyết vấn đề sáng tạo, đổi mới ý tưởng.', 9999, '2025-06-19 03:45:34', '2025-06-19 13:40:21'),
(8, 104007203, 'Công nghệ phần mềm', 'Phát triển phần mềm chất lượng, hiệu quả.', 9999, '2025-06-19 03:45:49', '2025-06-19 13:40:21'),
(9, 104007204, 'Cấu trúc dữ liệu và giải thuật', 'Tổ chức dữ liệu, thiết kế thuật toán tối ưu.', 9999, '2025-06-19 03:46:02', '2025-06-19 13:40:21'),
(10, 104122042, 'Lập trình trí tuệ nhân tạo', 'Xây dựng hệ thống thông minh, học hỏi, suy luận.', 9999, '2025-06-19 03:46:13', '2025-06-19 13:40:21'),
(11, 0, 'Chung', 'Nhận thông báo chung', 9999, '2025-06-19 03:46:27', '2025-06-19 03:46:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_forum_members`
--

CREATE TABLE `if_forum_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `forum_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(12) UNSIGNED NOT NULL,
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
(14, 11, 9999, '2025-06-19 03:46:27'),
(42, 11, 317750419, '2025-06-25 06:26:45'),
(43, 4, 317750419, '2025-06-27 10:02:45'),
(44, 11, 277803483, '2025-06-28 08:42:55');

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

--
-- Đang đổ dữ liệu cho bảng `if_messages`
--

INSERT INTO `if_messages` (`id`, `forum_id`, `user_id`, `content_type`, `content_text`, `file_name`, `file_path`, `file_size`, `file_mime_type`, `created_at`) VALUES
(21, 11, 9999, 'text', '777', NULL, NULL, NULL, NULL, '2025-06-24 10:33:33'),
(23, 11, 9999, 'text', 'gggg', NULL, NULL, NULL, NULL, '2025-06-24 10:33:49'),
(24, 11, 317750419, 'text', 'chaof', NULL, NULL, NULL, NULL, '2025-06-26 07:19:54'),
(25, 11, 277803483, 'text', 'chào', NULL, NULL, NULL, NULL, '2025-06-28 08:57:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_refresh_tokens`
--

CREATE TABLE `if_refresh_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(12) UNSIGNED NOT NULL,
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
(13, 9999, '9c807fe2c4143842fbc6930e622438ef8f8c3027142897c431d26754a08a96fd002b1d4a581fc8ac537a2fd860a738ebf300f09dcf995c2f5c418ff77003752f', '2025-06-26 14:09:27', '2025-06-19 07:09:27'),
(14, 9999, 'd6ba1fc0ff163a2144eebf19e0a638834ac47f6bad33ec110283acd541a4181cca783abc5763cb37d76faf1987efe693389b556a82221affaf7e94742f32b298', '2025-06-26 18:24:17', '2025-06-19 11:24:17'),
(20, 9999, '1dfd0e2203335f3252b6e1b27370dbdf3f491a8fa0de41b661a267c5820698c2875876b6eca3a44bd93cd83cb3846365ba09080f24eedf56f9afb59b5661735b', '2025-06-26 19:10:59', '2025-06-19 12:10:59'),
(22, 9999, '87ee92a3c9de518495ef5c931682ef8ee2ccdf1b9416120300f24f24cc210a7a546e92751d8b5fafcbdf025a167b3934f5822fbfcb9a7c3bebd9d562bb44604e', '2025-06-26 19:19:13', '2025-06-19 12:19:13'),
(23, 9999, '8c422a303dc7d9ef8187c19c5db32956cc8fc466622dbb32ecf5f4d10cb806d654b3b96e35a2a0cb50dfbb21fee77e942ac12811c4e2916749b32d93a523ee9a', '2025-06-26 19:21:02', '2025-06-19 12:21:02'),
(25, 9999, '6cca270d52c833af5f6546eafa5a5a692acd328c8822196f9468b510afca439178d92c73e50ce5e17771a1295b4a1d2a55b6f1ae090599c8a9f7fd0efdbbfebe', '2025-06-26 19:33:46', '2025-06-19 12:33:46'),
(80, 9999, 'bad5384ffcef8b947f415ad3b78a34ff36a8eeaf260dd5bdedade0c5486c9efc558bba4ccc534a2d1c303cf862576d1d26b6e3e22a131b9442ef92a73e31d693', '2025-07-01 10:20:59', '2025-06-24 03:20:59'),
(99, 9999, '65ce06ab6bc99a8ccc4771d547e44e8dd1a0f2851425b15f1798743fa6a1136defec45cc764df8208121fd11d16b11fe3c2811cd44021c2e31e30ecffdaed599', '2025-07-01 17:32:47', '2025-06-24 10:32:47'),
(105, 317750419, 'e6e244bad8a2429ae66fbfa2cb869573972b02ee7af08423949aa1bce0dc3544bc220690b857c7c8c5c96137d4f3f18eabd6943f15f9350eaadfa34d3731d6d2', '2025-07-02 13:27:01', '2025-06-25 06:27:01'),
(106, 317750419, '738a6642cb8e8b4f0dcc401c7dab58127b17f24007fca3593ee352b84f0870878cc23733262269056debda12d446d9a1b51c9a4c9e8ff7859ee5e93b4d686f01', '2025-07-02 13:51:08', '2025-06-25 06:51:08'),
(107, 317750419, 'c4b16ca47d2a3c973c0c3682bb4881e2f1fc70bf5755102f39bbb24fb7a129a47de326b9e00dbe585c6fb714e319eead018bc818147ab9b10ef6cf9f62adbd5d', '2025-07-02 14:07:55', '2025-06-25 07:07:55'),
(108, 317750419, '243b4df6d7d79139d01fed6e6e3d1f5c96637f51894c7c5fc520b1341711ee65293f9cee3f0d0e62856719cbf36484cb7f867e3a2d1600bd7e2e335476d776fb', '2025-07-02 14:35:55', '2025-06-25 07:35:55'),
(109, 317750419, '6c636225f0fdf07d93a00dab3932306be11095375153c16fa6a6f09824ceda36fba5f98ec09a6cac6f67b740208c24fb51df4734789ba09b5a3ba2dad2277dc9', '2025-07-02 14:45:22', '2025-06-25 07:45:22'),
(110, 317750419, '61f32ace63962fad4a875f8272873fd7aec0527c3f195e3144080cd42427fc194450f945a887bb2e7a971fc70de0108f1ffd4fbd8d025abdad6fc58138e23879', '2025-07-02 14:47:41', '2025-06-25 07:47:41'),
(111, 317750419, '209896b0b47f593531c86d05d2bbd354f6a9cea4b76a682575fb2ca0854f1d557a72cdad1a36fe7fb91c3a21cbbc72ffb41afaeec8f339b8593f27d9777b0395', '2025-07-02 15:01:32', '2025-06-25 08:01:32'),
(112, 317750419, '326e0e58e5bbbcd5ab75ed4861f5befdaafe5ab8d4b51959542abade26d82a0fbd5a2a7bea62fd36afad01dcfe1ea7129cff012a7c3ac9cd8cc7f543118cf2af', '2025-07-02 18:11:54', '2025-06-25 11:11:54'),
(113, 317750419, '3eadc16b29cf55df220c977116bc930f835d032b7d40bd28c916f3ea8d37af15f9705733d962c1fc2009ebd697a276fa294c3cfee431a7c593ddf235c8e507d8', '2025-07-02 18:37:16', '2025-06-25 11:37:16'),
(114, 317750419, '58b01f219dc156fd877d3cd0d8445a700d16699d0cf9ff8368c41e23ff030e92329aa05e54bf7a551aa8f18b6aa8d5a731418ff401745fd4f5d21e6c254546db', '2025-07-02 19:22:15', '2025-06-25 12:22:15'),
(115, 317750419, '005252e87c2a5b48301f5df982380e72b35e49faeeceaabc65afbd6dbcd58f6b7887a7b355a77c3d70b0d3317d5fdb57f0a1b5542d49101a114e87a335c560fd', '2025-07-02 19:34:49', '2025-06-25 12:34:49'),
(116, 317750419, '36d7f4aee58d301894790a2ad4d1b1235e499d2a33ff3e3827a80b5bea32090fe894e013a085a775180a2ff5e9da0a23aac737d5fc491a1338f3022a4ddb9ccc', '2025-07-02 19:58:12', '2025-06-25 12:58:12'),
(117, 317750419, 'edf6b27dfd30d202d42e793018a4e84f75e9126fda95a7168bf6679c5b87f3c4c84a0854c8759a450fe8d947be4defbfd55e72b1a78ebbb4baa2c36debb9db5b', '2025-07-03 12:16:11', '2025-06-26 05:16:11'),
(118, 317750419, 'a2ef786662ecba43f2b4dde94a331361ef1bd924bff0ccafae30a1f8be18d659b0ab27b084e5e260fc5c1195387b7dfb6575a60e8c1f797a4cf7e685997b1c13', '2025-07-03 12:27:56', '2025-06-26 05:27:56'),
(119, 317750419, '9960daff313130ba5b243c801bf27ca1ca6703f0dd4ffe93e6546108f24197e010496a4e109e4dd37917205e59475065169dc7343de537c9f6b86712006d3ea9', '2025-07-03 12:31:14', '2025-06-26 05:31:14'),
(120, 317750419, 'f46c765988991cb1574b5288b80c40ae48f8bc9d1a40564a98d3666f87de4b10255b6cd2bdfd187b4ae3855a0a10cb437a8f86f5f83be97eb1270f0881cf7b1b', '2025-07-03 12:41:35', '2025-06-26 05:41:35'),
(121, 317750419, '176db117b0cc55f98c73efe380401145963168b78a701fc89c663c0afc619ecabe85229615c878593e35a442d9188f77e9f2cb9e6f574cc8e8fbbdb6a353586d', '2025-07-03 14:04:52', '2025-06-26 07:04:52'),
(122, 317750419, '5a597b5ceb19a397869b96c26d264dfdd77331057e0ddc87d2122f88b02c95ee59936ff2d95a25860128270bb8d94f5f4d9fc1ad5725853a74284bba69bc5dc4', '2025-07-03 14:26:29', '2025-06-26 07:26:29'),
(123, 317750419, '990620577713ae9244d76722b2b62c8f67345bd2b6b9af21cdf336945f057066aa4f8673e3830781bd346f0c9b474e026c7b54c6fb28b53cba8cfd1c0cdb7266', '2025-07-03 14:53:48', '2025-06-26 07:53:48'),
(124, 317750419, '8521585575a5ae392c03852ab547a13e651529b7232326b03e5da5fb485fb3a93007c22153e55544aef3b0b652e8a4d9daf507ec014c802874c06c8fa5212801', '2025-07-04 14:36:55', '2025-06-27 07:36:55'),
(125, 317750419, 'dab09979dc94fe31e5732341d3f8a679768fb8312997c64f7e1b2135788675f94404c03172ccb91c66b0ba25cb2b77ab363b79415fa566352476eba29eced5c0', '2025-07-04 15:56:20', '2025-06-27 08:56:20'),
(126, 317750419, '57a610b4babbc161bfe682ff6538571edd5da1dbd389541ba8587c13b26638f30da26bd67db4517774fb8c890f016dfe66b98c83b6ccb8cc987ac4650fd6d6f1', '2025-07-04 16:10:28', '2025-06-27 09:10:28'),
(127, 317750419, '1a3ba72490621b35d46ba7231c37b57c475fb81b84a6d8f3bd93cbf7a1ee2255aaa0da203a7993524766ef571ee2625bf514fb1863c6569b58bac714d96d7ffb', '2025-07-04 16:10:53', '2025-06-27 09:10:53'),
(128, 317750419, '4e1d13ab64a91040ce83c74f0c9c5253381c1b96e1b5cd309a84d3024bf0163ac529b2b30000e716ae170e562ce57a0178e8bf55a881c8fcfb5e06b847eabd68', '2025-07-04 16:37:52', '2025-06-27 09:37:52'),
(129, 317750419, 'd84d07e2e2c4186a10b453a10bd6a06a47d8b4dd20c481dabc8d39e80f3d053be21df3343b7490c279f947d2e4d43d3598dd643e54ae1702907ca8f832f1c8a2', '2025-07-04 16:56:20', '2025-06-27 09:56:20'),
(130, 277803483, 'd2a1021b5eea987d0975e7a355e7c3041082f7a37ee7efbeea1207cc40766e7fc071ed7c84a54cfcfb4819ebf7d2001c7f99f015e74b69eeef954ccf0f1ae230', '2025-07-05 15:43:08', '2025-06-28 08:43:08'),
(131, 277803483, '4ff84046f22b14091df799206db5c873615b7de4d20d71cc4fca42e143cf2d5ace4eb6f8dd6e786bb0abca117c4bc4ba66f513d81c2d7e465d2d30d8b626be04', '2025-07-05 15:54:57', '2025-06-28 08:54:57'),
(132, 317750419, '36225206919a291ed4940239a45879b22858232de42d8f1a49101292f109c0ccdff6565947339a45fc8d6860b7a84da0edef9244a8c197688a1b265d24287512', '2025-07-05 15:57:40', '2025-06-28 08:57:40'),
(133, 317750419, '04cdb7050687b2b12a503a5b79613afc948ba0cd40e23b0642e0f4488b06298819ecfb3458f04c3749a7c38934a96007b42d3abcc1ac8f514c8df6ef0142c386', '2025-07-05 16:15:55', '2025-06-28 09:15:55'),
(134, 317750419, '2a7a1c034deb923a612d3cbbac9bad3c68c678f206c2464993c27051dfd8528bc595a773159645da9d1f478f58169056ead7b460882f929a06c1ae75baa55454', '2025-07-05 16:31:09', '2025-06-28 09:31:09'),
(135, 317750419, '7ecbcc21246e43fa0ecb7a2a1c17eabd94cca8ef834015ebc27f5bc9218c596a3cb4a8f704e72b998c5799da9850b6eb4a276c1c1a5ff71756935b9a60611ef7', '2025-07-05 19:48:33', '2025-06-28 12:48:33'),
(136, 317750419, '26e81b8b837c5658c922392c1203a13697693a6a43965473a53d2807a5fda3ef9799ed6b015d4379936a287d09bfc99f3b62b0f3f0522bb22006d73b7033b6b7', '2025-07-05 19:48:52', '2025-06-28 12:48:52'),
(137, 277803483, '5d603081c13ebe1bf110e7a406ca12888b22a94ad0622b1c6bfd2607cc50f486da29974380c5189934cbc1ef9d6a62670a9117fa76813082ab0764b5e1131544', '2025-07-05 19:50:30', '2025-06-28 12:50:30'),
(138, 317750419, '419011c14e8bc96fe066a9c2b7614775ff66a7c1a34245986f9fb45a8416835d767c16f3f45921e1dc5424a2cdaa23986ff138b04335f9d0327f02b3ef5fb91b', '2025-07-05 20:04:00', '2025-06-28 13:04:00'),
(139, 317750419, 'c2d9bc887487d576d6bcc55ad3d2d7dd465821423112d16639c780294c088c153b3d118dbfbf65d23f8e6a8291b1c322f5067ced47c3b15a02e49e41cd08aba2', '2025-07-05 20:05:52', '2025-06-28 13:05:52'),
(140, 277803483, 'c42334a21e5951ba7ba8fe77c8b6ae1a0563e6fced7f832fae96108f00a6593734009d5b00fcf5586da2f16d8b19fbf870c1d214bcecbe05815993ef5eff5285', '2025-07-05 20:06:15', '2025-06-28 13:06:15'),
(141, 317750419, 'c2e44b14ab8f6b7541beea507f43523047f74c996cf548339bb1923702b60210667b2a4098d0f9bce08292b26ba7681827c4bf092ab2a272b30767c05dd6208c', '2025-07-05 20:28:15', '2025-06-28 13:28:15'),
(142, 317750419, '2ab381fcc50801da628b560b91d272968114a1630774650a0fbc698c56104113965e529bafdca499f6211a0b768f0c9fa969bfdfc7fe859454a9a8b2c8d6da36', '2025-07-05 22:45:14', '2025-06-28 15:45:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_users`
--

CREATE TABLE `if_users` (
  `id` int(12) UNSIGNED NOT NULL,
  `Name` varchar(225) NOT NULL,
  `gender` varchar(1) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `if_users`
--

INSERT INTO `if_users` (`id`, `Name`, `gender`, `username`, `email`, `password_hash`, `avatar`) VALUES
(9999, 'T3V', '0', 'admin', 'thienobita0203@gmail.com', '$2b$10$u7RlU.oheJM3pD35sXUoJOMnO/todjT1M0lnzNXyqH2UgFQO7YTM6', NULL),
(277803483, 'ồ ze', '0', 'NttDz1', 'nttsoradz1@gmail.com', '$2b$10$AGplOVy4ZErEld/r3WD1LuV6hDoycEzxZ9iDKJEeYA90VLneM0fDi', '1751115991514.jpg'),
(317750419, 'Thiên đẹp trai', '0', 'thien', 'thethien2k5@gmail.com', '$2b$10$7LTfpO2djCWhclSkHoWw8eNAlrALk2hXbfJ6XuKjqWrztuw7VVi9i', '1751018831781.jpg');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `if_courses`
--
ALTER TABLE `if_courses`
  ADD PRIMARY KEY (`CourseID`);

--
-- Chỉ mục cho bảng `if_forums`
--
ALTER TABLE `if_forums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_forums_users` (`created_by_user_id`),
  ADD KEY `FK_if_forums_CourseID` (`CourseID`);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT cho bảng `if_messages`
--
ALTER TABLE `if_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `if_forums`
--
ALTER TABLE `if_forums`
  ADD CONSTRAINT `FK_if_forums_CourseID` FOREIGN KEY (`CourseID`) REFERENCES `if_courses` (`CourseID`),
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
