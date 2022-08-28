var db =  require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const { response } = require('../app')
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise( async (resolve, reject)=>{
            userData.Password = await bcrypt.hash(userData.Password, 10)
            let user = db.get().collection(collection.USER_COLLECTION).insertOne(userData)
            resolve(user)
        })
    },

    doLogin: (userData) => {

        return new Promise( async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({emale: userData.emale})
            if(user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("Log success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Log false");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("Login faile");
                resolve({status:false})
            }
        })
    }, 

    addToCart:(proId, userId) => {
        let proObj = {
            item : objectId(proId),
            quantity: 1
        }
        return new Promise( async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                console.log(userCart);
                console.log(proId + " This id");
                let cartPro = userCart.products;
                console.log(cartPro);
                
                console.log(proId);
                console.log(cartPro.length)
                
                proId=objectId(proId)
                console.log(proId);

                let proExist = userCart.products.indexOf(proId)
                console.log(proExist);
                // if (proExist == -1) {
                //     db.get().collection(collection.CART_COLLECTION).updateOne({'products.item': objectId(userId)}
                // }
                // ,
                //     {
                //        $push: {products: proObj}
                //     }
                // ).then((response) => {
                //     resolve()
                // })
            }else{
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },

    getCartProduct:(userId) => {
        return new Promise( async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user: objectId(userId)}
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        let:{prodList: '$products'},
                        pipeline:[
                            {
                                $match: {
                                    $expr: {
                                        $in:['$_id', '$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },
    getCartCount:(userId) => {
        return new Promise( async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user: objectId(userId)})
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    }
}