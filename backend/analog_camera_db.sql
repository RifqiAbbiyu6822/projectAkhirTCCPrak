-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 06:16 PM
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
-- Database: `analog_camera_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cameras`
--

CREATE TABLE `cameras` (
  `id` int(11) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(100) NOT NULL,
  `type` enum('SLR','Rangefinder','Point-and-Shoot','TLR') NOT NULL,
  `year_released` int(11) DEFAULT NULL,
  `format` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cameras`
--

INSERT INTO `cameras` (`id`, `brand`, `model`, `type`, `year_released`, `format`, `price`, `stock`, `created_at`, `image_link`) VALUES
(1, 'Canon', 'AE-1', 'SLR', 1976, '35mm', 299.99, 5, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Canon_AE-1_with_50mm_f1.8_S.C._II.jpg'),
(2, 'Nikon', 'FM2', 'SLR', 1982, '35mm', 450.00, 2, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Nikon_FM2_in_black.jpg'),
(3, 'Pentax', 'K1000', 'SLR', 1976, '35mm', 199.99, 8, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Pentax_K1000.jpg'),
(4, 'Leica', 'M3', 'Rangefinder', 1954, '35mm', 2500.00, 1, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/b/be/Leica_M3_mg_3848.jpg'),
(5, 'Hasselblad', '500CM', 'SLR', 1970, 'Medium Format', 1800.00, 2, '2025-06-01 14:57:42', 'https://www.flickr.com/photos/50678983@N00/271569051/in/pool-camerawiki'),
(6, 'Rolleiflex', '2.8F', 'TLR', 1960, 'Medium Format', 1200.00, 2, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Rolleiflex_f2-8-F.jpg'),
(7, 'Canon', 'F-1', 'SLR', 1971, '35mm', 380.00, 4, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Canon_F-1_%2813746363604%29.jpg\r\n'),
(8, 'Olympus', 'OM-1', 'SLR', 1972, '35mm', 320.00, 6, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Olympus_OM-1.jpg'),
(9, 'Minolta', 'X-700', 'SLR', 1981, '35mm', 250.00, 7, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/3/3d/DSCF5260_Minolta_X-700_%285937670807%29.jpg'),
(10, 'Contax', 'T2', 'Point-and-Shoot', 1990, '35mm', 800.00, 3, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/5/51/Contax_T.jpg'),
(11, 'Yashica', 'Mat-124G', 'TLR', 1970, 'Medium Format', 400.00, 5, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/2/28/Yashica_Electro_35_GSN.jpg\r\n'),
(12, 'Mamiya', 'RB67', 'SLR', 1970, 'Medium Format', 600.00, 3, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Mamiya_RB_67_ProSD.jpg'),
(13, 'Leica', 'IIIf', 'Rangefinder', 1950, '35mm', 1500.00, 1, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Leica_IIIf_50mm_f1.5.jpg'),
(14, 'Nikon', 'F3', 'SLR', 1980, '35mm', 550.00, 4, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/0/09/Nikon_F3_with_HP_viewfinder.jpeg'),
(15, 'Canon', 'Sure Shot Supreme', 'Point-and-Shoot', 1992, '35mm', 150.00, 10, '2025-06-01 14:57:42', 'https://www.flickr.com/photos/awcam/3849745186/in/pool-camerawiki/'),
(26, 'Olympus', 'XA', 'Point-and-Shoot', 1979, '35mm', 180.00, 7, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Olympus_XA_7889.jpg'),
(27, 'Zenza', 'Bronica S2A', 'SLR', 1965, 'Medium Format', 400.00, 2, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/5/59/Zenza_Bronica_ETRS_with_Bronica_Zenzanon_75mm_f2.8_EII_lens_-_%281%29.jpg\r\n'),
(28, 'Agfa', 'Isolette III', 'Rangefinder', 1956, 'Medium Format', 250.00, 3, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Gro%C3%9Fmutters_Isolette.jpg'),
(29, 'Praktica', 'MTL5', 'SLR', 1984, '35mm', 80.00, 10, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/3/35/Praktica_LLC_SLR_black.jpg'),
(30, 'Fed', '2', 'Rangefinder', 1955, '35mm', 150.00, 4, '2025-06-01 14:57:42', 'https://upload.wikimedia.org/wikipedia/commons/5/57/FED2.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `camera_id` int(11) NOT NULL,
  `transaction_type` enum('purchase','rental') NOT NULL,
  `transaction_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `camera_id`, `transaction_type`, `transaction_date`, `return_date`, `quantity`, `total_price`, `created_at`) VALUES
(51, 3, 2, 'purchase', '2025-06-01', NULL, 1, 450.00, '2025-06-01 15:08:34'),
(52, 3, 30, 'purchase', '2025-06-01', NULL, 1, 150.00, '2025-06-01 15:31:33'),
(53, 3, 29, 'purchase', '2025-06-01', NULL, 2, 160.00, '2025-06-01 15:31:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` text NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(3, 'abbiyu1', 'imneon2003@gmail.com', '$2b$10$g5sg2mVOHo4Jqt4xgWA4eOppJ0rXqXXbeYGxG8Ak0j300nCeRw2eK', 'admin', '2025-06-01 14:24:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cameras`
--
ALTER TABLE `cameras`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `camera_id` (`camera_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cameras`
--
ALTER TABLE `cameras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`camera_id`) REFERENCES `cameras` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
