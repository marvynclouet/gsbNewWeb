const db = require('../config/db.config');

const getUserProfile = async (req, res) => {
  try {
    console.log('Récupération du profil pour userId:', req.user.userId);
    
    const [users] = await db.query(
      'SELECT id, name, siret, email, role, phone, address, city, postal_code, created_at, updated_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      console.log('Utilisateur non trouvé pour userId:', req.user.userId);
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé',
        error: 'USER_NOT_FOUND'
      });
    }

    const user = users[0];
    console.log('Profil trouvé:', { id: user.id, email: user.email });
    
    // Ne pas envoyer les données sensibles
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du profil',
      error: 'PROFILE_FETCH_ERROR'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, postal_code } = req.body;
    const userId = req.user.userId;

    console.log('Mise à jour du profil pour userId:', userId);
    console.log('Données reçues:', { name, phone, address, city, postal_code });

    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, postal_code = ? WHERE id = ?',
      [name, phone, address, city, postal_code, userId]
    );

    res.json({ 
      message: 'Profil mis à jour avec succès',
      user: { name, phone, address, city, postal_code }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil',
      error: 'PROFILE_UPDATE_ERROR'
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile
}; 