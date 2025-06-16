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
const statsRoutes = require('./routes/stats.routes');

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
  'http://localhost:5001',
  'http://localhost:64108',
  'http://localhost:*',  // Autoriser tous les ports locaux
  'http://10.74.1.3:3000',
  'http://10.74.1.3:8080',
  'http://10.74.1.3:5001',
  'http://10.74.2.202:5001',
  'http://10.74.3.246:*',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'http://localhost:56285'
];

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origine (comme les requêtes mobiles)
    if (!origin) return callback(null, true);
    
    // Autoriser toutes les origines localhost
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith(':*')) {
        const baseOrigin = allowedOrigin.replace(':*', '');
        return origin.startsWith(baseOrigin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      console.log('Origine bloquée par CORS:', origin);
      console.log('Origines autorisées:', allowedOrigins);
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
    
    // Autoriser toutes les origines localhost
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith(':*')) {
        const baseOrigin = allowedOrigin.replace(':*', '');
        return origin.startsWith(baseOrigin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      console.log('Origine bloquée par CORS (preflight):', origin);
      console.log('Origines autorisées:', allowedOrigins);
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
  console.log(`\n=== Nouvelle requête ===`);
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Méthode: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`IP: ${req.ip}`);
  console.log(`Headers:`, req.headers);
  console.log(`Body:`, req.body);
  console.log(`Origin: ${req.headers.origin}`);
  console.log(`Referer: ${req.headers.referer}`);
  console.log(`User-Agent: ${req.headers['user-agent']}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medicaments', medicamentRoutes);
app.use('/api/users', userRoutes);
app.use('/api', statsRoutes);

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

// Middleware de gestion des erreurs amélioré
app.use((err, req, res, next) => {
  console.error('\n=== Erreur serveur ===');
  console.error('Date:', new Date().toISOString());
  console.error('URL:', req.url);
  console.error('Méthode:', req.method);
  console.error('IP:', req.ip);
  console.error('Headers:', req.headers);
  console.error('Body:', req.body);
  console.error('Erreur:', err);
  
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
    console.error('Erreur CORS - Origin:', req.headers.origin);
    console.error('Origines autorisées:', allowedOrigins);
    return res.status(403).json({ 
      message: 'Accès non autorisé',
      error: 'CORS_ERROR',
      details: {
        origin: req.headers.origin,
        allowedOrigins: allowedOrigins
      }
    });
  }
  
  // Erreur par défaut
  res.status(err.status || 500).json({ 
    message: 'Une erreur est survenue sur le serveur',
    error: err.message || 'INTERNAL_SERVER_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
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
  console.log(`- http://localhost:${PORT}`);
 
  
  // Test local immédiat
  const http = require('http');
  http.get(`http://localhost:${PORT}/api/test`, (res) => {
    console.log('\n=== Test local ===');
    console.log('Local test response status:', res.statusCode);
  }).on('error', (err) => {
    console.error('Local test error:', err);
  });
}); 