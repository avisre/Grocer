const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    foodName: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    metrics: {
        type: String, // Assuming the metric will be a string, adjust the type as needed
        enum: ['Kg', 'L', 'Nos'] // Enum restricts the value to these options
    }

})
const Food = mongoose.model("FoodData", FoodSchema)
module.exports = Food