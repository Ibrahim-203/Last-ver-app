const express = require('express')
const axios = require('axios');
const db = require('./config/dbConfig')
const cors = require('cors')

// Tensorflow librairie
// const tf = require('@tensorflow/tfjs-node');

// Charger le modèle tensorflow
// let model;
// (async () => {
//   model = await tf.loadLayersModel('./model_final.h5');
//   console.log('Modèle chargé avec succès');
// })();

const app = express()
app.use(cors())
app.use(express.json());

// Route pour la prédiction
// app.post('/predict', async (req, res) => {
//   try {
//     // Récupérer les données JSON envoyées depuis React
//     const data = req.body.data;

//     // Convertir les données en un format utilisable par TensorFlow
//     const inputArray = data.map(entry => Object.values(entry));
    
//     // Convertir en tenseur
//     const inputTensor = tf.tensor2d(inputArray);

//     // Faire la prédiction
//     const prediction = model.predict(inputTensor);

//     // Convertir le résultat en tableau JavaScript
//     const predictionArray = prediction.arraySync();

//     // Envoyer la prédiction en format JSON
//     res.json({ prediction: predictionArray }); 
//   } catch (error) {
//     console.error('Erreur lors de la prédiction:', error);
//     res.status(500).json({ error: 'Erreur lors de la prédiction' });
//   }
// });

app.get('/proxy/pvcalc',async (req,res)=>{
    const {latitude, longitude} = req.query
    try {
        const response = await axios.get('https://re.jrc.ec.europa.eu/api/MRcalc', {
          params: {
            lat: latitude,
            lon: longitude,
            horirrad:1,
            startyear : 2023,
            endyear : 2023,
            outputformat : 'json'
          }
        });
        res.json(response.data);
      } catch (error) {
        res.status(500).send('Erreur lors de la requête vers l\'API PVGIS');
      }
})
app.get('/proxy/hour',async (req,res)=>{
    const {latitude, longitude} = req.query
    try {
        const response = await axios.get('https://re.jrc.ec.europa.eu/api/DRcalc', {
          params: {
            lat: latitude,
            lon: longitude,
            month : 1,
            global : 1,
            localtime : 1,
            outputformat : 'json'
          }
        });
        res.json(response.data);
      } catch (error) {
        res.status(500).send('Erreur lors de la requête vers l\'API PVGIS');
      }
})
app.get('/proxy/hourtest',async (req,res)=>{
    const {latitude, longitude} = req.query
    console.log(latitude, longitude);
    
    try {
        const response = await axios.get('https://re.jrc.ec.europa.eu/api/v5_2/seriescalc', {
          params: {
            lat: latitude, 
            lon: longitude, 
            startyear : 2020 ,
            endyear: 2020,
            localtime : 1,
            outputformat : 'json',
          }
        });
        res.json(response.data);
      } catch (error) {
        res.status(500).send('Erreur lors de la requête vers l\'API PVGIS');        
      }
})

app.get("/test", (req, res)=>{
  const query = 'SELECT 1 + 1 AS solution';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Erreur lors de la requête.');
    }
    res.send(`La solution est : ${results[0].solution}`);
  });


  
})

app.post("/insert", (req, res)=>{
  const {nom,prenom,mail, commentaire, satisfaction,recommandation, service} = req.body
  const query = 'INSERT INTO `userinfo`(`nom`, `prenom`,`email` ,`commentaire`, `satisfaction`, `recommandation`,`service`) VALUES (?,?,?,?,?,?,?)';
  db.query(query,[nom,prenom, mail, commentaire, satisfaction, recommandation,service] ,(err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Erreur lors de la requête.');
      
    }else{
      res.status(200).send(results) 
    }
    
  });
})

app.get("/info", (req, res)=>{
  const query = 'SELECT * from `userinfo` order by `created_date` desc limit 3';
  db.query(query ,(err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Erreur lors de la requête.');
      
    }else{
      res.status(200).send(results) 
    }
    
  });
}) 
app.get("/getRegion", async (req, res)=>{
  const {latitude, longitude} = req.query

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse?lat=-19.921712747556207&lon=47.04166419106625")
    res.json(response.data)
  } catch (error) {
    
  }
 
}) 

app.listen(3001, ()=>{
    console.log("Server is running...");     
})