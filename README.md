# Prestige du Sahel — site boutique + interface d'administration

Site statique (HTML/CSS/JS) pour la boutique de parfums "Prestige du Sahel",
avec une interface d'administration (`/admin`) qui permet d'ajouter des
photos et de modifier les parfums en cliquant, sans toucher au code.

## Étape 1 — Mettre le code sur GitHub (gratuit)

1. Créez un compte sur https://github.com si vous n'en avez pas.
2. Cliquez sur "New repository", nommez-le par exemple `prestige-du-sahel`,
   laissez-le en "Public" ou "Private", ne cochez rien d'autre, créez-le.
3. Sur la page du dépôt vide, cliquez sur "uploading an existing file"
   et glissez-y **tout le contenu** de ce dossier décompressé
   (pas le dossier lui-même, ce qu'il y a dedans).
4. Validez ("Commit changes").

## Étape 2 — Connecter le dépôt à Netlify (gratuit)

1. Créez un compte sur https://app.netlify.com (vous pouvez vous inscrire
   directement avec votre compte GitHub).
2. Cliquez sur "Add new site" → "Import an existing project" → "GitHub".
3. Choisissez le dépôt `prestige-du-sahel`.
4. Laissez les réglages par défaut (pas de commande de build nécessaire,
   dossier de publication : la racine) et cliquez sur "Deploy".
5. Le site est en ligne avec une adresse du type
   `nom-aleatoire.netlify.app`. Vous pouvez la personnaliser dans
   "Site settings" → "Change site name".

## Étape 3 — Activer l'interface d'administration

1. Dans le tableau de bord Netlify du site, allez dans
   **Site configuration → Identity**, cliquez sur "Enable Identity".
2. Toujours dans Identity → "Registration", choisissez "Invite only"
   (pour que seul vous puissiez créer un compte).
3. Allez dans **Identity → Services → Git Gateway**, cliquez sur
   "Enable Git Gateway".
4. Retournez dans l'onglet **Identity**, cliquez sur "Invite users",
   entrez votre e-mail. Vous recevrez un e-mail d'invitation.
5. Ouvrez le lien reçu par e-mail, choisissez un mot de passe.

## Étape 4 — Utiliser l'administration au quotidien

1. Allez sur `https://votre-site.netlify.app/admin`
2. Connectez-vous avec l'e-mail et le mot de passe créés à l'étape 3.
3. Cliquez sur "Catalogue" → "Parfums" → "catalogue".
4. Pour chaque parfum, vous pouvez cliquer sur le champ "Photo du flacon"
   pour uploader une image directement depuis votre téléphone ou ordinateur,
   et modifier le nom, le prix, la description, les notes olfactives.
5. Cliquez sur "Publish" (ou "Publier") : le site se met à jour
   automatiquement en une à deux minutes, sans rien re-déployer manuellement.

Sans photo ajoutée, un dégradé de couleur s'affiche à la place — le site
reste donc toujours présentable même avant d'avoir toutes les photos.

## Avant de considérer le site comme "prêt"

- Remplacez le numéro WhatsApp placeholder (`221770000000`) dans
  `js/main.js` (ligne ~5) et dans `contact.html` par le vrai numéro.
- Remplacez l'adresse e-mail `contact@prestigedusahel.sn` par la vraie.
- Le formulaire de contact affiche seulement une confirmation visuelle —
  il n'envoie pas réellement d'e-mail. Pour un vrai envoi, il faudrait le
  brancher sur un service comme Formspree, ou le remplacer par un lien
  `mailto:`.

## Mettre à jour le design ou la structure plus tard

Toute modification poussée sur GitHub (via l'upload web ou avec Git en
ligne de commande / VS Code) redéploie automatiquement le site sur Netlify.
L'interface `/admin` ne sert qu'à modifier le contenu du catalogue
(`content/produits.json`) — pas la mise en page.
