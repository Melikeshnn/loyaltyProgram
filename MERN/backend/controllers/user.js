const User = require('../models/user.js');
const bccrypt = require('bcryptjs');
const jwt = require('bcryptjs'); //Hashleme için kullanıcı doğrulama.
const cloudinary = require('cloudinary').v2; //Resim yükleme için kullanılan kütüphane.
const crypto = require ('crypto'); //Şifre sıfırlama için kullanılan kütüphane.
const nodemailer = require('nodemailer');

const register = async (req, res) => {

   const avatar = await cloudinary.uploader.upload(req.body.avatar,{
      folder:"avatars",
      width:130,
      crop: "scale"
   })


 const {name, email, password} = req.body;

 const user = await User.findOne({email});
 if(user){
    return res.status(400).json({message: 'Bu email adresi zaten kayıtlı!'});
 }

 const passwordHash = await bccrypt.hash(password, 10);

 if(password.length < 6){
    return res.status(400).json({message: 'Şifreniz en az 6 karakterden oluşmalıdır'});
 }

 const newUser = await User.create({ 
   name, 
   email, 
   password: passwordHash,
   avatar:{
      public_id: avatar.public_id,
      url: avatar.secure_url
   }

});

 const token = jwt.sign({id: newUser._id}, "SECRETTOKEN", {expiresIn: '1h'});
 
 const cookieOptions = {
    expires: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
 }  
 
 res.status(201).cookie("token", token, cookieOptions),json({message: 'Kayıt başarılı!'});
   newUser,
   token
 }


const login = async (req, res) => {
 const {email, password} = req.body; //API'ye gelen istek.

    const user = await User.findOne({email}); //Kullanıcıyı veritabanından bulma.
    
    if(!user){
        return res.status(500).json({message: 'Bu email adresi kayıtlı değil!'});
    }
 const  comparePassword = await bccrypt.compare(password, user.password); //Kullanıcının şifresini karşılaştırma.
    if (!comparePassword){
        return res.status(500).json({message: 'Şifreniz hatalı!'});
    } 

    const token = jwt.sign({id: user._id}, "SECRETTOKEN", {expiresIn: '1h'});
 
 const cookieOptions = {
    expires: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
 }  
 
 res.status(200).cookie("token", token, cookieOptions),json({message: 'Kayıt başarılı!'});
   user,
   token
 }

const logout = async (req, res) => {
    const cookieOptions = {
        expires: new Date(Date.now()),
        httpOnly: true
    }
    
  res.status(200).cookie("token", null, cookieOptions),json({message: 'Çıkış başarılı!'}); 

}

const forgotPassword = async (req, res) => {
   const user = await User.findOne({email: req.body.email});

   if(!user){
      return res.status(500).json({message: 'Böyle bir kullanıcı bulunamadı!'});
   }
   
   const resetToken = crypto.randomBytes(20).toString("hex");

   user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
   user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

   await user.save({validateBeforeSave: false});

   const passwordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;  

   const message = `Şifrenizi sıfırlamak için lütfen aşağıdaki linke tıklayın:\n\n${passwordUrl}\n\nBu link 5 dakika sonra geçersiz olacaktır.`;

   try{
      const transporter = nodemailer.createTransport({
       port :465,
       service:"gmail",
       host:"smtp.gmail.com",

       auth: {
          user: "yourwmail.com", //kullanıcıya mesaj göndermek istediğimiz mail olucak
          pass: "password"
       },
       secure: true,
    });

      const mailData = {
       from: "yourmail@gmail.com",
       to: req.body.email,
       subject: "Şifre Sıfırlama",
       text: message
    };
      await transporter.sendMail(mailData);

      res.status(200).json({message: 'Email gönderildi!'});

   
   }catch(error){
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({validateBeforeSave: false});

      return res.status(500).json({message: 'Email gönderilemedi!'});
   }

}



const resetPassword = async (req, res) => {
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
   
   const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()}
    });
   
   if(!user){
      return res.status(500).json({message: 'Geçersiz token!'});
   }

   user.password = req.body.password;
   user.resetPasswordExpire = undefined;
   user.resetPasswordToken = undefined;

   await user.save();

   const token = jwt.sign({id: user_id}, "SECRETTOKEN", {expiresIn: '1h'});
   
   const cookieOptions = {
      httpOnly: true,
      expires: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
      )
   }

   res.status(200).cookie("token", token, cookieOptions),json({
      user,
      token
   });

}

const userDetail = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
   user
});
}

module.exports = {register, login, logout, forgotPassword, resetPassword, userDetail}