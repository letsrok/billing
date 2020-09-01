const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const auth = require('../middleware/auth.middleware')

// /api/auth/register
router.post(
  '/register',
  auth,
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }

      const {
        email,
        password,
        name,
        contract
      } = req.body

      const candidateMail = await User.findOne({ email })

      if (candidateMail) {
        return res.status(400).json({ message: 'пользователь с таким e-mail уже существует' })
      }

      const candidateName = await User.findOne({ name })

      if (candidateName) {
        return res.status(400).json({ message: 'пользователь с таким именем уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        email,
        password: hashedPassword,
        name,
        contract,
      })

      await user.save()

      res.status(200).json({user})

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })


// /api/auth/register/admin
router.post(
  '/register/admin',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    try {

      const isHasAdmin = await User.findOne({role: 'admin'})

      if(isHasAdmin) {
        return res.status(403).json({
          message: 'Администратор сайта уже создан'
        })
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }

      const {
        email,
        password
      } = req.body


      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        email,
        password: hashedPassword,
        role: 'admin'
      })

      await user.save()

      res.status(201).json({ message: 'Администратор создан' })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

// api/auth/update:id

router.put(
 '/update:id',
  [
    check('email', 'Некорректный email').isEmail(),
    check('name', 'Заполните поле Имя').not().isEmpty(),
  ],
  auth,
  async(req, res) => {

    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может изменять данные пользователей'
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

      const client = await User.findById(id)

      if(!client) {
        return res.status(404).json({message: 'Пользователь не найден'})
      }

      let {
        name,
        email,
        contract,
        notes
      }  = req.body

      await User.findOneAndUpdate({_id: req.params.id}, {name,  email, contract, notes},
        {
          new: true
        })
      return res.json({message: 'пользователь сохранен'})

    }
    catch(e){
      return res.status(400).json({ message: e.message })
    }
  }
)

// api/auth/change-pass:id

router.put(
  '/change-pass:id',
  [
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  auth,
  async(req, res) => {
    const admin = await User.findOne({id: req.userId})

    if(admin.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может изменять пароль'
      })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при регистрации'
      })
    }

    try{
      let id = req.params.id

      const user = await User.findById(id)

      if(!user) {
        return res.status(400).json({message: 'Пользователь не найден'})
      }

      const { password } = req.body

      const hashedPassword = await bcrypt.hash(password, 12)

      await User.findOneAndUpdate({_id: id}, {password: hashedPassword},
        {
          new: true
        })
      return res.json({message: 'пароль сохранен'})

    }
    catch(e){
      return res.status(400).json({ message: e.message })
    }
  }
)

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при входе в систему'
      })
    }

    let {email, password} = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      config.get('jwtSecret'),
      { expiresIn: '7d' }
    )

    await User.findOneAndUpdate({email}, {lastVisit: new Date})

    res.json({ token, userId: user.id, userRole: user.role, userMail: user.email })

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/has-admin
router.get(
  '/has-admin',
  async (req, res) => {
    try {

      const user = await User.findOne({ role:'admin' })

      if (!user) {
        return res.json({ isHasAdmin: false })
      }

      return res.json({isHasAdmin: true})

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })




module.exports = router
