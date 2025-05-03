const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('Middleware d\'authentification - Début');
    console.log('URL:', req.url);
    console.log('Méthode:', req.method);
    console.log('Headers:', req.headers);

    // Vérifier si l'en-tête Authorization existe
    if (!req.headers.authorization) {
      console.log('Erreur: En-tête d\'autorisation manquant');
      return res.status(401).json({ 
        message: 'En-tête d\'autorisation manquant',
        error: 'MISSING_AUTH_HEADER'
      });
    }

    // Vérifier le format du token
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Erreur: Format de token invalide');
      return res.status(401).json({ 
        message: 'Format de token invalide',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('Erreur: Token manquant');
      return res.status(401).json({ 
        message: 'Token manquant',
        error: 'MISSING_TOKEN'
      });
    }

    // Vérifier si la clé secrète JWT est configurée
    if (!process.env.JWT_SECRET) {
      console.error('Erreur: JWT_SECRET non configuré dans les variables d\'environnement');
      return res.status(500).json({ 
        message: 'Erreur de configuration du serveur',
        error: 'SERVER_CONFIG_ERROR'
      });
    }

    try {
      console.log('Vérification du token...');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token décodé:', decodedToken);
      
      // Vérifier si le token contient un userId
      if (!decodedToken.userId) {
        console.log('Erreur: Token invalide - userId manquant');
        return res.status(401).json({ 
          message: 'Token invalide: userId manquant',
          error: 'INVALID_TOKEN_PAYLOAD'
        });
      }

      // Ajouter l'utilisateur à la requête
      req.user = { userId: decodedToken.userId };
      console.log('Authentification réussie pour userId:', decodedToken.userId);
      next();
    } catch (jwtError) {
      console.error('Erreur JWT:', jwtError);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expiré',
          error: 'TOKEN_EXPIRED',
          expiredAt: jwtError.expiredAt
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Token invalide',
          error: 'INVALID_TOKEN_SIGNATURE'
        });
      }

      throw jwtError;
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'authentification',
      error: 'AUTHENTICATION_ERROR'
    });
  }
};

module.exports = authMiddleware; 