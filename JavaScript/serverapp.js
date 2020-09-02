const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
var path = require("path");
var dataPath = "../database/data.db";
const {check, validationResult} = require('express-validator');
var sqlite = require('sqlite3').verbose();
const session = require('express-session');
const util = require('util');
var dataUtil = require('./data');
var multer = require('multer');
var upload = multer();
var file = require('express-fileupload');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.urlencoded());
app.use(express.static("./"));
app.use(session({secret: 'cum', saveUninitialized: true, resave: true}));
app.set('views', path.join(__dirname, '/../HTML'));
app.use(express.static(__dirname + '/../HTML/'));
app.set('view engine', 'ejs');
app.use(file());

console.log("PWD:" + __dirname);

app.get ('/', (req, res) => {
    res.redirect('/form');
});

app.get ('/form', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/index.html'));
});

app.get ('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/home.html'));
});

app.get('/prog', (req, res) => {
    res.render(path.join(__dirname + '/../HTML/prog.ejs'));
});

app.get('/marque', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/marque.html'));
});

app.get('/location', (req, res) => {
    db = dataUtil.__open_data(dataPath);
    dataUtil._get_data_from(db, "users");
    res.render(path.join(__dirname + '/../HTML/location.ejs'), {data : {test: ['Peugeot 208-Diesel', 'Peugeot 209-Diesel', 'Peugeot 210-Diesel', 'Peugeot 211-Diesel', 'Peugeot 212-Diesel']}});
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/contact.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname + '/../HTML/profile.html'));
});

app.post('/submit_form', [
    check('email').isEmail().trim().withMessage('Email is not valid'),
    check('password').isLength({min : 5}).trim().withMessage('Password must be 5 character length')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        res.redirect('/form');
    } else {
        const email = req.body.email;
        const password = req.body.password;
        db = dataUtil.__open_data(dataPath);
        dataUtil.__insert_data_user(db, email, password);
        dataUtil.__db_close(db);
        res.redirect('/home');
    }
});

app.post('/send_car', upload.single('textarea'), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return errors;
    else {
        const first = req.body.first;
        const name = req.body.name;
        const marque = req.body.marque;
        const modele = req.body.modele;
        const place = req.body.place;
        const porte = req.body.porte;
        const carburant = req.body.carburant;
        const lieu = req.body.lieu;
        const prix = req.body.prix;

        dataUtil.__file_upload(req, res);

        console.log(`Monsieur ${first} ${name}, voiture ${marque} de modèle ${modele} avec ${place} et ${porte} 
        utilisant du ${carburant} se situe a ${lieu} pour le prix de ${prix} par jour.`);
    }
});

app.listen(PORT,console.log('App listening on localhost:'+ PORT));