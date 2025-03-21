-- Mise à jour des URLs des images dans la table medicaments
UPDATE medicaments 
SET image_url = '/images/doliprane.jpg' 
WHERE name = 'Doliprane';

UPDATE medicaments 
SET image_url = '/images/efferalgan.jpg' 
WHERE name = 'Efferalgan';

UPDATE medicaments 
SET image_url = '/images/aspirine.jpg' 
WHERE name = 'Aspirine';

UPDATE medicaments 
SET image_url = '/images/ibuprofene.jpg' 
WHERE name = 'Ibuprofène';

UPDATE medicaments 
SET image_url = '/images/paracetamol.jpg' 
WHERE name = 'Paracétamol'; 