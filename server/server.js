const express = require('express')
const axios = require('axios');
const cors = require('cors')

const app = express()

app.use(cors())

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

app.listen(3001, ()=>{
    console.log("Server is running...");    
})