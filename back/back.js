var express = require('express');

var app = express();

var morgan = require('morgan');

var http = require('http').Server(app);

var router = express.Router();

var cors = require('cors');

//var mongod = require('./models/mongod');



var port_ecoute = 3000;



//Body parser

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


//Enable CORS
app.use(cors());

//Chargement des APIs

var mongo = require('./routes/api_mongo');

app.use('/mongo', mongo);

// Enrichissement de la base
//mongod.processActors();

//Ecoute du port 3000

http.listen(port_ecoute, function(){

        console.log('port '+port_ecoute+' en ecoute');

});

                                                                // Suivi console

app.use(morgan('dev'));