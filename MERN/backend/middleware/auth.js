const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

// adminin işlem yapabilmesi için kimlik doğrulama.
const authenticationMind = async (req, res, next) => {
 const {token} = req.cookies;
    if(!token){
        return res.status(500).json({message: 'Lütfen giriş yapın!'});
    }

    const decodedData = jwt.verify(token, "SECRETTOKEN");
    if(!decodedData){
        return res.status(500).json({message: 'Erişim tokenınınz geçersiz!'});
    }

    req.user = await User.findById(decodedData.id);

    next();

}

const roleChecked = (...roles) => {
    return (req, res, next) => {
        if(roles.includes(req.user.role)){
            next();
        } else {
            res.status(500).json({message: 'Bu işlemi yapmak için yetkiniz yok!'});
        }
    }
}


module.exports =  {authenticationMind, roleChecked};