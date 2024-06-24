// Récupère les éléments du DOM nécessaires
const budgetElement = document.getElementById("budget"); // Élément affichant le budget
const expenseElement = document.getElementById("expense"); // Élément affichant les dépenses totales
const benefitsElement = document.getElementById("benefits"); // Élément affichant le solde
const depensesList = document.getElementById("depenses-list"); // Liste des dépenses
const revenueList = document.getElementById("revenue-list"); // Liste des revenus

// Initialise le budget et les transactions depuis le localStorage, ou à défaut, avec des valeurs par défaut
let budget = parseFloat(localStorage.getItem("budget")) || 0; // Récupère le budget depuis le localStorage ou initialise à 0
let transactions = JSON.parse(localStorage.getItem("transactions")) || {
  depenses: [],
  revenues: [],
}; // Récupère les transactions depuis le localStorage ou initialise avec des tableaux vides

// Gestionnaire d'événement pour le formulaire de définition du budget
document
  .getElementById("budget-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche la soumission du formulaire (pour éviter le rechargement de la page)
    const initialBudget = parseFloat(
      document.getElementById("initial-budget").value
    ); // Récupère la valeur du champ de budget initial et la convertit en nombre
    if (!isNaN(initialBudget) && initialBudget >= 0) {
      // Vérifie si la valeur est un nombre valide et supérieure ou égale à 0
      budget = initialBudget; // Met à jour la variable de budget
      localStorage.setItem("budget", budget); // Stocke le budget dans le localStorage pour une utilisation future
      budgetElement.textContent = budget.toFixed(2) + " FCFA"; // Met à jour l'affichage du budget sur la page
      updateBalance(); // Met à jour le solde et les dépenses totales
      document.getElementById("budget-form").style.display = "none"; // Masque le formulaire après définition du budget pour éviter une réinitialisation accidentelle
    }
  });

// Fonction pour mettre à jour le solde et les dépenses totales
function updateBalance() {
  const totalDepenses = transactions.depenses.reduce(
    (sum, item) => sum + item.amount,
    0
  ); // Calcule le total des dépenses
  const totalRevenues = transactions.revenues.reduce(
    (sum, item) => sum + item.amount,
    0
  ); // Calcule le total des revenus
  const balance = budget + totalRevenues - totalDepenses; // Calcule le solde

  expenseElement.textContent = totalDepenses.toFixed(2) + " FCFA"; // Met à jour l'affichage des dépenses totales
  benefitsElement.textContent = balance.toFixed(2) + " FCFA"; // Met à jour l'affichage du solde
}

// Fonction pour supprimer une transaction
function deleteTransaction(type, id) {
  transactions[type] = transactions[type].filter(
    (transaction) => transaction.id !== id
  ); // Filtrage pour supprimer la transaction spécifiée
  localStorage.setItem("transactions", JSON.stringify(transactions)); // Met à jour les transactions dans le localStorage
  updateBalance(); // Met à jour le solde et les dépenses totales
  renderTransactions(type); // Réaffiche les transactions mises à jour
}

// Fonction pour afficher les transactions
function renderTransactions(type) {
  const list = type === "depenses" ? depensesList : revenueList; // Sélectionne la liste des dépenses ou des revenus en fonction du type
  list.innerHTML = ""; // Vide le contenu actuel de la liste

  transactions[type].forEach((transaction) => {
    // Boucle à travers chaque transaction du type spécifié
    const transactionItem = document.createElement("tr"); // Crée un nouvel élément de ligne de tableau
    transactionItem.innerHTML = `
            <td>${transaction.title}</td>
            <td class="amount">${transaction.amount.toFixed(2)} FCFA</td>
            <td class="actions"><button class="delete" onclick="deleteTransaction('${type}', ${
      transaction.id
    })">supprimer</button></td>
        `; // Définit le contenu HTML de la ligne avec titre, montant et bouton de suppression
    list.appendChild(transactionItem); // Ajoute la ligne à la liste affichée sur la page
  });
}

// Initialisation avec les transactions stockées
renderTransactions("depenses"); // Affiche les transactions de dépenses
renderTransactions("revenues"); // Affiche les transactions de revenus
updateBalance(); // Met à jour le solde et les dépenses totales

// Affiche le budget initial s'il est déjà défini
if (budget > 0) {
  budgetElement.textContent = budget.toFixed(2) + " FCFA"; // Met à jour l'affichage du budget initial
  document.getElementById("budget-form").style.display = "none"; // Masque le formulaire si le budget est déjà défini
}
