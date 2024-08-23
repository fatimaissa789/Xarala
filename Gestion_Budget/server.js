const express = require("express"); // Importation du framework Express
const cors = require("cors"); // Importation du middleware CORS
const mongoose = require("mongoose"); // Importation de Mongoose pour MongoDB
const bodyParser = require("body-parser"); // Importation du middleware body-parser
const User = require('./models/user'); // Modèle pour les utilisateurs
const Transaction = require('./models/transactions'); // Modèle pour les transactions
const jwt = require('jsonwebtoken'); // Importation de la bibliothèque JWT

const app = express(); // Création de l'application Express
app.use(bodyParser.json()); // Middleware pour analyser le corps des requêtes JSON
app.use(cors()); // Activation de CORS pour permettre les requêtes inter-domaines

// Connexion à MongoDB
mongoose.connect('mongodb+srv://xarala:YmkOS4RmBo8szbBH@cluster0.dlt6k.mongodb.net/')
  .then(() => console.log('Connected to MongoDB')) // Message de succès
  .catch(err => console.error('Could not connect to MongoDB', err)); // Gestion des erreurs

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Récupération de l'en-tête d'autorisation
  const token = authHeader && authHeader.split(' ')[1]; // Extraction du token
  if (token == null) return res.sendStatus(401); // Si pas de token, renvoie 401

  jwt.verify(token, 'your_jwt_secret', (err, user) => { // Vérification du token
    if (err) return res.sendStatus(403); // Si erreur, renvoie 403
    req.user = user; // Ajout de l'utilisateur dans la requête
    next(); // Passe au middleware suivant
  });
};

// Middleware pour vérifier les rôles
const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.sendStatus(403); // Vérification des rôles
  next(); // Passe au middleware suivant
};

// Routes CRUD pour les transactions
app.post('/transactions', authenticateToken, async (req, res) => { 
    try {
      const { titre, montant, type } = req.body;
  
      // Validation des données d'entrée
      if (!titre || !montant || !type) {
        return res.status(400).send('Invalid data');
      }
  
      // Assurer que le montant est un nombre
      if (isNaN(montant)) {
        return res.status(400).send('Montant must be a number');
      }
  
      const transaction = new Transaction({
        titre,
        montant,
        type,
        user: req.user.userId 
      });
  
      await transaction.save(); 
      res.status(201).send(transaction); 
  
    } catch (err) {
      console.error(err); // Log de l'erreur pour le développement
      res.status(500).send('Server error'); 
    }
  });
  

// Route pour récupérer toutes les transactions
app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    let transactions;
    if (req.user.role === 'admin') {
      transactions = await Transaction.find(); // Récupération de toutes les transactions pour les admins
    } else {
      transactions = await Transaction.find({ user: req.user.userId }); // Récupération des transactions de l'utilisateur
    }
    res.send(transactions); // Réponse avec les transactions
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

// Route pour récupérer une transaction par ID
app.get('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id); // Recherche de la transaction
    if (!transaction) return res.status(404).send('Transaction not found.'); // Gestion de l'absence de transaction
    
    if (req.user.role === 'admin' || transaction.user.equals(req.user.userId)) {
      res.send(transaction); // Réponse avec la transaction
    } else {
      res.sendStatus(403); // Accès interdit
    }
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

// Route pour supprimer une transaction
app.delete('/transactions/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id); // Suppression de la transaction
    if (!transaction) return res.status(404).send('Transaction not found.'); // Gestion de l'absence de transaction
    res.send(transaction); // Réponse avec la transaction supprimée
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

// Route pour mettre à jour une transaction
app.put('/transactions/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { titre, montant, type } = req.body; // Récupération des données
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { titre, montant, type },
      { new: true } // Renvoie la nouvelle version
    );
    if (!transaction) return res.status(404).send('Transaction not found.'); // Gestion de l'absence de transaction
    res.send(transaction); // Réponse avec la transaction mise à jour
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

// Routes CRUD pour les utilisateurs
app.post('/users/register', async (req, res) => { // Inscription d'un nouvel utilisateur
  try {
    const { username, email, password, role } = req.body; // Récupération des données
    const user = new User({ username, email, password, role }); // Création de l'utilisateur
    await user.save(); // Sauvegarde de l'utilisateur
    res.status(201).send({ message: 'User registered successfully' }); // Réponse de succès
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

app.post('/users/login', async (req, res) => { // Connexion d'un utilisateur
  try {
    const { email, password } = req.body; // Récupération des données
    const user = await User.findOne({ email }); // Recherche de l'utilisateur
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send('Invalid email or password'); // Gestion des erreurs
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' }); // Création du token
    res.send({ token }); // Réponse avec le token
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

app.get('/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => { // Récupération d'un utilisateur par ID
  try {
    const user = await User.findById(req.params.id); // Recherche de l'utilisateur
    if (!user) return res.status(404).send('User not found.'); // Gestion de l'absence d'utilisateur
    res.send(user); // Réponse avec l'utilisateur
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

app.put('/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => { // Mise à jour d'un utilisateur
  try {
    const { username, email, password, role } = req.body; // Récupération des données
    const user = await User.findById(req.params.id); // Recherche de l'utilisateur
    if (!user) return res.status(404).send('User not found.'); // Gestion de l'absence d'utilisateur
    if (password) {
      user.password = password; // Mise à jour du mot de passe
      await user.save();
    }
    user.username = username || user.username; // Mise à jour du nom d'utilisateur
    user.email = email || user.email; // Mise à jour de l'email
    user.role = role || user.role; // Mise à jour du rôle
    await user.save(); // Sauvegarde des modifications
    res.send(user); // Réponse avec l'utilisateur mis à jour
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

app.delete('/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => { // Suppression d'un utilisateur
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Suppression de l'utilisateur
    if (!user) return res.status(404).send('User not found.'); // Gestion de l'absence d'utilisateur
    
    // Supprimer les transactions associées
    await Transaction.deleteMany({ _id: { $in: user.transactions } }); // Suppression des transactions de l'utilisateur
    
    res.send(user); // Réponse avec l'utilisateur supprimé
  } catch (err) {
    res.status(500).send('Server error'); // Gestion des erreurs
  }
});

// Lancer le serveur
const port = process.env.PORT || 4000; // Port d'écoute
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`); // Message de démarrage du serveur
});
