from flask import Flask, render_template, request
import joblib
import numpy as np

model = joblib.load(open('./ml/finalized_model.sav','rb'))

app = Flask(__name__)
@app.route('/')
def man():
    return render_template('home.ejs')

@app.route('/predict', methods=['POST'])
def home():
    name = request.form['name']
    creditScore = request.form['CreditScore']
    age = request.form['Age']
    tenure = request.form['Tenure']
    balance = request.form['Balance']
    numberOfProducts = request.form['NumberOfProducts']
    hasCrCard = request.form['HasCrCard']
    isActiveMember = request.form['IsActiveMember']
    estimatedSalary = request.form['EstimatedSalary']
    geographyGremany = request.form['Geography_Germany']
    geographySpain = request.form['Geography_Spain']
    gender = request.form['Gender']  

    arr = np.array([[creditScore, age, tenure, balance, numberOfProducts, 
    hasCrCard, isActiveMember, estimatedSalary, geographyGremany,geographySpain, gender]])

    pred = model.predict(arr)
    return render_template('predict.ejs', data= pred)

if __name__ == "__main__":
    app.run(debug=True)