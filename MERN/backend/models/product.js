const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    },
    detail :{
    type: String,
    required: true
    },
    point :{
    type: Number,
    required: true
    },
    stock :{
    type: Number,
    required: true,
    default: 1
    },
    category:{
    type: String,
    required: true
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url:
            {
                type: String,
                required: true
            }
        }
    ], 
},{timestamps: true});

module.exports = mongoose.model('Product', productSchema)