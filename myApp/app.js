var express = require('express');
const session = require('express-session');
var path= require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'farida',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Import MongoDB client from the mongodb package
const { MongoClient } = require('mongodb');

// MongoDB connection URL (replace with your MongoDB URI if needed)
const url = 'mongodb://localhost:27017';  // Local MongoDB instance
const dbName = 'myDB';  // Your database name
let db, collection;

// Initialize MongoDB connection
(async () => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    collection = db.collection('myCollection');

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
})();

// Handle user login
app.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await collection.findOne({ user: username, pass: password });
    if (user) {
      req.session.user = user.user;
      //console.log('Session after login:', req.session); // Debugging
      res.redirect('/home');
    } else {
      res.send('Invalid username or password');
    }
  } catch (err) {
    //console.error('Error during login:', err);
    res.status(500).send('An error occurred during login.');
  }
});

// Handle user registration
app.post('/register', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send('All fields are required!');
  }

  try {
    const userExists = await collection.findOne({ user: username });
    if (userExists) {
      return res.status(404).send('Error: Username already taken!');
    }

    await collection.insertOne({ user: username, pass: password, wantToGoList: [] });
    res.status(404).send(
      'Registration successful! <a href="/login">Go to Login</a>'
    );
  } catch (err) {
    //console.error('Error during registration:', err);
    res.status(500).send('An error occurred during registration.');
  }
});

app.post('/search',function(req,res){
  var x= req.body.search; 
  console.log(x); 
});

app.get('/',function(req,res){
  res.render('login');
})
app.get('/login',function(req,res){
  res.render('login');
})
app.get('/registration',function(req,res){
  res.render('registration');
})
app.get('/annapurna',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('annapurna');
})
app.get('/bali',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('bali');
})
app.get('/cities',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('cities');
})
app.get('/hiking',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('hiking');
})
app.get('/home',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('home');
})
app.get('/inca',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login'); 
  }
  res.render('inca');
})
app.get('/islands',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('islands');
})
app.get('/paris',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('paris');
})
app.get('/rome',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('rome');
})
app.get('/santorini',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('santorini');
})
app.get('/searchresults',function(req,res){
  if (!req.session.user) {
    return res.redirect('/login');  
  }
  res.render('searchresults');
  
})
app.get('/wanttogo', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); 
  }
  try {
    // Find the current user in the database
    const currentUsername = req.session.user;
    const user = await collection.findOne({ user: currentUsername });

    if (!user) {
      return res.status(404).send('User not found.');
    }
    // Pass the wantToGoList to the view
    res.render('wanttogo', { wantToGoList: user.wantToGoList });
  } catch (err) {
    //console.error('Error fetching user:', err);
    res.status(500).send('Error retrieving data.');
  }
});


app.post('/add-annapurna', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }
  const currentUsername = req.session.user;
  const destination = 'Annapurna';

  try {
    // Find the user
    const user = await collection.findOne({ user: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if "Annapurna" is already in the wantToGoList
    if (user.wantToGoList.includes(destination)) {
      return res.status(400).send('Annapurna is already in your want to go list');
    }

    // Update the wantToGoList
    await collection.updateOne(
      { user: currentUsername },
      { $push: { wantToGoList: destination } }
    );

    res.send('Annapurna has been added to your want to go list');
  } catch (err) {
    //console.error('Error adding Annapurna:', err);
    res.status(500).send('An error occurred while adding Annapurna');
  }
});

app.post('/add-bali', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }

  const currentUsername = req.session.user;
  const destination = 'Bali';

  try {

    const user = await collection.findOne({ user: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.wantToGoList.includes(destination)) {
      return res.status(400).send('Bali is already in your want to go list');
    }

    await collection.updateOne(
      { user: currentUsername },
      { $push: { wantToGoList: destination } }
    );

    res.send('Bali has been added to your want to go list');
  } catch (err) {
    //console.error('Error adding Bali:', err);
    res.status(500).send('An error occurred while adding Bali');
  }
});

app.post('/add-inca', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }

  const currentUsername = req.session.user;
  const destination = 'Inca';

  try {
    const user = await collection.findOne({ user: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.wantToGoList.includes(destination)) {
      return res.status(400).send('Inca is already in your want to go list');
    }

    await collection.updateOne(
      { user: currentUsername },
      { $push: { wantToGoList: destination } }
    );

    res.send('Inca has been added to your want to go list');
  } catch (err) {
    //console.error('Error adding Inca:', err);
    res.status(500).send('An error occurred while adding Inca');
  }
});

app.post('/add-paris', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }

  const currentUsername = req.session.user;
  const destination = 'Paris';

  try {
    const user = await collection.findOne({ user: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.wantToGoList.includes(destination)) {
      return res.status(400).send('Paris is already in your want to go list');
    }

    await collection.updateOne(
      { user: currentUsername },
      { $push: { wantToGoList: destination } }
    );

    res.send('Paris has been added to your want to go list');
  } catch (err) {
    //console.error('Error adding Paris:', err);
    res.status(500).send('An error occurred while adding Paris');
  }
});

app.post('/add-rome', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }
  const currentUsername = req.session.user;
  const destination = 'Rome';
  try {
    const user = await collection.findOne({ user: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.wantToGoList.includes(destination)) {
      return res.status(400).send('Rome is already in your want to go list');
    }

    await collection.updateOne(
      { user: currentUsername },
      { $push: { wantToGoList: destination } }
    );

    res.send('Rome has been added to your want to go list');
  } catch (err) {
    //console.error('Error adding Rome:', err);
    res.status(500).send('An error occurred while adding Rome');
  }
});

app.post('/add-santorini', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized: Please login');
  }

  const currentUsername = req.session.user;
  const destination = 'Santorini';

  try {
    const user = await collection.findOne({ user: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.wantToGoList.includes(destination)) {
      return res.status(400).send('Santorini is already in your want to go list');
    }

    await collection.updateOne(
      { user: currentUsername },
      { $push: { wantToGoList: destination } }
    );

    res.send('Santorini has been added to your want to go list');
  } catch (err) {
    //console.error('Error adding Santorini:', err);
    res.status(500).send('An error occurred while adding Santorini');
  }
});

app.listen(3000);

