const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const medicamentRoutes = require('./routes/medicament.routes');
const userRoutes = require('./routes/user.routes');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());

// Middleware de compression
app.use(compression());

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
});

// Appliquer le rate limiting à toutes les routes
app.use(limiter);

// Middleware CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://10.74.1.3:3000',
  'http://10.74.1.3:8080',
  'http://10.74.1.3:5001',
  'http://10.74.3.246:*',  // Adresse IP de l'iPhone
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
];

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origine (comme les requêtes mobiles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith(':*')) {
        const baseOrigin = allowedOrigin.replace(':*', '');
        return origin.startsWith(baseOrigin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith(':*')) {
        const baseOrigin = allowedOrigin.replace(':*', '');
        return origin.startsWith(baseOrigin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json({ limit: '10kb' })); // Limite la taille du body à 10kb

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('IP:', req.ip);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medicaments', medicamentRoutes);
app.use('/api/users', userRoutes);

// Route de test améliorée
app.get('/api/test', (req, res) => {
  console.log('Test route accessed from:', req.ip);
  console.log('Request headers:', req.headers);
  res.json({ 
    message: 'Le serveur fonctionne correctement',
    timestamp: new Date().toISOString(),
    clientIp: req.ip
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Gestion des erreurs améliorée
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Gestion spécifique des erreurs JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expiré',
      error: 'TOKEN_EXPIRED'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Token invalide',
      error: 'INVALID_TOKEN'
    });
  }
  
  // Gestion des erreurs CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'Accès non autorisé',
      error: 'CORS_ERROR'
    });
  }
  
  // Erreur par défaut
  res.status(err.status || 500).json({ 
    message: 'Une erreur est survenue sur le serveur',
    error: err.message || 'INTERNAL_SERVER_ERROR'
  });
});

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // Écouter sur toutes les interfaces réseau

// Log de démarrage détaillé
console.log('=== Configuration du serveur ===');
console.log(`Port: ${PORT}`);
console.log(`Host: ${HOST}`);
console.log('=== Interfaces réseau ===');
Object.entries(require('os').networkInterfaces()).forEach(([name, interfaces]) => {
  interfaces.forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`${name}: ${iface.address}`);
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`\n=== Serveur démarré ===`);
  console.log(`Serveur démarré sur ${HOST}:${PORT}`);
  console.log('Access the server at:');
  console.log(`- http://localhost:${PORT}`);
  console.log(`- http://127.0.0.1:${PORT}`);
  console.log(`- http://10.74.1.3:${PORT}`);
  
  // Test local immédiat
  const http = require('http');
  http.get(`http://localhost:${PORT}/api/test`, (res) => {
    console.log('\n=== Test local ===');
    console.log('Local test response status:', res.statusCode);
  }).on('error', (err) => {
    console.error('Local test error:', err);
  });
}); 