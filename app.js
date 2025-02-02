const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('moneyTracker');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
}

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
  try {
    const transactions = await db.collection('transactions').find().sort({ date: -1 }).toArray();
    res.render('index', { transactions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/', async (req, res) => {
  const { description, amount, type } = req.body;
  try {
    await db.collection('transactions').insertOne({
      description,
      amount: parseFloat(amount),
      type,
      date: new Date()
    });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.delete('/:id', async (req, res) => {
  try {
    await db.collection('transactions').deleteOne({ _id: require('mongodb').ObjectId(req.params.id) });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));