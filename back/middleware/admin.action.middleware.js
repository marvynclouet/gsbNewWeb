const db = require('../config/db.config')


// GB, Here we verify if the user is referenced as an admin

const verifyAdminRoleMiddleware = async (req, res, next) => {
    try {
      const [users] = await db.query('SELECT role FROM users WHERE id = ?', [req.user.userId]);
      if (users.length === 0 || users[0].role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du rôle' });
    }
  };

module.exports = verifyAdminRoleMiddleware; 