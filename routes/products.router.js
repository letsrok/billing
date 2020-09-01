const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Product = require('../models/Product')
const auth = require('../middleware/auth.middleware')
const moment = require('moment')

const router = Router()


// api/products/get-products/:id
router.get(
  '/get-products/:id',
  auth,
  async (req, res) => {

    try {
      const products = await Product.find({owner: req.params.id})

      if(products) {
        return res.json(products)
      }
      return res.status(400).json({message: 'услуг не добавлено'})
    }
    catch(e) {
      return res.status(400).json({ message: e.message })
    }

  }
)

// api/products/get-product/:id
router.get(
  '/get-product/:id',
  auth,
  async (req, res) => {

    try {
      const product = await Product.findById(req.params.id)

      if(product) {
        const {
          name,
          dateStart,
          dateEnd,
          count,
          price
        } = product

        return res.json({name,dateStart,dateEnd,count,price })
      }
      return res.status(400).json({message: 'услуга не найдена'})
    }
    catch(e) {
      return res.status(400).json({ message: e.message })
    }

  }
)

// api/products/add
router.post(
  '/add',
  [
    check('name', 'поле Название пустое').not().isEmpty(),
    check('dateStart', 'поле Начало пустое').not().isEmpty(),
    check('count', 'поле Период пустое').not().isEmpty(),
    check('price', 'поле Цена пустое').not().isEmpty(),
  ],
  auth,
  async (req, res) => {

    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может добавлять продукты'
      })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные'
      })
    }

    try{
      let {type, name, dateStart, dateEnd, count, price, userId} = req.body

      dateStart = moment(dateStart, "DD.MM.YYYY")

      if(dateEnd) dateEnd = moment(dateEnd, "DD.MM.YYYY")

      let product = new Product({
        type, name, dateStart, dateEnd, count, price, owner: userId
      })

      await product.save()
      return res.status(201).json({ product })
    }
    catch(e){
      return res.status(400).json({ message: e.message })
    }
  }
)

// api/products/delete:id
router.delete(
  '/delete/:id',
  auth,
  async (req, res) => {

    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может удалять продукты'
      })
    }

    try{
      let id = req.params.id

      const product = await Product.findById(id)

      if(!product) {
        return res.status(400).json({message: 'Продукт не найден'})
      }

      await Product.deleteOne({_id: id}, function () {
        return res.json({message: 'Продукт удален'})
      })

    }
    catch(e){
      return res.status(400).json({ message: e.message })
    }
  }
)

// api/products/update:id

router.put(
  '/update:id',
  [
    check('name', 'поле Название пустое').not().isEmpty(),
    check('dateStart', 'поле Начало пустое').not().isEmpty(),
    check('count', 'поле Период пустое').not().isEmpty(),
    check('price', 'поле Цена пустое').not().isEmpty(),
  ],
  auth,
  async(req, res) => {
    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может изменять продукты'
      })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные'
      })
    }

    try{
      let id = req.params.id

      const product = await Product.findById(id)

      if(!product) {
        return res.status(404).json({message: 'Продукт не найден'})
      }

      let {
        name,
        dateStart,
        dateEnd,
        count,
        price
      }  = req.body

      dateStart = moment(dateStart, "DD.MM.YYYY")
      if(dateEnd) dateEnd = moment(dateEnd, "DD.MM.YYYY")

      await Product.findOneAndUpdate({_id: req.params.id}, {name, dateStart, dateEnd, count, price},
        {
          new: true
        })
      return res.json({message: 'услуга сохранена'})

    }
    catch(e){
      return res.status(400).json({ message: e.message })
    }
  }
)

module.exports = router
