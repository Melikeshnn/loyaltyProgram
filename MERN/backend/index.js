const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./config/db.js');
const product = require('./routers/product.js');
const user = require('./models/user.js');
const cloudinary = require('cloudinary').v2;


dotenv.config();

// Cloudinary kullanarak ürünlerin görsellerini tutacağız.
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

app.use('/', product);
app.use('/user', user);

app.get('/products', (req, res) => {
    res.status(200).json({message: "rota belirlendi...."});
});

db();

const PORT = 4000;
app.listen(PORT, () => {
    console.log("server is running on port 4000")
});