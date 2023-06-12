const express = require('express');
const pool = require('./dbConnection')
const path = require('path');
const PORT = 8080;
const colorsPath = path.join(__dirname, './client/colors.html');


const app = express();

// parses JSON from incoming request
app.use(express.json());


const options = {
  lemon:  'yellow',
  lime: 'limegreen',
  tangerine: 'orange',
  grapefruit: 'lightcoral'
};

// #3 helper function called 'getColor' - takes in 'fruit' string parameter and returns a 'color' parameter from the options object
const getColor = (fruit) => {
  return options[fruit];
}

// #1 serve the colors.html page when /colors is visited
// DO NOT USE express.static
app.get('/colors', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './client/colors.html'));
});

// #2 & #4 handle POST requests to /colors
app.post('/colors', (req, res) => {
  const { fruit } = req.body;
  const color = getColor(fruit);
  color ? res.status(200).send({color: color}) : res.status(404).send({message: 'invalid color m8'})
});

// #6
app.get('/styles.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/client/styles.css'));
});

// #5
app.put('/colors/:id/:fruit', async (req, res) => {
  const {id, fruit} = req.params;
  console.log(fruit);
  const color = getColor(fruit);
  const [rows] = await pool.query(
    `UPDATE cars 
    SET color = ? 
    WHERE car_id = ?`, 
    color, id);
  console.log(rows);
  res.status(200).send(rows[0]);
});

// #7
app.get('/*', async (req, res) => {
  res.status(404).sendFile(path.join(__dirname, './client/404.html'))
})

// Global error handling middleware
// How can we trigger this to run?
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
