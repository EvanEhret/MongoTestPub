
const { MongoClient } = require("mongodb");
// The uri string must be the connection string for the database (obtained on Atlas).
//T1 
const uri = "mongodb+srv://genericuser:genericpw@eehretdb.bveavcy.mongodb.net/?retryWrites=true&w=majority&appName=eehretdb";
// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const cookieParser = require('cookie-parser'); // Require the cookie-parser middleware
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use the cookie-parser middleware
// routes will go here

// Default route.
// Provides a selection of routes to go to as links.

app.get('/', function(req, res) {
  const authCookie = req.cookies.authCookie;
  if (authCookie) { 
    res.send(`
    <h1>Login successful</h1>
    <p>Cookie: ${authCookie}</p>
    <a href="/activecookies">Show Cookies</a>
  `) 
  } else{
  var outstring = `
  <h1>Login Form</h1>
  <form action="/login" method="POST">
    <label for="username">Username:</label>
    <input type="text" id="userId" name="username" required><br><br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required><br><br>
    <button type="submit">Submit</button>
  </form>
<h2>Don't have an account with us? Register here</h2>
<a href="/register">Register</a>
`;
 res.send(outstring);
}});
  
//T2
app.get('/register', function(req, res) {
  var outstring = `
  <h1>Registration Form</h1>
  <form action="/insertregister" method="POST">
    <label for="username">Username:</label>
    <input type="text" id="userId" name="username" required><br><br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required><br><br>
    <button type="submit">Submit</button>
  </form>
  `
  res.send(outstring);
});

app.post('/insertregister', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  async function run() {
    try {
      const database = client.db('EvansAssignment');
      const authCollection = database.collection('Authentication');

      const doc = { userId: username, password: password };
      const result = await authCollection.insertOne(doc);
      console.log(`New user registered with id ${result.insertedId}`);
      res.redirect('/'); // Redirect to the home page after successful registration
    } catch (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    } 
  }
  run().catch(console.dir);
});

//T4
app.get('/activecookies', function(req, res) {
  const cookies = req.cookies;
  let cookiesList = '<h1>Active Cookies:</h1><ul>';

  for (const [name, value] of Object.entries(cookies)) {
    cookiesList += `<li>${name}: ${value}</li>`;
  }

  cookiesList += '</ul>';
  cookiesList += '<form action="/clearcookies" method="POST"><button type="submit">Clear Cookies</button></form>';
  cookiesList += '<a href="/">Back to Home</a>';
  res.send(cookiesList);
});

//T5
app.post('/clearcookies', function(req, res) {
  var tohome = `<a href="/">Back to Home</a>`
  var tocookielist = `<a href="/activecookies">Show Cookies</a>`
  res.clearCookie('authCookie');
  res.send(`${tohome}${tocookielist}`); 
});

//T3
const client = new MongoClient(uri);
app.post('/login', function(req, res) {
async function run() {
    try {
      const database = client.db('EvansAssignment');
      const authCollection = database.collection('Authentication');
      
       const query = {userId: req.body.username, password: req.body.password};
       console.log("Looking for: " + query);
  
      const user = await authCollection.findOne(query);
      var tohome = `<a href="/">Back to Home</a>`
      var tocookielist = `<a href="/activecookies">Show Cookies</a>`
      //T3.2
      if (user) {
        res.cookie('authCookie', user.userId, {maxAge: 60000, httpOnly: true});
        res.send(`Logged in and cookie set <br> ${tohome} <br> ${tocookielist}`);
      }
      //T3.1 
      else{
        res.status(401).send(`Invalid Username or Password <br> ${tohome} <br> ${tocookielist}`)
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error logging in');
    }
  }
  run().catch(console.dir);
  });
  