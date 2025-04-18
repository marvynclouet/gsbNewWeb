const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'gsb44'
  });

  try {
    // Générer le hash du mot de passe
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si l'admin existe déjà
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@gsb.com']
    );

    if (existingAdmin.length > 0) {
      console.log('L\'administrateur existe déjà');
      return;
    }

    // Créer l'administrateur
    await connection.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      ['admin@gsb.com', hashedPassword, 'admin']
    );

    console.log('Administrateur créé avec succès');
    console.log('Email: admin@gsb.com');
    console.log('Mot de passe: admin123');
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await connection.end();
  }
}

createAdmin(); 