const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const auth = require('../middleware/auth.middleware')
const sendMail = require('../mailer/mail')
const templateCreated = require('../mailer/templates/createAcountTemplate')
const templateChangePassword = require('../mailer/templates/changePassTemplate')
const templateRefuse = require('../mailer/templates/refuse')
const User = require('../models/User')
const config = require('config')

const router = Router()

// /api/mails/created

router.post(
  '/created',
  auth,
  [
    check('pass', 'не указан пароль').not().isEmpty(),
    check('email', 'не указан email').not().isEmpty(),
  ],
  async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные'
      })
    }

    try {
      const {email, pass} = req.body

      const text = templateCreated(email, pass)

      await sendMail({
        to: email,
        subject: 'Регистрация',
        text: text
      })
      return res.json({message: 'OK'})
    }

    catch{
      return res.status(400).json({message: 'Не удалось отправить email, попробуйте снова'})
    }
  }
)

// /api/mails/change-pass

router.post(
  '/change-pass',
  auth,
  [
    check('password', 'не указан пароль').not().isEmpty(),
    check('id', 'не указан id').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные'
      })
    }

    try {
      const {id, password} = req.body

      const user = await User.findById(id)

      const {email} = user

      const text = templateChangePassword(email, password)

      await sendMail({
        to: email,
        subject: 'Восстановление доступа',
        text: text
      })
      return res.json({message: 'OK'})
    }

    catch{
      return res.status(400).json({message: 'Не удалось отправить email, попробуйте снова'})
    }
  }
)

// /api/mails/refuse

router.post(
  '/refuse',
  auth,
  async (req, res) => {

    try{
      const {name, product} = req.body

      const text = templateRefuse(name, product)

      await sendMail({
        to: config.get('mailFrom'),
        subject: 'Отказ от услуги',
        text: text
      })
      return res.json({message: 'OK'})

    }
    catch{
      return res.status(400).json({message: 'Не удалось отправить email, попробуйте снова'})
    }
  }
)

module.exports = router
