const db = require('../config/db.config');

const orderController = {
  // Créer une nouvelle commande
  createOrder: async (req, res) => {
    try {
      const { items, total, message } = req.body;
      const userId = req.user.userId;

      // Récupérer les informations de l'utilisateur
      const [users] = await db.query(
        'SELECT name, address FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = users[0];

      // Insérer la commande
      const [orderResult] = await db.query(
        `INSERT INTO orders (user_id, total, status, delivery_name, delivery_address, delivery_message)
         VALUES (?, ?, 'pending', ?, ?, ?)`,
        [userId, total, user.name, user.address, message]
      );

      const orderId = orderResult.insertId;

      // Insérer les items de la commande
      for (const item of items) {
        await db.query(
          `INSERT INTO order_items (order_id, medicament_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.medicamentId, item.quantity, item.price]
        );
      }

      res.status(201).json({
        id: orderId,
        message: 'Commande créée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
  },

  // Récupérer toutes les commandes d'un utilisateur
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.userId;
      const [orders] = await db.query(
        `SELECT o.*, 
                COALESCE(JSON_ARRAYAGG(
                  CASE WHEN oi.id IS NOT NULL THEN
                    JSON_OBJECT(
                      'id', oi.id,
                      'medicamentId', oi.medicament_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', m.name,
                      'image_url', m.image_url
                    )
                  END
                ), '[]') as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN medicaments m ON oi.medicament_id = m.id
         WHERE o.user_id = ?
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [userId]
      );

      // Convertir la chaîne JSON en tableau pour chaque commande
      orders.forEach(order => {
        order.items = JSON.parse(order.items);
      });

      res.json(orders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
  },

  // Récupérer une commande spécifique
  getOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const userId = req.user.userId;

      const [orders] = await db.query(
        `SELECT o.*, 
                COALESCE(JSON_ARRAYAGG(
                  CASE WHEN oi.id IS NOT NULL THEN
                    JSON_OBJECT(
                      'id', oi.id,
                      'medicamentId', oi.medicament_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', m.name,
                      'image_url', m.image_url
                    )
                  END
                ), '[]') as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN medicaments m ON oi.medicament_id = m.id
         WHERE o.id = ? AND o.user_id = ?
         GROUP BY o.id`,
        [orderId, userId]
      );

      if (orders.length === 0) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Convertir la chaîne JSON en tableau
      orders[0].items = JSON.parse(orders[0].items);
      res.json(orders[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
    }
  },

  // Récupérer toutes les commandes (pour l'admin)
  getAllOrders: async (req, res) => {
    try {
      const [orders] = await db.query(
        `SELECT o.*, 
                u.name as user_name,
                u.email as user_email,
                COALESCE(JSON_ARRAYAGG(
                  CASE WHEN oi.id IS NOT NULL THEN
                    JSON_OBJECT(
                      'id', oi.id,
                      'medicamentId', oi.medicament_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', m.name,
                      'image_url', m.image_url
                    )
                  END
                ), '[]') as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN medicaments m ON oi.medicament_id = m.id
         LEFT JOIN users u ON o.user_id = u.id
         GROUP BY o.id
         ORDER BY o.created_at DESC`
      );

      // Convertir la chaîne JSON en tableau pour chaque commande
      orders.forEach(order => {
        order.items = JSON.parse(order.items);
      });

      res.json(orders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
  }
};

module.exports = orderController; 