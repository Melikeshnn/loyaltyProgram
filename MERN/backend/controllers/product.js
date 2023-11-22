const Product = require('../models/product.js');
const ProductFilter = require('../utils/productFilter.js');


const allProducts = async(req,res) =>{
    const resultPerPage = 10; // sayfada kaç tane ürün gösterileceğini belirledim.
    const ProductFilter = new  ProductFilter(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products =await ProductFilter.query;

res.status(200).json({
    products
})
}

const adminProducts = async(req,res) =>{
    const products = await Product.find();

    res.status(200).json({
        product
    })
}

const detailProducts = async(req,res) =>{
    const products =await Product.findById(req.params.id);
    
    res.status(200).json({
        product
    })
    }
 //Admin  
const createProduct = async(req,res,next) =>{
    let images = [];
    if (typeof req.body.images === 'string') {
      images.push(req.body.images);
    }else{
    images = req.body.images;
    }

    // Birden fazla ürün fotoğrafı ekleme durumu için.
    let allImage =[];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products",
        });
        allImage.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    
    req.body.images = allImage;
    req.body.user = req.user.id; // Ürünü ekleyen kullanıcıyı belirlemek için.
    

    const products =await Product.create(req.body);
    
    res.status(201).json({
        product
    })
    }
const deleteProduct = async(req,res,next) =>{
    const products =await Product.findById(req.params.id);

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);  //ürün silindiğinde resimlerin de silinmesi için gereken kod.
    }


     await product.remove();
    
    res.status(201).json({
       messagge : "Ürün başarıyla silindi."
    })
    }

const updateProduct = async(req,res,next) =>{
    const products =await Product.findById(req.params.id);


    let images = [];
    if (typeof req.body.images === 'string') {
      images.push(req.body.images);
    }else{
    images = req.body.images;
    }

   // Kişi eski resimlerin kalmasını istemiyorsa diğer içerikleri güncellerse gereken kod.
   if (images !== undefined) {
     for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);  //ürün silindiğinde resimlerin de silinmesi için gereken kod.
   }
}

    // Birden fazla ürün fotoğrafı ekleme durumu için.
    let allImage =[];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products",
        });
        allImage.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    
    req.body.images = allImage; 

    product= await Product.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true});
    
    res.status(201).json({
        messagge : "Ürün başarıyla güncellendi."
    })
    }


module.exports = {allProducts, detailProducts, createProduct, deleteProduct, updateProduct, adminProducts};