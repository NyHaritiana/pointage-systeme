const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete';

module.exports = {
  async register(req, res) {
    try {
      const { username, email, password, role, id_employee } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email déjà utilisé.' });
      }

      const employee = await Employee.findByPk(id_employee);
      if (!employee) {
        return res.status(404).json({ message: 'Employé introuvable.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'employe',
        id_employee,
      });

      res.status(201).json({
        message: 'Compte créé avec succès.',
        user: {
          id_user: newUser.id_user,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création du compte.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email }, include: Employee });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      const token = jwt.sign(
        {
          id_user: user.id_user,
          id_employee: user.id_employee,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '8h' } 
      );

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
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
  },
};
