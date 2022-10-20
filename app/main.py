from flask import Flask, render_template, request,redirect, url_for
import pickle
import joblib
import numpy as np
from flask_cors import CORS
from pathlib import Path
import os.path



model = joblib.load(open(r'C:\Users\manga\Desktop\projects\capstone\Capstone\Smart_Churn\app\Customer_Churn_Prediction.sav','rb'))

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    # return render_template('index.html')
    return {
        'status':'up and running'
    }

@app.post('/api/predict')
def predict():
    message=''
    pred_msg=''
    name = request.form.get('name')
    creditScore = request.form.get('CreditScore')
    age = request.form.get('Age')
    tenure = request.form.get('Tenure')
    balance = request.form.get('Balance')
    numberOfProducts = request.form.get('NumberOfProducts')
    hasCrCard = request.form.get('HasCrCard')
    isActiveMember = request.form.get('IsActiveMember')
    estimatedSalary = request.form.get('EstimatedSalary')
    Geography_Germany = request.form.get('Geography_Germany')
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

    genderMale = request.form.get('Gender')
    if(genderMale == 'Male'):
        genderMale = 1
        genderFemale = 0
    else:
        genderMale = 0
        genderFemale = 1  

    arr = [[creditScore, age, tenure, balance, numberOfProducts, hasCrCard, 
            isActiveMember, estimatedSalary, Geography_Germany,Geography_Spain, genderMale]]

    prediction = model.predict(arr)
    if(prediction==1):
        pred_msg = 'The Customer will leave the bank'
    else:
        pred_msg = 'The Customer will NOT leave the bank'

    message = pred_msg

    return {
        'status':'up and running',
        'message':message
    }

