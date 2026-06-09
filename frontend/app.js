// le fichier le plus important, c'est celui du serveur, c'est lui qui va faire le lien entre les routes et les fonctions, et qui va écouter les requêtes des clients
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8080;

// import de routes
const homeRoutes = require('./scripts/routes/home.routes');
const errorRoutes = require('./scripts/routes/error.routes');
// const loginRoutes = require('./scripts/routes/login.routes');
// const signinRoutes = require('./scripts/routes/signin.routes');
// const threadRoutes = require('./scripts/routes/thread.routes');

// import des données static
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'templates')));

app.use(cors());
app.use(express.json());

// on utilise les routes  
app.use(homeRoutes);
app.use(errorRoutes);
// app.use(loginRoutes);
// app.use(signinRoutes);
// app.use(threadRoutes);

app.listen(port, () => {
    console.log(`Serveur FRONTEND démarré sur le port ${port}`);
    console.log(`Accéder au site : http://localhost:${port}`);
});
