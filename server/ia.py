from flask import Flask, request, jsonify 
from flask_cors import CORS
import joblib
import pandas as pd  # Pour utiliser pandas pour la conversion
import json

# Charger le modèle
model = joblib.load('./model_final.joblib')

app = Flask(__name__)
CORS(app)

# Route pour la prédiction
@app.route('/predict', methods=['POST'])
def predict():
    # Récupérer les données JSON envoyées depuis React
    data = request.json.get('data')
    data = data['data']

    # Initialisation d'un tableau pour toutes les valeurs
    values_list = []

    # Remplissage du tableau avec les valeurs de chaque dictionnaire
    for entry in data:
        values = list(entry.values())  # Extraire les valeurs de chaque entrée
        
        # Convertir en numérique avec pandas (remplace les non-numériques par NaN, puis remplace les NaN par 0)
        numeric_values = pd.to_numeric(pd.Series(values), errors='coerce').fillna(0).tolist()
        
        # Ajouter les valeurs converties dans le tableau final
        values_list.append(numeric_values)
    
    # Utiliser le modèle pour prédire
    result = model.predict(values_list)
    result = result.T
    
    # Renvoyer la prédiction en format JSON
    return jsonify({'prediction': result.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
