const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: {
        type: String
    },
    Age: {
        type: Number
    },
    CreditScore: {
        type: Number
    },
    Geography: {
        type: String,
        enum: ['France','Germany','Spain']
    },
    Gender: {
        type: String,
        enum: ['Male','Female']
    },
    Tenure: {
        type: Number,
        min: 0

    },
    Balance: {
        type: Number
    },
    NumberOfProducts: {
        type: Number
    },
    HasCrCard: {
        type: Number,
        enum: [1,0]
    },
    IsActiveMember: {
        type: Number,
        enum: [1,0]
    },
    EstimatedSalary: {
        type: Number
    }
});



module.exports = mongoose.model('Customer',CustomerSchema)