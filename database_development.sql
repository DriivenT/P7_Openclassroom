-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: May 25, 2021 at 10:38 AM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `database_development`
--

-- --------------------------------------------------------

--
-- Table structure for table `commentaires`
--

CREATE TABLE `commentaires` (
  `id` int(11) NOT NULL,
  `idUtilisateurs` int(11) NOT NULL,
  `idPosts` int(11) NOT NULL,
  `nom` char(255) NOT NULL,
  `prenom` char(255) NOT NULL,
  `contenu` varchar(255) NOT NULL,
  `likes` int(10) UNSIGNED DEFAULT '0',
  `usersLiked` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `commentaires`
--

INSERT INTO `commentaires` (`id`, `idUtilisateurs`, `idPosts`, `nom`, `prenom`, `contenu`, `likes`, `usersLiked`, `createdAt`, `updatedAt`) VALUES
(39, 21, 70, 'MONSIEUR', 'Test', 'Alo', 0, NULL, '2021-05-10 22:42:42', '2021-05-10 22:42:42'),
(45, 21, 81, 'MONSIEUR', 'Test', 'test', 0, '{\"userId\":[]}', '2021-05-18 16:39:41', '2021-05-18 17:00:36');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `idUtilisateurs` int(11) NOT NULL,
  `nom` char(255) NOT NULL,
  `prenom` char(255) NOT NULL,
  `contenu` varchar(255) NOT NULL,
  `likes` int(10) UNSIGNED DEFAULT '0',
  `usersLiked` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `idUtilisateurs`, `nom`, `prenom`, `contenu`, `likes`, `usersLiked`, `createdAt`, `updatedAt`) VALUES
(70, 21, 'MONSIEUR', 'Test', 'POST N°1', 0, NULL, '2021-05-10 22:42:32', '2021-05-10 22:42:32'),
(71, 21, 'MONSIEUR', 'Test', 'POST N°2', 0, NULL, '2021-05-10 22:42:35', '2021-05-10 22:42:35'),
(81, 21, 'MONSIEUR', 'Test', 'POST N7', 0, NULL, '2021-05-18 16:39:19', '2021-05-18 16:39:19'),
(83, 23, 'P7', 'Demo', 'POST POST ', 1, '{\"userId\":[23]}', '2021-05-24 17:27:13', '2021-05-24 17:28:00'),
(84, 25, 'Projet7', 'Démo', 'Bonjour !', 1, '{\"userId\":[25]}', '2021-05-25 09:22:50', '2021-05-25 09:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20210312154438-create-utilisateur.js'),
('20210312154603-create-post.js'),
('20210312154623-create-commentaire.js'),
('20210312154651-create-like.js');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `password`, `isAdmin`, `avatar`, `createdAt`, `updatedAt`) VALUES
(4, 'test', 'test', 'test@test.com', '$2b$10$clSdO8FpfjOe73YW2BW5Ve9lIC31hcLYbVAAKMYyzsDZm.7IWaGkm', 0, NULL, '2021-04-06 14:17:08', '2021-04-06 14:17:08'),
(5, 'test2', 'test2', 'test4@test4.com', '$2b$10$rzmEbIJMSQdjGnye4ilf5O6w94AbtITePdK8/Vrh4L2P8Osf2EIR.', 0, NULL, '2021-04-07 14:32:13', '2021-04-09 15:26:15'),
(6, 'Stodé', 'Kant1', 'Kant1.Stodé@mdp.com', '$2b$10$g29LdEovqVx1xVyHPEywtetqEZAOWIi6/snnNnynfraj9bx7q4vme', 0, NULL, '2021-04-23 15:01:10', '2021-04-23 15:01:10'),
(7, 'dazd', 'dadz', 'test2@test2.com', '$2b$10$qgfYtzNWm0RPu31Qq5W6EOoOaVmf59X84C28JnHjSljDTLLtrUwJS', 0, NULL, '2021-04-23 15:27:33', '2021-04-23 15:27:33'),
(8, 'test12', 'test12', 'test12@test12.com', '$2b$10$AXp5GxbQEsloWJvYLyuGU.ZNpXhtA9HfHj5IPgPCNsORAeovdU/cS', 0, NULL, '2021-04-23 15:30:59', '2021-04-23 15:30:59'),
(9, 'Tom', 'Bret', 'testAdmin@gmail.com', '$2b$10$QjNHKGNNudWY1vc3HQIs5eYa5RVQbcZKMbfXeSDg6LXjPmAcHTbr.', 0, NULL, '2021-04-26 11:47:44', '2021-04-26 11:47:44'),
(12, 'test', 'test', 'test12@test.com', '$2b$10$AluXZoLfLGWOxmrc4llA9OGIs8dWm.yBqK1jOfqBcIA3958qUHXfq', 0, NULL, '2021-04-26 13:04:08', '2021-04-26 13:04:08'),
(13, 'moi', 'moi', 'moi@moi.com', '$2b$10$ZEaqX/hgBWiPxcTF5bN.eu1VP0Vrk7QiD1CPMeozg7w3DznQn23oS', 0, NULL, '2021-04-26 13:54:12', '2021-04-26 13:54:12'),
(19, 'VUE', 'Test', 'vue@gmail.com', '$2b$10$nJvvxb6iU2emvB/70SnV2uHvzmRuHvhHd6XpyN72YljCFFG403o1e', 0, NULL, '2021-05-10 19:14:39', '2021-05-10 19:14:39'),
(20, 'test', 'test', 'testest@gmail.com', '$2b$10$wW/KFbrcghYnzFf64ENCN.KbjvkkWA3vvo6Mk9NZy5deqQ5Ge459C', 0, NULL, '2021-05-10 19:31:53', '2021-05-10 19:31:53'),
(21, 'MONSIEUR', 'Test', 'test13@gmail.com', '$2b$10$3krkJ0js52EG/mia5OxduOdfe9QEmpmoTamdwxlEuBKPKbOR3JnTK', 0, NULL, '2021-05-10 22:41:56', '2021-05-10 22:41:56'),
(23, 'P7', 'Demo', 'P7Demo@gmail.com', '$2b$10$8pQB8f9hy4jRwc.LC02rqufcTMaTFrVcPXkFl5lLACgT.1VUZLOeW', 0, NULL, '2021-05-24 17:18:51', '2021-05-24 17:23:15'),
(24, 'P7', 'Demo', 'demo@gmail.com', '$2b$10$xpn699zpnpzkVi9aswU39e.orGOrhn.XPFbObsSBBb1FxnDI1JKD2', 0, NULL, '2021-05-24 17:18:51', '2021-05-24 17:18:51'),
(25, 'Projet7', 'Démo', 'P7demonstration@gmail.com', '$2b$10$ynMok/VN8Y4RmLGl4gRfLe5KeNszGN3sZOKzHdTBuQgmZL.YDd1TG', 1, NULL, '2021-05-25 09:18:31', '2021-05-25 09:21:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUtilisateurs` (`idUtilisateurs`),
  ADD KEY `idPosts` (`idPosts`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUtilisateurs` (`idUtilisateurs`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`idUtilisateurs`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `commentaires_ibfk_2` FOREIGN KEY (`idPosts`) REFERENCES `posts` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`idUtilisateurs`) REFERENCES `utilisateurs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
