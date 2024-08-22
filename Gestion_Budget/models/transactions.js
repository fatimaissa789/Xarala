
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  montant: { type: Number, required: true },
  type: { type: String, enum: ['depense', 'revenu'], required: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Référence à l'utilisateur
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
