# banque_api - NodeJS - AARON SAKSIK

## Présentation de l'application.

Cette application bancaire offre la possibilité de créer un compte user et d'établir plusieurs comptes bancaires associés. Les utilisateurs peuvent y déposer des fonds, effectuer des retraits, et réaliser des transferts d'argent entre leurs différents comptes. Chaque transaction réalisée, que ce soit un dépôt, un retrait ou un transfert, génère automatiquement une nouvelle opération qui est immédiatement ajoutée à l'historique des transactions du compte concerné.

## Installation et lancement de l'app.

### 1. Créer un `.env` à la racine:

```
PORT=3030
MONGO_URI="mongodb+srv://saksik95:QCmrSRSg82hkgjvq@cluster0.c5usrvr.mongodb.net/?retryWrites=true&w=majority"
SECRET_JWT="ITINOVBANQUEAPI"
```

### 2. Commandes:

```
npm install
npm run dev
```

