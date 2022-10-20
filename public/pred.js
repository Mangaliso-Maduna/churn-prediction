document.addEventListener('alpine:init', () => {
    // Alpine.store()
    Alpine.data('app', function () {
        return {
            message:'',
            name:'',
            CreditScore:'',
            Age:'',
            Tenure:'',
            Balance:'',
            NumberOfProducts:'',
            HasCrCard:'',
            IsActiveMember:'',
            EstimatedSalary:'',
            Geography_Germany:'',
            Gender:'',
        
            predict() {
                let body = {
                    name:this.name,
                    CreditScore: this.CreditScore,
                    Age: this.Age,
                    Tenure: this.Tenure,
                    Balance: this.Balance,
                    NumberOfProducts: this.NumberOfProducts,
                    HasCrCard: this.HasCrCard,
                    IsActiveMember: this.IsActiveMember,
                    EstimatedSalary: this.EstimatedSalary,
                    Geography_Germany: this.Geography_Germany,
                    Gender: this.Gender
                }
                const formData = new FormData()
                formData.append('CreditScore',this.CreditScore)
                formData.append('Age', this.Age)
                formData.append('Tenure', this.Tenure)
                formData.append('Balance', this.Balance)
                formData.append('NumberOfProducts', this.NumberOfProducts)
                formData.append('HasCrCard', this.HasCrCard)
                formData.append('IsActiveMember', this.IsActiveMember)
                formData.append('EstimatedSalary', this.EstimatedSalary)
                formData.append('Geography_Germany', this.Geography_Germany)
                formData.append('Gender', this.Gender)

                axios.post('http://127.0.0.1:5000/api/predict',formData).then(predResults=>{
                    console.log(predResults.data)
                    this.message = predResults.data.message

                })
                console.log('predicting customer.....')
            }

        }
    })
})