const mongoose = require('mongoose');

const db = () => {
    mongoose.connect('mongodb+srv://sahnnmlkenr:As1212..@loyalty.xq3iqzs.mongodb.net/',{
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((err) => {
        console.error(err);
    });
};

module.exports = db;