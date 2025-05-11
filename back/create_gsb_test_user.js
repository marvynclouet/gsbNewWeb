const bcrypt = require('bcryptjs');
const db = require('./config/db.config');

async function createGSBTestUser() {
  try {
    // Générer le hash du mot de passe
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur de test GSB
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, phone, address, city, postal_code, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       password = VALUES(password)`,
      [
        'GSB Test User',
        'test@gsb.fr',
        hashedPassword,
        '0612345678',
        '123 rue GSB',
        'Paris',
        '75000',
        'user'
      ]
    );

    console.log('Utilisateur de test GSB créé avec succès !');
    console.log('Email: test@gsb.fr');
    console.log('Mot de passe: test123');
    console.log('ID:', result.insertId);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur de test GSB:', error);
  } finally {
    process.exit();
  }
}

createGSBTestUser(); 