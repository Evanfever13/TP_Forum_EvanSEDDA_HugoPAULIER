
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5001;
 
const { createProxyMiddleware } = require("http-proxy-middleware");
 
// proxy avec pathFilter explicite (problème pour recuperer les données sans bug ou bloquage)
app.use(createProxyMiddleware({
    pathFilter: "/api",
    target: "http://localhost:8080",
    changeOrigin: true
}));
 
// fichiers statiques
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));
 
app.use(cors());
app.use(express.json());


// routes
const homeRoutes = require('./scripts/routes/home.routes');
const errorRoutes = require('./scripts/routes/error.routes');
const loginRoutes = require('./scripts/routes/login.routes');
const signupRoutes = require('./scripts/routes/signup.routes');
const submitRoutes = require('./scripts/routes/submit.routes');
const rulesRoutes = require('./scripts/routes/rules.routes');
const profilRoutes = require('./scripts/routes/profil.routes');
const threadsRoutes = require('./scripts/routes/threads.routes');

app.use(homeRoutes);
app.use(errorRoutes);
app.use(loginRoutes);
app.use(signupRoutes);
app.use(submitRoutes);
app.use(rulesRoutes);
app.use(profilRoutes);
app.use(threadsRoutes);

// redirect /
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get("/erreur", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "error.html"));
});
 
// on va faire la gestion d'erreur de page : 404 500 etc..
app.use((req, res) => {
    res.redirect(`/erreur?code=404`);
});

// 500
app.use((err, req, res, next) => {
    console.error(err);
    res.redirect(`/erreur?code=500`);
});


 
// lance
app.listen(port, () => {
    console.log(`Serveur FRONTEND démarré sur le port ${port}`);
    console.log(`http://localhost:${port}`);
});
 