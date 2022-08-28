var db =  require('../config/connection')
var collection = require('../config/collections')
const { response } = require('../app')
const objectId = require('mongodb').ObjectId

module.exports={
    addProduct:(product, callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(String(data.insertedId))
        })
    },
    getAllProducts : () => {
        return new Promise( async (resolve, reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },

    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: objectId(prodId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },

    getProductDetail:(proId) => {
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: objectId(proId)},{
                $set:{
                    name: proDetails.name,
                    Description:proDetails.Description,
                    Price: proDetails.Price,
                    Categary: proDetails.Categary
                }
            }).then((response) => {
                resolve()
            })
        })
    }
}