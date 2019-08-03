
var MongoClient = require('mongodb').MongoClient, assert = require('assert');

   var hosts = 'localhost:27017'

//Fonction de création de l'url de connexion en fonction du nom de base de données Mongo DB
function conn_url(){
  return 'mongodb://'+hosts+'/'+"data_201806";
}

//Fonction qui retourne la date du jour (utilisé pour nommer les collections)
function tdy(){
  var today = new Date();
  var dd = today.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      mm = (today.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
      yyyy = today.getFullYear();
  return ""+yyyy+mm+dd+"";
}

// Promise de connexion à la base db_name
function  connection(db_name = "data_201806" ){
  return MongoClient.connect(conn_url(db_name));
};



/*
===============================================================================================================
                                              FONCTIONS EXPORTEES
===============================================================================================================
*/

// Stock des données de prediction 
function storePrediction(prediction){
  var collection_name = "prediction";
  var d = new Date().toLocaleString();

  return connection()
  .then(function(db){
    col = db.collection(collection_name);
    col.insertOne({m_date:d, data:prediction})
    .then(function(r) {
      assert.equal(1, r.insertedCount);
      console.log("Prediction stocké à "+d+" dans la collection : "+collection_name)
      db.close();
    });
  })
}
exports.storePrediction = storePrediction;

// Stock des données historiques entre deux acteurs 
function storeHistory(history){
  var collection_name = "history";
  var d = new Date().toLocaleString();

  return connection()
  .then(function(db){
    col = db.collection(collection_name);
    col.insertOne({m_date:d, data:history})
    .then(function(r) {
      assert.equal(1, r.insertedCount);
      console.log("Historique stocké à "+d+" dans la collection : "+collection_name)
      db.close();
    });
  })
}
exports.storeHistory = storeHistory;

function splitActorsToArray(element){
      var names =[]
      element.forEach(item => {
         CodeToName(item).then( res => { 
          return res

       }).then(res => {
        console.log("RES "+res)
         })
           names.push(res)
       })
         
         return names
    }
exports.splitActorsToArray = splitActorsToArray;

function processActors(){

  var collection_name = "history";
  var names1 =[]
  var names2 =[]
   return connection()
   .then(function(db){
    col = db.collection(collection_name)
    col.find().snapshot().forEach( function (el) {
       splitActorsToArray(el["Actor1Codes"])
       splitActorsToArray(el["Actor2Codes"])
        
        console.log(names1)
        console.log(names2)
       col.save(el);
    })
  
})
}
exports.processActors = processActors;


function CodeToName(code){

var collection_name = "ref_actor";
  return connection()
  .then(function(db){
    col = db.collection(collection_name)
    return col.find({Code:code}, {Nom: 1}).toArray();
    })
  .then(res => { return res[0]["Nom"] } )
}
exports.CodeToName = CodeToName;

function getActors1(){
  var collection_name = "history";

  return connection()
  .then(function(db){
     col = db.collection(collection_name)
     return col.distinct( "Actor1Code" );
   });
}
exports.getActors1 = getActors1;

function getActors2(){
  var collection_name = "history";
 
  return connection() 
  .then(function(db){
     col = db.collection(collection_name)
     return col.distinct( "Actor2Code" );
   });
}
exports.getActors2 = getActors2;

function getActorsCode(){
  var collection_name = "ref_actor";

  return connection()
  .then(function(db){
     col = db.collection(collection_name)
     return col.find({}).toArray();
   });
}
exports.getActorsCode = getActorsCode;

function getAction(code){
  var collection_name = "ref_action";
  return connection()
  .then(function(db){
     col = db.collection(collection_name);
     return col.findOne({"Code":code})
   });
}
exports.getAction = getAction;

function getHistory(actor1,actor2){
  var collection_name = "history";
  return connection()
  .then(function(db){
     col = db.collection(collection_name);
     return col.find({"Actor1Code":actor1, "Actor2Code":actor2}).toArray()
   })
}
exports.getHistory = getHistory;

