const mysql = require("mysql2")
const dotenv = require('dotenv');

dotenv.config()

// Création d'une base de données mysql
const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
})


// connecter à la base de données mysql
db.connect((err)=>{
    if(err){
        console.error('Erreur de connection à la base de données:', err);
        return;
        
    }
    console.log("connecté à la base de données mysql.");
    
})

module.exports = db