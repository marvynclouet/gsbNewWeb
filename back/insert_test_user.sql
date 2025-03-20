USE gsb44;

-- Mise à jour de l'utilisateur de test existant
UPDATE users 
SET name = 'Pharmacie Test',
    siret = '12345678901234',
    email = 'test@test.com',
    password = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role = 'user',
    phone = '0612345678',
    address = '123 rue Test',
    city = 'Paris',
    postal_code = '75000'
WHERE email = 'test@test.com';

-- Si l'utilisateur n'existe pas, on l'insère
INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code)
SELECT 'Pharmacie Test',
       '12345678901234',
       'test@test.com',
       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'user',
       '0612345678',
       '123 rue Test',
       'Paris',
       '75000'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'test@test.com'
); 