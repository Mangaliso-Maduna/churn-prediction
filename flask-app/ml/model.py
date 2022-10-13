import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score,recall_score,f1_score
from sklearn.ensemble import RandomForestClassifier
import joblib
from imblearn.over_sampling import SMOTE
sns.set()

data = pd.read_csv('churn.csv')
print('number of rows:',data.shape[0])
print('number of columns:',data.shape[1])
data.info()
data.columns

data = data.drop(['RowNumber', 'CustomerId', 'Surname'],axis=1)

data = pd.get_dummies(data,drop_first=True)

X = data.drop(['Exited'],axis=1)
y = data['Exited']


sns.countplot(y)

#handling imbalances (over sampling) SMOTE


X_res, y_res = SMOTE().fit_resample(X,y)


#split dataset into train and test set
X_train,X_test,y_train,y_test=train_test_split(X_res,y_res,test_size=0.2,random_state=42)

#feature Scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


#Logistic regression
log_reg = LogisticRegression()
log_reg.fit(X_train,y_train)

y_pred = log_reg.predict(X_test)
#(accuracy_score)
accuracy_score(y_test,y_pred)
precision_score(y_test,y_pred)

#models ability to predict correctly the positives out of the actual positives
recall_score(y_test,y_pred)



rfc = RandomForestClassifier()
rfc.fit(X_train,y_train)

y_pred2 = rfc.predict(X_test)
accuracy_score(y_test,y_pred2)

precision_score(y_test,y_pred2)

final_data = pd.DataFrame({'Models':['Logistic Reg','RFC'],
                          'Accuracy':[accuracy_score(y_test,y_pred),
                                     accuracy_score(y_test,y_pred2)
                        ]});

print(final_data)

#save model
X_res = scaler.fit_transform(X_res)
rfc.fit(X_res,y_res)

filename = 'finalized_model.sav'
joblib.dump(rfc,open(filename,'wb'))

joblib.dump(rfc,filename)

model = joblib.load(filename)

input_data = [[800,65,4,0,0,0,1,101348.88,0,0,0]]

prediction = model.predict(input_data)
print(prediction)

if (prediction[0] == 0):
  print('The person is will not churn')
else:
  print('The person has churned')