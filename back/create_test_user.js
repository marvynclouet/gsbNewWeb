const bcrypt = require('bcryptjs');
const db = require('./config/db.config');

async function createTestUser() {
  try {
    // Générer le hash du mot de passe
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur de test
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, phone, address, birth_date, social_security) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Test User',
        'test@test.com',
        hashedPassword,
        '0612345678',
        '123 rue Test, 75000 Paris',
        '1990-01-01',
        '123456789'
      ]
    );

    console.log('Utilisateur de test créé avec succès !');
    console.log('Email: test@test.com');
    console.log('Mot de passe: test123');
    console.log('ID:', result.insertId);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur de test:', error);
  } finally {
    process.exit();
  }
}

createTestUser(); 