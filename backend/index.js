const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

//connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Database connection failed:', err));
  
const app = express();
app.use(cors());
app.use(bodyParser.json());

//User Schema
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        unique: true,
        required: true
    },
    score:{
        type: Number,
        default : 0
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

//Challenge Schema

const challengeSchema = new mongoose.Schema({
    inviter:{
        type: String,
        required: true
    },
    invitee:{
        type: String,
    },
    score:{
        type: Number,
        required: true
    },
    inviteLink:{
        type: String,
        required: true
    },
},{timestamps: true});

const Challenge = mongoose.model('Challenge', challengeSchema);

//Trivia Model
const triviaSchema = new mongoose.Schema({
    city: {type: String, required: true},
    country: {type: String, required: true},
    clues: [String],
    fun_fact: [String],
    trivia: [String],

}, {timestamps: true});
const Trivia = mongoose.model('Trivia', triviaSchema);

//Read JSON File
const jsonFile = path.join(__dirname,'Dataset.json');
const triviaData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

//Seed database
const seedDatabase = async()=>{
    try{
        await Trivia.deleteMany(); //clears old data
        await Trivia.insertMany(triviaData);
        console.log('Data seeded');
    }catch(error){
        console.error('Error seeding', error);
    }
}
seedDatabase();

//User Routes
app.post('/api/user/register', async(req, res)=> {
    try {
        const { username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Create new user
        const user = await User.create({ username });
        res.status(201).json(user);
    } catch (error) {
        console.error("Error registering user:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            res.status(400).json({ error: "Username already exists" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

app.get('/api/user/:username/score', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ score: user.score });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})


//Challenge Routes

app.post('/api/challenges/create', async(req,res)=>{
    try{
        const {inviter, score} = req.body;
        const inviteLink = `https://yourapp.com/challenge/${inviter}-${Date.now()}`;
        const challenge = await Challenge.create({inviter, score, inviteLink});
        res.status(201).json(challenge);
    }catch(error){
        res.status(500).json({error: 'Error creating challenge'});
    }
});

app.get('/api/challenges/:id', async(req,res)=>{
    try{
        const challenge = await Challenge.findById(req.params.id);
        if(!challenge) return res.status(404).json({error:'Challenge not found'});
        res.json(challenge);
    }catch(error){
        res.status(500).json({error:'Server error'});
    }
});


//Trivia routes

app.get('/api/trivia/random', async(req,res)=> {
    try{
        const count = await Trivia.countDocuments();
        const random = Math.floor(Math.random()* count);
        const trivia = await Trivia.findOne().skip(random);
        if(!trivia) return res.status(404).json({error:'No trivia found'});

        const options = await Trivia.aggregate([{$sample: {size:3}}]);
        options.push(trivia);
        options.sort(()=> Math.random()-0.5);

        res.json({
            clues: trivia.clues.slice(0,2),
            options: options.map(opt => ({city: opt.city, country:opt.country})),
            correctAnswer: trivia.city,
            funFact: trivia.fun_fact[Math.floor(Math.random() * trivia.fun_fact.length)]
        });
    }catch(error){
        res.status(500).json({error:'Error retrieving trivia'});
    }
});

app.post('/api/trivia/answer', async(req,res)=> {
    try{
        const {username, selectedAnswer, correctAnswer} = req.body;
        const user = await User.findOne({ username });
        if(!user) return res.status(404).json({error: 'User not found'});

        let isCorrect = selectedAnswer === correctAnswer;
        if(isCorrect){
            user.score += 10;
            await user.save();
        }
        const trivia = await Trivia.findOne({city: correctAnswer});
        const funFact = trivia? trivia.fun_fact[Math.floor(Math.random() * trivia.fun_fact.length)]: "No fun fact available.";

        res.json({
            isCorrect,
            feedback : isCorrect ?
            '🎉 Correct! Here is a fun fact:' : '😢 Incorrect! Here is a fun fact:',
            funFact
        });
    }catch(error){
        res.status(500).json({error: 'Error processing answer'});
    }
});

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on PORT : ${PORT}`));