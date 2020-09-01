const {Router} = require('express')
const User = require('../models/User')
const Product = require('../models/Product')
const router = Router()
const auth = require('../middleware/auth.middleware')
const Settings = require('../models/Settings')

// /api/clients/get-client-for-admin
router.get(
  '/get-client-for-admin/:id',
  auth,
  async (req, res) => {

    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может просматривать эту страницу'
      })
    }

    try {
      const user = await User.findById(req.params.id)

      if(user) {
        return res.json(user)
      }
      return res.status(400).json({message: 'Пользователь не найден'})
    }
    catch(e) {
      return res.status(400).json({ message: e.message })
    }
  }
)

// /api/clients/info
router.get(
  '/info',
  auth,
  async (req, res) => {
    const id = req.user.userId

    try{
      const user = await User.findById(id)

      if(!user) return res.status(404).json({message: 'пользователь на найден'})

      const {email, contract} = user
      let products = []

      const fetchProducts = await Product.find({owner: id})

      if(fetchProducts) {
        products = fetchProducts
      }

      return res.json({email, contract, products})
    }

    catch{}

  }
)

// api/clients/pay

router.get(
  `/pay`,
  auth,
  async (req, res) => {

    const id = req.user.userId

    try {
      const user = await User.findById(id)
      const products = await Product.find({owner: id})
      const settings = await Settings.findOne({name: 'settings'})

      return res.json({user, products, settings})
    }
    catch {

    }
  }
)

// /api/clients/all
router.get(
  '/all',
  auth,
  async (req, res) => {
    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может просматривать эту страницу'
      })
    }

    try{
      const users = await User.find({role : 'client'})
      const products = await Product.find({})

      if(users) {

        users.forEach(user => {
          let id = user._id

          products.forEach(product => {
            let id2 = product.owner

            if(id.toString() == id2.toString()) {
              user.products.push(product)
            }
          })
        })

        return res.json(users)
      }

      return res.status(404).json({message: 'не найден ни один клиент'})
    }
    catch{}
  }
)


// /api/clients/delete${id}

router.delete(
  '/delete/:id',
  auth,
  async (req, res) => {
    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может удалять пользователя'
      })
    }

    try {
      await User.findByIdAndDelete(req.params.id)
      await Product.deleteMany({owner: req.params.id})
      return res.json({message: 'OK'})
    }
    catch{}
  }
)


module.exports = router
