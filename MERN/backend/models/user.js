const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Lütfen isminizi girin'],
        trim: true,
        maxLength: [100, 'İsminiz 100 karakterden fazla olamaz']
    },
    email: {
        type: String,
        required: [true, 'Lütfen email adresinizi girin'],
        unique: true,
        trim: true,
        
    },
    password: {
        type: String,
        required: [true, 'Lütfen şifrenizi girin'],
        minLength: [6, 'Şifreniz en az 6 karakterden oluşmalıdır'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);