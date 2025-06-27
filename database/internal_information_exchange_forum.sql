-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 23, 2025 lúc 08:29 AM
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
  `created_by_user_id` bigint(20) UNSIGNED NOT NULL,
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
  `user_id` bigint(20) UNSIGNED NOT NULL,
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
(15, 11, 4294967295, '2025-06-19 12:08:57'),
(16, 4, 4294967295, '2025-06-20 12:50:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_messages`
--

CREATE TABLE `if_messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `forum_id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
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
(13, 11, 4294967295, 'text', 'Xin chào mọi người', NULL, NULL, NULL, NULL, '2025-06-19 12:25:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_refresh_tokens`
--

CREATE TABLE `if_refresh_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
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
(16, 4294967295, '37849a0d061637b318cc78674500deafa871c7d89e69ee8b89ef8183a9792cc7e0d2b9bc41118139fc762b18276b7fb22f9ce6abad23b5b641a59033e91e1ebf', '2025-06-26 19:09:06', '2025-06-19 12:09:06'),
(17, 4294967295, '5b2540da686d1a70e1d4bee9b04788618942016c18b6d1f097cfc44d0981840405bf7d52ee25095ae6a66af9b8d97c40f0446a6a59667149370058b7f6d77f47', '2025-06-26 19:09:18', '2025-06-19 12:09:18'),
(18, 4294967295, 'd4ce0b75f29f5d1e813b6acb3e113f202a1d8402ca5f1ec367f5caaf81488b0c848af01c7c433a49aa3e51f0e3cabf38f54dfb47e666bf285bc38a1fd41d611a', '2025-06-26 19:10:13', '2025-06-19 12:10:13'),
(19, 4294967295, '07b0ac0d134628919c08fcba69d32448b824cb5c4b4b0a50ba372e53e5c2401159f8faf6c8c75623fd384e35e9bff1390c3c4650ffa79f490d701c39298dbe20', '2025-06-26 19:10:38', '2025-06-19 12:10:38'),
(20, 9999, '1dfd0e2203335f3252b6e1b27370dbdf3f491a8fa0de41b661a267c5820698c2875876b6eca3a44bd93cd83cb3846365ba09080f24eedf56f9afb59b5661735b', '2025-06-26 19:10:59', '2025-06-19 12:10:59'),
(21, 4294967295, '52deebaf98c4114d38cd4ab0a5c268ba48e8a584bba8db7784a2a3e13e407fa3e10dbbf9778acd9c02b0ffe703821717d9b3c9434ca4bc53d65e7aa9ee024d24', '2025-06-26 19:13:23', '2025-06-19 12:13:23'),
(22, 9999, '87ee92a3c9de518495ef5c931682ef8ee2ccdf1b9416120300f24f24cc210a7a546e92751d8b5fafcbdf025a167b3934f5822fbfcb9a7c3bebd9d562bb44604e', '2025-06-26 19:19:13', '2025-06-19 12:19:13'),
(23, 9999, '8c422a303dc7d9ef8187c19c5db32956cc8fc466622dbb32ecf5f4d10cb806d654b3b96e35a2a0cb50dfbb21fee77e942ac12811c4e2916749b32d93a523ee9a', '2025-06-26 19:21:02', '2025-06-19 12:21:02'),
(24, 4294967295, '4c2082dc94c1e900b9659e5509ebe70f8686e36d2df2a88577c2eddf918662e71a611bf6afe4a5634d46234cfd944078dcb4a318df18ed0cffba729f028cbc96', '2025-06-26 19:25:16', '2025-06-19 12:25:16'),
(25, 9999, '6cca270d52c833af5f6546eafa5a5a692acd328c8822196f9468b510afca439178d92c73e50ce5e17771a1295b4a1d2a55b6f1ae090599c8a9f7fd0efdbbfebe', '2025-06-26 19:33:46', '2025-06-19 12:33:46'),
(26, 4294967295, '87f38ece5d0bbf873c1af943433058ab7fd3e826775156f69df3c00d04f18765a512e89f2156713975e8abf535da0af9885da997df8e4280dece9668a9caa367', '2025-06-26 21:02:10', '2025-06-19 14:02:10'),
(27, 4294967295, '24be15fb5f0c1fcd5a00d135d034cd62ddbc780f37677fcce920c022cb1858ee47041d9fc7c63c62bc48a2df6621f387baca4456fcb8b4a0511496a6783a15d2', '2025-06-26 21:04:22', '2025-06-19 14:04:22'),
(28, 4294967295, '52e6cd7ad5d9c85527bed3a420b8dc16eb9bc1122d282b073d5f63fdc4d8f32507357c9452611513446165bd030cdcf69dfeec208b11f95cb1768ec7efd3d471', '2025-06-26 21:06:02', '2025-06-19 14:06:02'),
(29, 4294967295, 'ebae8b6d400825cd15717713023c13779830c13e442f6eeeb5705018d6ce230afcdf51877956369047a4305bfacf4805ed37ca868f06d93c4779d160cf2c9468', '2025-06-26 21:07:38', '2025-06-19 14:07:38'),
(30, 4294967295, 'd581fcbfd57f3bf4924521efa83bec4f3cd7965c98b5a9407bf479b75f7e1e2e988e8c88f6ba6fa267d2026ac222ebc9d47fcc866f06a74c5564701fa08419c2', '2025-06-26 21:13:41', '2025-06-19 14:13:41'),
(31, 4294967295, 'e9125fc0cbde5ba7525cf415469152af14c2cb6ce7f92436b9a3846197385459588b4cb9c5818b4f871bd4c6853f9a245e81d4f9ed951857da61251302ac11bd', '2025-06-26 21:29:15', '2025-06-19 14:29:15'),
(32, 4294967295, 'be07935c2dc877d3b014ae53961046f3624ff509c44901e5e3ec5c9062f45e38aba554b948fefd1e602a96ff0e330f8ae7dc6bbce187e3ec0a719f7b074cb467', '2025-06-26 21:44:43', '2025-06-19 14:44:43'),
(33, 4294967295, '0d20ddee039709ec44872a377ee86e7151d327530eeb07855c6ce2087a7e31be295d5e9aa61a0046af039d4f207132395eef317d3a0b2e6ee754c44f56e6d58a', '2025-06-26 22:03:19', '2025-06-19 15:03:19'),
(34, 4294967295, '9025b5c1d2c27b83da0dc8419ffed2d8194068cc557b1525dae57df90711b1c5b49f612f4109a165ba7c36150a806d1f4ec9a81f6fd9eb6eccc9c65aed0d0b4d', '2025-06-27 09:18:54', '2025-06-20 02:18:54'),
(35, 4294967295, 'bdd47bbaa2653b5a25c4e2ae3499400132c2613860b3a354c7da96690a6eb9c1814678d16037f40a276f13aa40d4b8457d6258de3d07c5bd2fdfa1ec60cfe899', '2025-06-27 09:36:59', '2025-06-20 02:36:59'),
(36, 4294967295, '3aa741a34eaae596d3b8c8a65ed8b449759268b00ddcc1fbe5da63abfa811ac9e596de212131b760fa55859e5ebb1db934bdafd292d22c1a25448dba1270f0b4', '2025-06-27 09:55:02', '2025-06-20 02:55:02'),
(37, 4294967295, 'a76a74be440b20254c6b4e3f226386f18655d691c619b19480c9aed6fd2c1d92f14d7b92a6ef654fa62271efbdb65ccc05b48c1424dcf414c8a155c8aaee37fc', '2025-06-27 10:32:53', '2025-06-20 03:32:53'),
(38, 4294967295, '60bb5f0bbae42e631a358c3798333dfb9c807ff1fdbc487f96f7e1a81be082abcae11d405ba1f23d047ba812dd81344ff33b11bdd70886db9cd7e90c2cc8c1b0', '2025-06-27 10:48:42', '2025-06-20 03:48:42'),
(39, 4294967295, '29aadcc5aef3241931bccf930a60ee92af4efacfe7d46744e2835b1a9c55b62d294b8c2a1b8a0c0f9c03de18aa5b590b1d0e67bcede34da25f4f111f030ead6c', '2025-06-27 10:48:57', '2025-06-20 03:48:57'),
(40, 4294967295, '32a1cde260be5aa26615e1e1ba833bfe6d9a91beebc50967ec35e0b5f6cda1d891ff4abf8a991406f2e5b0f96dac8aaaca9de736bdeaa41040d0379e8fafb389', '2025-06-27 11:57:23', '2025-06-20 04:57:23'),
(41, 4294967295, 'f2208d707eb2baac8778c597b06998d670cf05517668c82587edbe7cef7558efc67e5f56753f74bda705a07e608c866384c8148763a0b73868c881a3d4e10aff', '2025-06-27 13:38:08', '2025-06-20 06:38:08'),
(42, 4294967295, 'ad3083fc1abdf8eaa6476602a96c17727574ee75e6dd3fd52b00d067c6b36f08840263f96ec725d54b7052be6b11746a53c34b63192b434deec02fc54ce9b926', '2025-06-27 14:53:51', '2025-06-20 07:53:51'),
(43, 4294967295, '7e0c7851d89ef227b1cacc2e3e60afd9f66e3bdf191b192a6c23332edd464c3278efd3254102af7af705937be55c70b425e2353e453bc527433c2c4a996b0229', '2025-06-27 19:07:34', '2025-06-20 12:07:34'),
(44, 4294967295, '6f005a605acc3aef8972f657244d3e4c99fd5117a91b21b2eb9609a75182731ba7416017b83d9d974e4951ce42166ec2b2e57a54e7fde9736c0d8c491e058a3d', '2025-06-27 19:51:00', '2025-06-20 12:51:00'),
(45, 4294967295, 'd59daf0680cd72354f8988008382a86c85e2397be4fbb07b99fb2ed42144fe5dfa3d0c84eea389c2cc592a509bba922958d216b142b5a506e0683c58de8179c0', '2025-06-29 12:30:05', '2025-06-22 05:30:05'),
(46, 4294967295, '281c9ffee6e1683b5c1c1dfb79fe663bd412979b9e2990ce38d424d1018a895adb30961cb48a23657ce304b64fd257080c5fd61f3f5e572ec4c067efe91f24b9', '2025-06-29 13:42:24', '2025-06-22 06:42:24'),
(47, 4294967295, '1694c8b43f42bd1c02cdfd6349879278ffb9026723a20f1c9ae6da4f333618f8c4b90549462d05f83d7e5a65a7f50b8a3094cfaaa723477c0fa7dc2893949a2e', '2025-06-29 14:00:01', '2025-06-22 07:00:01'),
(48, 4294967295, '3116ad5b3cf4a7ea2a7448742397a4c81b04c2c45cd36a03fd68daae391be187090fa3b399c175da55e0f00664a0aaf48729837c6406696eda3e972af5fb8df1', '2025-06-29 15:08:39', '2025-06-22 08:08:39'),
(49, 4294967295, '0d55d6c4703d4d82d3a5f2e2c3845b237311d6e42a92ec73fb6c787f4dbfebec176a4257418516e48367212f89c50f2cb2d034e7d5cc5d8786470dac7d886350', '2025-06-29 15:09:15', '2025-06-22 08:09:15'),
(50, 4294967295, 'cd2831590b9762f7dd5db5c5ba6f2594177f6009c93e598e10d0e4575fb6d73681f7be463f9c76c4824122200d1c4523cca99eccd1a468edee3ca844a3822425', '2025-06-29 15:24:29', '2025-06-22 08:24:29'),
(51, 4294967295, 'b63c7f6ad262c8517ae47b082e474bbb4014550837b7445c79f5530ddb0a37f5929b6c3e595fa3622547af8632b0b21a86b501fb5b8a62dc3032bd19c1270a53', '2025-06-29 19:15:12', '2025-06-22 12:15:12'),
(52, 4294967295, '138876ced1392d7bc3eca1bfc8fdea1b3063fa27ae88f246b0a31c40a9cf6881b4970d71f32178006da3bd835c06f3deff54d3fd14d24e77cd26ba98e7079d2c', '2025-06-29 20:26:48', '2025-06-22 13:26:48'),
(53, 4294967295, '2f9961bdcef9b21fb14dae729729a0a666153ea711b40453026006047bea86d349afffbcec96dc69b3e403020ee65d161caea5510fc30a420e3f6d4749df16b9', '2025-06-29 20:49:39', '2025-06-22 13:49:39'),
(54, 4294967295, '93bec12ac052c672e0b3fd6e1f2b11b476668370840030290c8f4730620d5f2a0bcc88047a00d1597cdd119b054465ebe7d572e4af6d5f497630ad8bac638357', '2025-06-29 21:09:53', '2025-06-22 14:09:53'),
(55, 4294967295, 'a254776cecd85c0fca481414512ef7f7e419dc56e5e19a1f124120fbb72de00bbae2296ac6f2dd4b92e04f05a1dd28f5aa1480c5e2be00788a62a4bc4cc135e0', '2025-06-29 21:25:43', '2025-06-22 14:25:43'),
(56, 4294967295, '365605b9e40e808e8cf53f2c5b4674841cb2a5aca43543c87e902a331427874bd10ab7772a3bcfebec6f2b68b90a87e24769bb73e111e5a3d6f183141a727edb', '2025-06-29 21:35:40', '2025-06-22 14:35:40'),
(57, 4294967295, '8c7a19a8367869c9a2633cea88bff44da3d9bd3d70ce3aab2231b2a765851da28e046aa338550c73934c8efdad93eca3d8def3c635066b68f829e12362664745', '2025-06-29 21:52:34', '2025-06-22 14:52:34'),
(58, 4294967295, 'b6e05baee45ee0e4633291f8a9dd664034a38554cca846e2b4f2236ded1acf15077d84697eb0882b6ac35da543b81a8bd0d61e9778b5775841202d1712e4230a', '2025-06-30 10:21:17', '2025-06-23 03:21:17'),
(59, 4294967295, '0991eab4aaa03d7e966f65bb9ea5c78eabba45da689e786864c50cdb375d13b469dfbdf8368cb431ba074d2dd2177f93a494fd990f21b7f7b4452877407f8357', '2025-06-30 10:22:30', '2025-06-23 03:22:30'),
(60, 4294967295, '92aeb4783a1002a335882f5a4f29dd0cfd208041bf6d08738f695f821013c0679a08a17a8b8aaadf0966e74f305448bfa0ee0c4d68d503c6c22e9d1aaed46abf', '2025-06-30 10:26:57', '2025-06-23 03:26:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `if_users`
--

CREATE TABLE `if_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
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
(4294967295, 'thien', 'thien', 'thethien2k5@gmail.com', '$2b$10$jPIvhziG4tkjvoVmHsDOBuOKs2n2q9DRkDzmHf/xcl6xpFwN/HVWe', NULL);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `if_messages`
--
ALTER TABLE `if_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `if_refresh_tokens`
--
ALTER TABLE `if_refresh_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

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
