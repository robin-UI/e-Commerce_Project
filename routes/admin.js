var express = require('express');
const { route } = require('./user');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const { response } = require('../app');
const { Exception } = require('handlebars');

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true, products})
  })
});

router.get('/add-product',(req, res)=>{
    res.render('admin/add-product',{admin:true})
})

router.post('/add-product', (req, res)=>{

  productHelper.addProduct(req.body, (result) => {
    let image = req.files.image;
    image.mv('./public/product-images/'+ result +'.jpg',(err, done)=>{
      if (!err) {
        res.render('admin/add-product',{admin:true})
      }else{
        console.log(err);
      }
    })
  })

})

router.get('/delete-product/:id', (req, res) =>{
  let proId = req.params.id 
  // console.log(proId);
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  }) 
})

router.get('/edit-product/:id', async(req, res) => {
  let product =await productHelper.getProductDetail(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product});
})

router.post('/edit-product/:id', (req, res) => {
  let id  = req.params.id;
  let img;
  try{
    img = req.files.image
  }
  catch(error)
  {
    console.log(error)
  }

  productHelper.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    try{
      if (img) {
        img.mv('./public/product-images/'+id+'.jpg')
      }
    }
    catch(error){

      console.log(error)
    }
    

  })
})

module.exports = router;
