
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5001;
 
const { createProxyMiddleware } = require("http-proxy-middleware");
 
// proxy avec pathFilter explicite (compatible http-proxy-middleware v4)
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
 
app.use(homeRoutes);
app.use(errorRoutes);
app.use(loginRoutes);
app.use(signupRoutes);
 
// redirect /
app.get('/', (req, res) => {
    res.redirect('/home');
});
 
// lance
app.listen(port, () => {
    console.log(`Serveur FRONTEND démarré sur le port ${port}`);
    console.log(`http://localhost:${port}`);
});
 