
const db = require('../config/db.config');


//GB, Here we get the cart of the user by the id

exports.getSpecificUserCart = async (req, res) => {
    try {
      const [cartItems] = await db.query(
        `SELECT ci.*, m.name, m.price, m.image_url 
         FROM cart_items ci 
         JOIN medicaments m ON ci.medicament_id = m.id 
         WHERE ci.user_id = ?`,
        [req.userId]
      );
  
      res.json(cartItems);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
}



//GB, Here the user can add a item to his cart

exports.addProductToOneSpecificUserCart = async (req, res) => {
    try {
      const { medicamentId, quantity } = req.body;
  
      // Verify an existing medicament 
      const [medicament] = await db.query('SELECT * FROM medicaments WHERE id = ?', [medicamentId]);
      if (medicament.length === 0) {
        return res.status(404).json({ message: 'Médicament non trouvé' });
      }
  
      //Verify elements left in the stock
      if (medicament[0].stock < quantity) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
  
      // Verify an existing article already in cart
      const [existingItem] = await db.query(
        'SELECT * FROM cart_items WHERE user_id = ? AND medicament_id = ?',
        [req.userId, medicamentId]
      );
  
      if (existingItem.length > 0) {
        // update the quantity
        await db.query(
          'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND medicament_id = ?',
          [quantity, req.userId, medicamentId]
        );
      } else {
        // Add new article
        await db.query(
          'INSERT INTO cart_items (user_id, medicament_id, quantity) VALUES (?, ?, ?)',
          [req.userId, medicamentId, quantity]
        );
      }
  
      res.json({ message: 'Médicament ajouté au panier avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
    }
}




//GB, Here we update the quantity of an specific item in the cart 

exports.updateOneSpecificCartItemQuantity = async (req, res) => {
    try {
      const { quantity } = req.body;
  
      // verify an existing article in the cart
      const [cartItem] = await db.query(
        'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId]
      );
  
      if (cartItem.length === 0) {
        return res.status(404).json({ message: 'Article non trouvé dans le panier' });
      }
  
      // verify the stock
      const [medicament] = await db.query(
        'SELECT stock FROM medicaments WHERE id = ?',
        [cartItem[0].medicament_id]
      );
  
      if (medicament[0].stock < quantity) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
  
      // update the quantity
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [quantity, req.params.id]
      );
  
      res.json({ message: 'Quantité mise à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité' });
    }
}


//GB, Here we delete one specific item in the cart stored in database 

exports.deleteOneSpecificCartItem = async (req, res) => {
    try {
      await db.query(
        'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId]
      );
  
      res.json({ message: 'Article supprimé du panier avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
    }
}



//GB, Here we clear all the data in the user cart

exports.clearOneSpecificUserCart = async (req, res) => {
    try {
      await db.query('DELETE FROM cart_items WHERE user_id = ?', [req.userId]);
      res.json({ message: 'Panier vidé avec succès' });
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      res.status(500).json({ message: 'Erreur lors du vidage du panier' });
    }
  }