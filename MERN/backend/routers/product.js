const express = require('express');
const {allProducts, detailProducts, createProduct, deleteProduct, updateProduct, adminProducts} = require('../controllers/product.js');
const {authenticationMind, roleChecked} = require('../middleware/auth.js');
const router = express.Router();

router.get('/products', allProducts);
router.get('/admin/products',authenticationMind, roleChecked("admin"), adminProducts);
router.get('/products/:id', detailProducts);
router.post('/products/new',authenticationMind, roleChecked("admin"), createProduct);
router.delete('/products/:id', authenticationMind, roleChecked("admin"), deleteProduct);
router.put('/products/:id', authenticationMind, roleChecked("admin"), updateProduct);

module.exports = router;