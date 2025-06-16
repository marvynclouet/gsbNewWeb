-- Création de la table images
CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` LONGBLOB NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Modification de la table medicaments
ALTER TABLE `medicaments`
DROP COLUMN `image_url`,
ADD COLUMN `image_id` int(11) DEFAULT NULL,
ADD CONSTRAINT `fk_medicament_image` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE SET NULL; 