const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');


const { enregistrerArrivee } = require('../services/pointageService');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete';

module.exports = {
  async register(req, res) {
    try {
      const { username, email, password, id_employee, role } = req.body;

      // Vérifier champs
      if (!username || !email || !password || !id_employee) {
        return res.status(400).json({ message: "Champs manquants." });
      }

      // Vérifier si email existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      // Vérifier si employee existe réellement
      const employee = await Employee.findByPk(id_employee);
      if (!employee) {
        return res.status(400).json({ message: "Employé introuvable." });
      }

      // Hasher mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        id_employee,
        role: role || "employe",
      });

      // Réponse
      res.json({
        message: "Utilisateur créé avec succès.",
        user: {
          id_user: newUser.id_user,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          employee: employee,
        }
      });

    } catch (error) {
      console.error("Erreur register :", error);
      res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
  }
,

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
