USE gsb44;

-- Suppression des colonnes non nécessaires
ALTER TABLE users
DROP COLUMN birth_date,
DROP COLUMN social_security,
DROP COLUMN profile_picture;

-- Modification des colonnes existantes
ALTER TABLE users
MODIFY COLUMN name VARCHAR(255) NOT NULL COMMENT 'Nom de l''entreprise',
MODIFY COLUMN email VARCHAR(255) NOT NULL COMMENT 'Email de l''entreprise',
MODIFY COLUMN phone VARCHAR(20) NOT NULL COMMENT 'Téléphone de l''entreprise',
MODIFY COLUMN address TEXT NOT NULL COMMENT 'Adresse de l''entreprise';

-- Ajout des colonnes pour l'entreprise
ALTER TABLE users
ADD COLUMN siret VARCHAR(14) NOT NULL UNIQUE AFTER name COMMENT 'Numéro SIRET de l''entreprise',
ADD COLUMN city VARCHAR(100) NOT NULL AFTER address COMMENT 'Ville de l''entreprise',
ADD COLUMN postal_code VARCHAR(5) NOT NULL AFTER city COMMENT 'Code postal de l''entreprise';

-- Ajout du champ role à la table users
ALTER TABLE users
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password; 