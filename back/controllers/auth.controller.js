const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

const register = async (req, res) => {
  try {
    const { name, siret, email, password, phone, address, city, postal_code } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    const [result] = await db.query(
      'INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, siret, email, hashedPassword, 'user', phone, address, city, postal_code]
    );

    // Créer le token JWT
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: result.insertId,
        name,
        siret,
        email,
        phone,
        address,
        city,
        postal_code,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion pour:', email);

    // Vérifier si l'utilisateur existe
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Résultat de la requête:', users);

    if (users.length === 0) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];
    console.log('Utilisateur trouvé:', { id: user.id, email: user.email });

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Mot de passe valide:', isValidPassword);

    if (!isValidPassword) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Connexion réussie, token généré');
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        siret: user.siret,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postal_code: user.postal_code,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

module.exports = {
  register,
  login
}; 