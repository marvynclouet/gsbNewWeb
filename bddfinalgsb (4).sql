-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : ven. 04 avr. 2025 à 07:19
-- Version du serveur : 5.7.24
-- Version de PHP : 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bddfinalgsb`
--

-- --------------------------------------------------------

--
-- Structure de la table `medicaments`
--

CREATE TABLE `medicaments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `medicaments`
--

INSERT INTO `medicaments` (`id`, `name`, `description`, `price`, `stock`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Paracétamol', 'Antalgique et antipyrétique', '5.99', 100, '/images/paracetamol.jpg', '2025-03-20 12:55:14', '2025-03-20 12:55:14'),
(2, 'Ibuprofène', 'Anti-inflammatoire non stéroïdien', '7.99', 80, '/images/ibuprofene.jpg', '2025-03-20 12:55:14', '2025-03-20 12:55:14'),
(3, 'Aspirine', 'Antalgique et anti-inflammatoire', '6.99', 90, '/images/aspirine.jpg', '2025-03-20 12:55:14', '2025-03-20 12:55:14'),
(4, 'Doliprane', 'Antalgique et antipyrétique', '5.99', 150, '/images/doliprane.jpg', '2025-03-20 12:55:14', '2025-03-20 12:55:14'),
(5, 'Efferalgan', 'Antalgique et antipyrétique', '6.99', 120, '/images/efferalgan.jpg', '2025-03-20 12:55:14', '2025-03-20 12:55:14');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delivery_name` varchar(255) NOT NULL,
  `delivery_address` text NOT NULL,
  `delivery_message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `created_at`, `updated_at`, `delivery_name`, `delivery_address`, `delivery_message`) VALUES
(2, 3, '12.98', 'pending', '2025-03-20 13:29:10', '2025-03-20 13:29:10', '', '', NULL),
(3, 3, '12.98', 'pending', '2025-03-20 13:40:34', '2025-03-20 13:40:34', 'Pharmacie Test', '123 rue Test', ''),
(4, 3, '12.98', 'pending', '2025-03-20 13:41:00', '2025-03-20 13:41:00', 'Pharmacie Test', '123 rue Test', ''),
(5, 3, '12.98', 'pending', '2025-03-20 13:47:52', '2025-03-20 13:47:52', 'Pharmacie Test', '123 rue Test', ''),
(6, 3, '12.98', 'pending', '2025-03-20 17:18:40', '2025-03-20 17:18:40', 'Pharmacie Test', '123 rue Test', ''),
(7, 3, '6.99', 'pending', '2025-03-20 18:29:47', '2025-03-20 18:29:47', 'Pharmacie Test', '123 rue Test', ''),
(8, 3, '12.98', 'pending', '2025-03-20 20:15:02', '2025-03-20 20:15:02', 'Pharmacie Test', '123 rue Test', ''),
(9, 4, '12.98', 'shipped', '2025-03-21 08:06:17', '2025-03-21 09:24:14', 'GSB Admin', '15 rue de l\'Administration', ''),
(10, 4, '12.98', 'pending', '2025-03-21 09:30:49', '2025-03-21 09:30:49', 'GSB Admin', '15 rue de l\'Administration', ''),
(11, 5, '12.98', 'pending', '2025-03-21 10:25:06', '2025-03-21 10:25:06', 'dd', '2ewrewr', ''),
(12, 4, '33.95', 'pending', '2025-03-21 10:36:39', '2025-03-21 10:36:39', 'GSB Admin', '15 rue de l\'Administration', ''),
(14, 4, '12.98', 'pending', '2025-03-21 11:12:09', '2025-03-21 11:12:09', 'GSB Admin', '15 rue de l\'Administration', ''),
(15, 4, '6.99', 'pending', '2025-03-21 11:40:42', '2025-03-21 11:40:42', 'GSB Admin', '15 rue de l\'Administration', ''),
(16, 4, '12.98', 'pending', '2025-03-21 11:41:49', '2025-03-21 11:41:49', 'GSB Admin', '15 rue de l\'Administration', ''),
(17, 4, '13.98', 'pending', '2025-03-21 11:48:12', '2025-03-21 11:48:12', 'GSB Admin', '15 rue de l\'Administration', ''),
(18, 4, '6.99', 'pending', '2025-03-21 13:10:47', '2025-03-21 13:10:47', 'GSB Admin', '15 rue de l\'Administration', 'hwuehfw'),
(19, 7, '6.99', 'pending', '2025-03-21 14:17:42', '2025-03-21 14:17:42', 'rgfdg', '145 rue de la paire', ''),
(20, 7, '6.99', 'delivered', '2025-03-21 14:36:26', '2025-03-22 11:06:50', 'rgfdg', '145 rue de la paire', ''),
(21, 4, '6.99', 'delivered', '2025-03-21 14:51:00', '2025-03-22 11:06:43', 'GSB Admin', '15 rue de l\'Administration', ''),
(22, 7, '6.99', 'delivered', '2025-03-21 15:05:23', '2025-03-22 11:06:41', 'rgfdg', '145 rue de la paire', ''),
(23, 4, '6.99', 'delivered', '2025-03-21 17:44:54', '2025-03-22 11:06:39', 'GSB Admin', '15 rue de l\'Administration', '');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `medicament_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `medicament_id`, `quantity`, `price`, `created_at`) VALUES
(2, 2, 3, 1, '6.99', '2025-03-20 13:29:10'),
(3, 2, 4, 1, '5.99', '2025-03-20 13:29:10'),
(4, 3, 3, 1, '6.99', '2025-03-20 13:40:34'),
(5, 3, 4, 1, '5.99', '2025-03-20 13:40:34'),
(6, 4, 3, 1, '6.99', '2025-03-20 13:41:00'),
(7, 4, 4, 1, '5.99', '2025-03-20 13:41:00'),
(8, 5, 3, 1, '6.99', '2025-03-20 13:47:52'),
(9, 5, 4, 1, '5.99', '2025-03-20 13:47:52'),
(10, 6, 3, 1, '6.99', '2025-03-20 17:18:40'),
(11, 6, 4, 1, '5.99', '2025-03-20 17:18:40'),
(12, 7, 3, 1, '6.99', '2025-03-20 18:29:47'),
(13, 8, 3, 1, '6.99', '2025-03-20 20:15:02'),
(14, 8, 4, 1, '5.99', '2025-03-20 20:15:02'),
(15, 9, 3, 1, '6.99', '2025-03-21 08:06:17'),
(16, 9, 4, 1, '5.99', '2025-03-21 08:06:17'),
(17, 10, 3, 1, '6.99', '2025-03-21 09:30:49'),
(18, 10, 4, 1, '5.99', '2025-03-21 09:30:49'),
(19, 11, 3, 1, '6.99', '2025-03-21 10:25:06'),
(20, 11, 4, 1, '5.99', '2025-03-21 10:25:06'),
(21, 12, 3, 1, '6.99', '2025-03-21 10:36:39'),
(22, 12, 4, 1, '5.99', '2025-03-21 10:36:39'),
(23, 12, 5, 1, '6.99', '2025-03-21 10:36:39'),
(24, 12, 2, 1, '7.99', '2025-03-21 10:36:39'),
(25, 12, 1, 1, '5.99', '2025-03-21 10:36:39'),
(28, 14, 3, 1, '6.99', '2025-03-21 11:12:09'),
(29, 14, 4, 1, '5.99', '2025-03-21 11:12:09'),
(30, 15, 3, 1, '6.99', '2025-03-21 11:40:42'),
(31, 16, 3, 1, '6.99', '2025-03-21 11:41:49'),
(32, 16, 4, 1, '5.99', '2025-03-21 11:41:49'),
(33, 17, 3, 2, '6.99', '2025-03-21 11:48:12'),
(34, 18, 3, 1, '6.99', '2025-03-21 13:10:47'),
(35, 19, 3, 1, '6.99', '2025-03-21 14:17:42'),
(36, 20, 3, 1, '6.99', '2025-03-21 14:36:26'),
(37, 21, 3, 1, '6.99', '2025-03-21 14:51:00'),
(38, 22, 3, 1, '6.99', '2025-03-21 15:05:23'),
(39, 23, 3, 1, '6.99', '2025-03-21 17:44:54');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Nom de l''entreprise',
  `siret` varchar(14) NOT NULL COMMENT 'Numéro SIRET de l''entreprise',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `phone` varchar(20) NOT NULL COMMENT 'Téléphone de l''entreprise',
  `address` text NOT NULL COMMENT 'Adresse de l''entreprise',
  `city` varchar(100) NOT NULL COMMENT 'Ville de l''entreprise',
  `postal_code` varchar(5) NOT NULL COMMENT 'Code postal de l''entreprise',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `siret`, `email`, `password`, `role`, `phone`, `address`, `city`, `postal_code`, `created_at`, `updated_at`, `profile_image`) VALUES
(3, 'Pharmacie Test', '12345678901234', 'test@test.com', '$2a$10$TsKJ4ptpN0VTWQyaTsLw..vP9oPMMpaAN0FmwVStNC7WSD7EJj87e', 'user', '0612345678', '123 rue Test', 'Paris', '75000', '2025-03-20 13:10:39', '2025-03-20 13:14:31', NULL),
(4, 'GSB Admin', '98765432101234', 'admin@gsb-pharma.fr', '$2a$10$TsKJ4ptpN0VTWQyaTsLw..vP9oPMMpaAN0FmwVStNC7WSD7EJj87e', 'admin', '0123456789', '15 rue de l\'Administration', 'Paris', '75001', '2025-03-20 20:58:15', '2025-03-20 20:58:15', NULL),
(5, 'dd', '27899269551637', 'dupont@example.com', '$2b$10$mbG7LDp2v6kkM4HeDzV.8O6i6FeFpzqFwb7wz5Yl.fcZgqnc1i.YW', 'user', '0658364915', '2ewrewr', 'drancz', '34543', '2025-03-21 09:10:57', '2025-03-21 09:10:57', NULL),
(6, 'BSB LABEL', '34321236789765', 'bsb@gsb-pharma.fr', '$2b$10$jcvvfUzXUGIoBJB3JdSRAu0kO4W.JpUAH3UJb7Ice786nODToNEh2', 'user', '0658364944', '145 rue de la paix', 'Paris', '78015', '2025-03-21 13:12:54', '2025-03-21 13:12:54', NULL),
(7, 'rgfdg', '27899269551634', '123@gsb.fr', '$2b$10$DPKe66M0FDta7jalZooHwuo7bY57mwDkFjWv0PLNH2vfnvst5LzdK', 'user', '0658364946', '145 rue de la paire', 'Paris', '78015', '2025-03-21 14:16:32', '2025-03-21 14:16:32', NULL),
(8, 'BSBrr', '27899269551633', 'qwert@gsb.fr', '$2b$10$UQ8ivgZJ90PU7TSF/eASbOyAO50MgTGmu0M3tGAwhgVuVp/6jSmre', 'user', '0658364945', '145 rue de la paille', 'Paris', '78015', '2025-03-21 14:51:55', '2025-03-21 14:51:55', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `medicaments`
--
ALTER TABLE `medicaments`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `medicament_id` (`medicament_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siret` (`siret`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `medicaments`
--
ALTER TABLE `medicaments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
