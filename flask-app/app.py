from flask import Flask, render_template, request,redirect, url_for
import pickle
import numpy as np

model = pickle.load(open('./ml/finalized_model.pkl','rb'))

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/predict', methods=['GET','POST'])
def predict():
    prediction_msg=''
    if request.method == 'POST':
        name = request.form['name']
        creditScore = request.form['CreditScore']
        age = request.form['Age']
        tenure = request.form['Tenure']
        balance = request.form['Balance']
        numberOfProducts = request.form['NumberOfProducts']
        hasCrCard = request.form['HasCrCard']
        isActiveMember = request.form['IsActiveMember']
        estimatedSalary = request.form['EstimatedSalary']
        Geography_Germany = request.form['Geography_Germany']
        if(Geography_Germany == 'Germany'):
            Geography_Germany = 1
            Geography_Spain= 0
            Geography_France = 0
                    
        elif(Geography_Germany == 'Spain'):
            Geography_Germany = 0
            Geography_Spain= 1
            Geography_France = 0
            
        else:
            Geography_Germany = 0
            Geography_Spain= 0
            Geography_France = 1

        genderMale = request.form['Gender']
        if(genderMale == 'Male'):
                genderMale = 1
                genderFemale = 0
        else:
                genderMale = 0
                genderFemale = 1  

        arr = [[creditScore, age, tenure, balance, numberOfProducts, 
        hasCrCard, isActiveMember, estimatedSalary, Geography_Germany,Geography_Spain, genderMale]]

        prediction = model.predict(arr)
        if(prediction==1):
            prediction_msg = 'The Customer will leave the bank'
        else:
            prediction_msg = 'The Customer will NOT leave the bank'

    return render_template('home.html', prediction_msg=prediction_msg)

if __name__ == "__main__":
    app.run(debug=True,use_reloader=True)