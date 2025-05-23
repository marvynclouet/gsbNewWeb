const db = require('../config/db.config');


//GB, Here we a new order

exports.createOrder = async (req, res) => {
    try {
      console.log('reqres', req, res)
      const { items, total, message, userId } = req.body;
      if(!items || !total || !message || !userId ){
        console.log("[POST: createOrder] Some body properties are missing", items ,total ,message ,userId)
        return res.status(500).json({ message: " Some props are missing " })
      }
      
      console.log("Ok")

      // Retrieve user information
      const [users] = await db.query(
        'SELECT name, address FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = users[0];

      // Insert order
      const [orderResult] = await db.query(
        `INSERT INTO orders (user_id, total, status, delivery_name, delivery_address, delivery_message)
         VALUES (?, ?, 'pending', ?, ?, ?)`,
        [userId, total, user.name, user.address, message]
      );

      const orderId = orderResult.insertId;

      // Insert items of order

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
    }
    catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
},



//GB,  Retreive all the orders/commands made b one user

exports.getUserOrders = async (req, res) => {
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

      // Convert
      orders.forEach(order => {
        order.items = JSON.parse(order.items);
      });

      res.json(orders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
  
},



//GB, Retreive an specific command 

exports.getOrder = async (req, res) => {
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

      // Convert
      orders[0].items = JSON.parse(orders[0].items);
      res.json(orders[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
    }
  },


//--------SPECIAL--ADMIN---------------

//GB, Retreive all the command 
exports.getAllOrders = async (req, res) => {
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


//GB, Here we change the status of one order

exports.updateOneSpecificCommandStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Verify an existing order 
    const [orders] = await db.query('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // updtae the status
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    res.json({ message: 'Statut de la commande mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
}



//GB, Here we update one order information

exports.modifyOneSpecificOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { delivery_name, delivery_address, delivery_message, total, items } = req.body;

    // Vérifier si la commande existe
    const [orders] = await db.query('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Mettre à jour les informations de la commande
    await db.query(
      'UPDATE orders SET delivery_name = ?, delivery_address = ?, delivery_message = ?, total = ? WHERE id = ?',
      [delivery_name, delivery_address, delivery_message, total, orderId]
    );

    // Supprimer les anciens items
    await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);

    // Ajouter les nouveaux items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, medicament_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.medicamentId, item.quantity, item.price]
      );
    }

    res.json({ message: 'Commande mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande' });
  }
}


//GB, Here we delete one given specific command

exports.deleteOneSpecificCommand = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Vérifier si la commande existe
    const [orders] = await db.query('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Supprimer d'abord les items de la commande (à cause de la contrainte de clé étrangère)
    await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);

    // Supprimer la commande
    await db.query('DELETE FROM orders WHERE id = ?', [orderId]);

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la commande' });
  }
}