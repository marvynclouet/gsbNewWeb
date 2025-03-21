-- Création d'un administrateur
INSERT INTO users (email, password, role) 
VALUES (
    'admin@gsb.com',
    '$2a$10$YourHashedPasswordHere', -- Le mot de passe sera 'admin123'
    'admin'
); 