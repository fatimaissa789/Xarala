// index.html
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier s'il y a de nouvelles dépenses ajoutées depuis depenses.html
    const nouvelleDepenseTitre = localStorage.getItem('nouvelleDepenseTitre');
    const nouvelleDepenseMontant = localStorage.getItem('nouvelleDepenseMontant');

    if (nouvelleDepenseTitre && nouvelleDepenseMontant) {
        // Créer une nouvelle ligne de tableau pour la nouvelle dépense
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${nouvelleDepenseTitre}</td>
            <td class="amount">${nouvelleDepenseMontant} FCFA</td>
            <td class="actions"><button class="delete-green">supprimer</button></td>
        `;
        
        // Ajouter la nouvelle ligne à la liste des dépenses
        const depensesList = document.querySelector('#depenses-table tbody');
        depensesList.appendChild(newRow);

        // Effacer les données du stockage local après utilisation
        localStorage.removeItem('nouvelleDepenseTitre');
        localStorage.removeItem('nouvelleDepenseMontant');
    }

    // Vérifier s'il y a de nouveaux revenus ajoutés depuis revenues.html
    const nouveauRevenuTitre = localStorage.getItem('nouveauRevenuTitre');
    const nouveauRevenuMontant = localStorage.getItem('nouveauRevenuMontant');

    if (nouveauRevenuTitre && nouveauRevenuMontant) {
        // Créer une nouvelle ligne de tableau pour le nouveau revenu
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${nouveauRevenuTitre}</td>
            <td class="amount">${nouveauRevenuMontant} FCFA</td>
            <td class="actions"><button class="delete-red">supprimer</button></td>
        `;
        
        // Ajouter la nouvelle ligne à la liste des revenus
        const revenueList = document.querySelector('#revenue-table tbody');
        revenueList.appendChild(newRow);

        // Effacer les données du stockage local après utilisation
        localStorage.removeItem('nouveauRevenuTitre');
        localStorage.removeItem('nouveauRevenuMontant');
    }
});
