const express = require('express');
const cors = require('cors')
var morgan = require('morgan')
//const connectDB = require('./config/db');

const app = express();

//Connect database
//connectDB();

//Init middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('Hello World');
});


//Define Routes


app.use('/api/storage', require('./routes/api/storage'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });	
