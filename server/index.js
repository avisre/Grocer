const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const FoodModel = require("./models/Food");
const app = express();



app.use(cors());

app.use(express.json());

mongoose.connect('mongodb+srv://project:project@cluster0.kos1k7l.mongodb.net/db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/insert', async (req, res) => {
    const { count, num, metric } = req.body;
    const food = new FoodModel({ foodName: count, quantity: num, metrics: metric });
    try {
        await food.save();
        const updatedList = await FoodModel.find();
        res.send(updatedList);
    } catch (error) {
        console.log(error);
    }
})

app.put('/update', async (req, res) => {
    const { name, id } = req.body;

    try {
        await FoodModel.findOneAndUpdate({ _id: id }, { foodName: name });
        res.send('update');


    } catch (error) {
        console.log(error);
    }
})

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await FoodModel.findByIdAndDelete(id);
        const updatedList = await FoodModel.find({});
        res.send(updatedList);


    } catch (error) {
        console.log(error);
    }
})

app.get('/read', async (req, res) => {
    try {
        const result = await FoodModel.find({});
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});








const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
