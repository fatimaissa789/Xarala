// // script.js

// let budget = 0;
// let totalIncome = 0;
// let totalExpenses = 0;

// // Fonction pour mettre à jour les cartes
// function updateCards() {
//     const balance = budget + totalIncome - totalExpenses;
//     document.getElementById('balance').textContent = balance.toFixed(2) + ' CFA';
//     document.getElementById('expense').textContent = totalExpenses.toFixed(2) + ' CFA';
//     document.getElementById('budget').textContent = budget.toFixed(2) + ' CFA';
// }

// // Fonction pour mettre à jour les dépenses totales
// function updateTotalExpenses() {
//     totalExpenses = 0;
//     document.querySelectorAll('#expenses-list tr').forEach(row => {
//         totalExpenses += parseFloat(row.cells[1].textContent);
//     });
//     document.getElementById('total-amount').innerText = totalExpenses.toFixed(2) + ' CFA';
//     updateCards();
// }

// // Fonction pour mettre à jour les revenus totaux
// function updateTotalIncome() {
//     totalIncome = 0;
//     document.querySelectorAll('#income-list tr').forEach(row => {
//         totalIncome += parseFloat(row.cells[1].textContent);
//     });
//     updateCards();
// }

// // Supprimer une dépense
// function removeExpense(button) {
//     const row = button.closest('tr');
//     row.remove();
//     updateTotalExpenses();
// }

// // Supprimer un revenu
// function removeIncome(button) {
//     const row = button.closest('tr');
//     row.remove();
//     updateTotalIncome();
// }

// // Appel initial pour mettre à jour les cartes
// updateCards();
