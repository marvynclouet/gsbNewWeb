USE gsb44;

-- Insérer un utilisateur de test
-- Le mot de passe est "test123" hashé avec bcrypt
INSERT INTO users (name, email, password, phone, address, birth_date, social_security) 
VALUES (
    'Test User',
    'test@test.com',
    '$2a$10$YourHashedPasswordHere', -- Ceci est un exemple, le vrai hash sera généré par bcrypt
    '0612345678',
    '123 rue Test, 75000 Paris',
    '1990-01-01',
    '123456789'
); 