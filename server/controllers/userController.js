const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');


const { enregistrerArrivee } = require('../services/pointageService');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete';

module.exports = {
  async register(req, res) {
    // Ton code d'inscription...
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Recherche user + employee
      const user = await User.findOne({
        where: { email },
        include: Employee,
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Vérifier mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Debug
      console.log("id_employee récupéré :", user.id_employee);

      await enregistrerArrivee(user.id_employee);

      // Générer token
      const token = jwt.sign(
        {
          id_user: user.id_user,
          id_employee: user.id_employee,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Réponse
      res.json({
        message: 'Connexion réussie.',
        token,
        user: {
          id_user: user.id_user,
          username: user.username,
          role: user.role,
          employee: user.Employee,
        },
      });

    } catch (error) {
      console.error("Erreur login :", error);
      res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
  },
};
