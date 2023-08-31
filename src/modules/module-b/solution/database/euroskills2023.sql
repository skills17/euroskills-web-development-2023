-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Aug 31, 2023 at 08:08 PM
-- Server version: 11.0.2-MariaDB-1:11.0.2+maria~ubu2204
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `euroskills2023`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_tokens`
--

DROP TABLE IF EXISTS `api_tokens`;
CREATE TABLE `api_tokens` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `token` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `revoked_at` timestamp NULL DEFAULT NULL,
  `workspace_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_tokens`
--

INSERT INTO `api_tokens` (`id`, `name`, `token`, `created_at`, `updated_at`, `revoked_at`, `workspace_id`) VALUES
(1, 'development', '13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6', '2023-06-28 11:14:22', '2023-06-28 11:14:22', NULL, 1),
(2, 'production', '8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91', '2023-06-28 16:44:51', '2023-06-28 16:44:51', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `billing_quotas`
--

DROP TABLE IF EXISTS `billing_quotas`;
CREATE TABLE `billing_quotas` (
  `id` int(11) NOT NULL,
  `limit` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `cost_per_ms` decimal(10,6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `cost_per_ms`, `created_at`, `updated_at`) VALUES
(1, 'Service #1', 0.001500, '2023-06-26 08:00:00', '2023-06-26 08:00:00'),
(2, 'Service #2', 0.005000, '2023-06-26 09:00:00', '2023-06-26 09:00:00'),
(3, 'Service #3', 0.010000, '2023-06-26 10:00:00', '2023-06-26 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `service_usages`
--

DROP TABLE IF EXISTS `service_usages`;
CREATE TABLE `service_usages` (
  `id` int(11) NOT NULL,
  `duration_in_ms` int(11) NOT NULL,
  `api_token_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `usage_started_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_usages`
--

INSERT INTO `service_usages` (`id`, `duration_in_ms`, `api_token_id`, `service_id`, `usage_started_at`) VALUES
(1, 38, 2, 1, '2023-07-01 10:31:48'),
(2, 36, 2, 1, '2023-07-01 23:43:17'),
(3, 38, 2, 1, '2023-07-02 10:36:12'),
(4, 36, 2, 1, '2023-07-02 23:54:02'),
(5, 38, 2, 1, '2023-07-03 06:34:24'),
(6, 39, 2, 1, '2023-07-03 17:21:00'),
(7, 39, 2, 1, '2023-07-03 22:52:59'),
(8, 36, 2, 1, '2023-07-04 12:54:21'),
(9, 39, 2, 1, '2023-07-04 16:25:28'),
(10, 38, 2, 1, '2023-07-05 07:47:05'),
(11, 37, 2, 1, '2023-07-05 08:45:33'),
(12, 37, 2, 1, '2023-07-05 21:18:46'),
(13, 36, 2, 1, '2023-07-05 23:07:11'),
(14, 37, 2, 1, '2023-07-06 08:03:32'),
(15, 38, 2, 1, '2023-07-06 19:00:55'),
(16, 38, 2, 1, '2023-07-06 22:46:37'),
(17, 38, 2, 1, '2023-07-07 12:13:47'),
(18, 39, 2, 1, '2023-07-08 01:31:04'),
(19, 38, 2, 1, '2023-07-08 08:53:46'),
(20, 36, 2, 1, '2023-07-08 17:25:26'),
(21, 38, 2, 1, '2023-07-08 18:12:54'),
(22, 36, 2, 1, '2023-07-09 00:40:36'),
(23, 36, 2, 1, '2023-07-09 01:33:45'),
(24, 35, 2, 1, '2023-07-09 02:15:18'),
(25, 38, 2, 1, '2023-07-09 10:57:03'),
(26, 37, 2, 1, '2023-07-09 20:32:25'),
(27, 39, 2, 1, '2023-07-10 11:25:13'),
(28, 37, 2, 1, '2023-07-10 19:01:00'),
(29, 35, 2, 1, '2023-07-11 06:41:27'),
(30, 37, 2, 1, '2023-07-11 16:09:11'),
(31, 38, 2, 1, '2023-07-12 00:00:39'),
(32, 38, 2, 1, '2023-07-12 04:40:13'),
(33, 39, 2, 1, '2023-07-12 14:27:25'),
(34, 39, 2, 1, '2023-07-13 03:38:15'),
(35, 39, 2, 1, '2023-07-13 04:45:52'),
(36, 38, 2, 1, '2023-07-13 10:23:03'),
(37, 39, 2, 1, '2023-07-14 01:33:35'),
(38, 35, 2, 1, '2023-07-14 13:21:23'),
(39, 36, 2, 1, '2023-07-14 22:42:34'),
(40, 37, 2, 1, '2023-07-15 03:08:06'),
(41, 5, 2, 1, '2023-07-15 04:29:00'),
(42, 21, 2, 2, '2023-06-30 22:46:04'),
(43, 20, 2, 2, '2023-07-01 17:02:15'),
(44, 20, 2, 2, '2023-07-01 23:53:57'),
(45, 23, 2, 2, '2023-07-02 03:26:37'),
(46, 22, 2, 2, '2023-07-02 15:41:25'),
(47, 22, 2, 2, '2023-07-03 01:16:59'),
(48, 22, 2, 2, '2023-07-03 18:12:08'),
(49, 21, 2, 2, '2023-07-03 19:02:06'),
(50, 22, 2, 2, '2023-07-04 00:21:34'),
(51, 24, 2, 2, '2023-07-04 07:54:53'),
(52, 20, 2, 2, '2023-07-04 14:28:14'),
(53, 24, 2, 2, '2023-07-04 14:40:11'),
(54, 21, 2, 2, '2023-07-04 20:33:10'),
(55, 23, 2, 2, '2023-07-05 06:47:03'),
(56, 22, 2, 2, '2023-07-05 08:25:03'),
(57, 22, 2, 2, '2023-07-05 20:35:58'),
(58, 20, 2, 2, '2023-07-06 05:22:29'),
(59, 22, 2, 2, '2023-07-06 15:23:32'),
(60, 23, 2, 2, '2023-07-07 02:41:43'),
(61, 21, 2, 2, '2023-07-07 21:28:06'),
(62, 22, 2, 2, '2023-07-08 07:57:25'),
(63, 24, 2, 2, '2023-07-08 11:39:33'),
(64, 21, 2, 2, '2023-07-08 15:15:40'),
(65, 21, 2, 2, '2023-07-09 11:56:12'),
(66, 22, 2, 2, '2023-07-10 02:57:01'),
(67, 24, 2, 2, '2023-07-10 03:07:02'),
(68, 24, 2, 2, '2023-07-10 19:50:49'),
(69, 23, 2, 2, '2023-07-11 14:35:38'),
(70, 20, 2, 2, '2023-07-11 16:16:30'),
(71, 22, 2, 2, '2023-07-11 19:37:35'),
(72, 22, 2, 2, '2023-07-12 04:47:41'),
(73, 24, 2, 2, '2023-07-12 19:10:36'),
(74, 1, 2, 2, '2023-07-13 02:07:44'),
(75, 10, 1, 1, '2023-07-01 12:49:36'),
(76, 12, 1, 1, '2023-07-02 04:20:00'),
(77, 12, 1, 1, '2023-07-02 19:20:36'),
(78, 10, 1, 1, '2023-07-02 20:34:48'),
(79, 11, 1, 1, '2023-07-02 22:42:10'),
(80, 10, 1, 1, '2023-07-03 04:08:20'),
(81, 11, 1, 1, '2023-07-03 12:12:21'),
(82, 10, 1, 1, '2023-07-03 18:07:24'),
(83, 9, 1, 1, '2023-07-03 18:31:09'),
(84, 10, 1, 1, '2023-07-04 10:06:29'),
(85, 9, 1, 1, '2023-07-04 20:17:28'),
(86, 10, 1, 1, '2023-07-04 21:46:47'),
(87, 12, 1, 1, '2023-07-04 23:11:00'),
(88, 12, 1, 1, '2023-07-05 11:41:06'),
(89, 12, 1, 1, '2023-07-06 03:20:54'),
(90, 11, 1, 1, '2023-07-06 06:08:26'),
(91, 12, 1, 1, '2023-07-06 23:28:25'),
(92, 10, 1, 1, '2023-07-07 08:58:39'),
(93, 8, 1, 1, '2023-07-07 11:05:19'),
(94, 8, 1, 1, '2023-07-08 01:32:52'),
(95, 12, 1, 1, '2023-07-08 10:58:52'),
(96, 8, 1, 1, '2023-07-08 12:10:00'),
(97, 10, 1, 1, '2023-07-09 02:24:20'),
(98, 11, 1, 1, '2023-07-09 12:00:18'),
(99, 10, 1, 1, '2023-07-10 05:03:09'),
(100, 12, 1, 1, '2023-07-10 18:02:58'),
(101, 9, 1, 1, '2023-07-11 05:40:12'),
(102, 11, 1, 1, '2023-07-11 06:54:20'),
(103, 9, 1, 1, '2023-07-11 09:04:47'),
(104, 10, 1, 1, '2023-07-11 12:31:53'),
(105, 10, 1, 1, '2023-07-11 20:49:51'),
(106, 11, 1, 1, '2023-07-12 06:08:02'),
(107, 9, 1, 1, '2023-07-12 18:50:56'),
(108, 8, 1, 1, '2023-07-13 10:58:42'),
(109, 9, 1, 1, '2023-07-13 16:23:09'),
(110, 11, 1, 1, '2023-07-14 03:58:02'),
(111, 10, 1, 1, '2023-07-14 20:50:28'),
(112, 11, 1, 1, '2023-07-15 12:07:17'),
(113, 11, 1, 1, '2023-07-16 03:22:49'),
(114, 5, 1, 1, '2023-07-16 18:01:16'),
(115, 59, 2, 1, '2023-08-02 04:37:43'),
(116, 58, 2, 1, '2023-08-03 07:38:46'),
(117, 58, 2, 1, '2023-08-04 04:01:52'),
(118, 58, 2, 1, '2023-08-04 19:47:44'),
(119, 61, 2, 1, '2023-08-05 15:31:08'),
(120, 61, 2, 1, '2023-08-05 18:41:15'),
(121, 61, 2, 1, '2023-08-07 06:05:30'),
(122, 62, 2, 1, '2023-08-07 14:41:37'),
(123, 62, 2, 1, '2023-08-09 00:19:23'),
(124, 58, 2, 1, '2023-08-10 11:48:53'),
(125, 62, 2, 1, '2023-08-11 02:45:15'),
(126, 58, 2, 1, '2023-08-11 06:33:24'),
(127, 62, 2, 1, '2023-08-11 21:26:58'),
(128, 60, 2, 1, '2023-08-12 14:47:42'),
(129, 60, 2, 1, '2023-08-13 04:53:03'),
(130, 62, 2, 1, '2023-08-14 15:45:21'),
(131, 62, 2, 1, '2023-08-14 22:40:03'),
(132, 15, 2, 1, '2023-08-16 09:42:20'),
(133, 35, 2, 2, '2023-08-01 15:25:25'),
(134, 35, 2, 2, '2023-08-02 08:19:34'),
(135, 35, 2, 2, '2023-08-03 03:06:20'),
(136, 35, 2, 2, '2023-08-03 22:38:11'),
(137, 32, 2, 2, '2023-08-05 07:11:48'),
(138, 35, 2, 2, '2023-08-06 08:54:57'),
(139, 33, 2, 2, '2023-08-06 09:51:05'),
(140, 34, 2, 2, '2023-08-08 05:52:41'),
(141, 32, 2, 2, '2023-08-09 03:57:04'),
(142, 33, 2, 2, '2023-08-10 10:56:36'),
(143, 36, 2, 2, '2023-08-11 15:54:06'),
(144, 36, 2, 2, '2023-08-12 19:51:08'),
(145, 33, 2, 2, '2023-08-14 00:19:40'),
(146, 33, 2, 2, '2023-08-15 12:45:57'),
(147, 24, 2, 2, '2023-08-16 08:56:30'),
(148, 6, 1, 1, '2023-08-01 23:14:43'),
(149, 5, 1, 1, '2023-08-03 00:53:32'),
(150, 7, 1, 1, '2023-08-03 16:21:29'),
(151, 8, 1, 1, '2023-08-04 17:53:18'),
(152, 8, 1, 1, '2023-08-05 09:25:30'),
(153, 8, 1, 1, '2023-08-06 05:10:20'),
(154, 6, 1, 1, '2023-08-06 14:26:15'),
(155, 7, 1, 1, '2023-08-06 15:58:22'),
(156, 7, 1, 1, '2023-08-07 07:44:31'),
(157, 6, 1, 1, '2023-08-08 06:25:03'),
(158, 7, 1, 1, '2023-08-08 23:55:19'),
(159, 8, 1, 1, '2023-08-09 17:26:31'),
(160, 5, 1, 1, '2023-08-09 19:04:41'),
(161, 8, 1, 1, '2023-08-10 01:42:46'),
(162, 8, 1, 1, '2023-08-10 08:57:31'),
(163, 5, 1, 1, '2023-08-11 03:10:14'),
(164, 4, 1, 1, '2023-08-11 12:32:56'),
(165, 6, 1, 1, '2023-08-11 16:47:10'),
(166, 6, 1, 1, '2023-08-12 07:32:43'),
(167, 6, 1, 1, '2023-08-12 18:52:12'),
(168, 8, 1, 1, '2023-08-13 06:31:00'),
(169, 6, 1, 1, '2023-08-13 23:27:34'),
(170, 5, 1, 1, '2023-08-15 02:44:24'),
(171, 6, 1, 1, '2023-08-15 05:29:27'),
(172, 6, 1, 1, '2023-08-15 16:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'demo1', '$2b$10$9n/9JLnTKFzUPt0RAgdAPe2lOe0nceVA0s7B51r9CJCfm3FvPOT5e', '2023-06-27 12:32:11', '2023-06-27 12:32:11'),
(2, 'demo2', '$2b$10$kb.9ObgBfNM9yIQgyUxY0.ZMDu4wUDEh/VozshnoVLcru7VIcQSmO', '2023-06-27 12:33:11', '2023-06-27 12:33:11');

-- --------------------------------------------------------

--
-- Table structure for table `workspaces`
--

DROP TABLE IF EXISTS `workspaces`;
CREATE TABLE `workspaces` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `billing_quota_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workspaces`
--

INSERT INTO `workspaces` (`id`, `title`, `description`, `created_at`, `updated_at`, `user_id`, `billing_quota_id`) VALUES
(1, 'My App', NULL, '2023-06-28 10:55:05', '2023-06-28 10:55:05', 1, NULL),
(2, 'Default Workspace', 'My personal workspace for smaller apps.', '2023-06-28 14:06:34', '2023-06-28 14:06:34', 2, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9c644dd21cac1a0e8fca9443373` (`workspace_id`);

--
-- Indexes for table `billing_quotas`
--
ALTER TABLE `billing_quotas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_usages`
--
ALTER TABLE `service_usages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5ccd2747635edaf9f36f8bae5de` (`api_token_id`),
  ADD KEY `FK_edbd8912f285c2a423d66020061` (`service_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workspaces`
--
ALTER TABLE `workspaces`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_bc02d89a5cbb742925cda902c5` (`billing_quota_id`),
  ADD UNIQUE KEY `REL_bc02d89a5cbb742925cda902c5` (`billing_quota_id`),
  ADD KEY `FK_78512d762073bf8cb3fc88714c1` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `billing_quotas`
--
ALTER TABLE `billing_quotas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `service_usages`
--
ALTER TABLE `service_usages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `workspaces`
--
ALTER TABLE `workspaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `FK_9c644dd21cac1a0e8fca9443373` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces` (`id`);

--
-- Constraints for table `service_usages`
--
ALTER TABLE `service_usages`
  ADD CONSTRAINT `FK_5ccd2747635edaf9f36f8bae5de` FOREIGN KEY (`api_token_id`) REFERENCES `api_tokens` (`id`),
  ADD CONSTRAINT `FK_edbd8912f285c2a423d66020061` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Constraints for table `workspaces`
--
ALTER TABLE `workspaces`
  ADD CONSTRAINT `FK_78512d762073bf8cb3fc88714c1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_bc02d89a5cbb742925cda902c5b` FOREIGN KEY (`billing_quota_id`) REFERENCES `billing_quotas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
