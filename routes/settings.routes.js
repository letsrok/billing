const {Router} = require('express')
const Settings = require('../models/Settings')
const User = require('../models/User')
const router = Router()
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')

// /api/settings/create
router.post(
  '/create',
  [
    check('sber', 'длина номера сберкарты 16 символов')
      .isLength({ min: 16, max: 16 })
      .isNumeric(),
    check('mail', 'Некорректный email').isEmail(),
    check('serial', 'счет должен указываться цыфрами')
      .isNumeric(),
    check('basicCount', 'Базовый срок размещения должен указываться цыфрами' ).isNumeric(),
    check('basicPrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric(),
    check('basicDomainPrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric(),
    check('basicSitePrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric(),
    check('basicCatalogPrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric()
  ],
  auth,
  async(req, res) => {

    const user = await User.findOne({id: req.userId})

    if(user.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может создавать настройки'
      })
    }

    const isHasSettings = await Settings.findOne({name: 'settings'})

    if(isHasSettings) {
      return res.status(400).json({
        message: 'Настройки уже созданы'
      })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: errors.array()[0].msg
      })
    }

    try{
      const {
        sber,
        mail,
        serial,
        basicCount,
        basicPrice
      } = req.body


      const settings = new Settings({
        sber,
        mail,
        serial,
        basicCount,
        basicPrice
      })

      await settings.save()

      return res.json({settings})
    }

    catch (e) {
        return res.status(500).json({ message: e.message })
    }
  }
)

// /api/settings/update
router.put(
  '/update',
  [
    check('sber', 'длина номера сберкарты 16 символов')
      .isLength({ min: 16, max: 16 })
      .isNumeric(),
    check('mail', 'Некорректный email').isEmail(),
    check('serial', 'Длина счета должны быть 4 цыфры')
      .isLength({ min: 4, max: 4 })
      .isNumeric(),
    check('basicCount', 'Базовый срок размещения должен указываться цыфрами' ).isNumeric(),
    check('basicPrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric(),
    check('basicDomainPrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric(),
    check('basicSitePrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric(),
    check('basicCatalogPrice', 'Базовая стоимость размещения должна указываться цыфрами' ).isNumeric()
  ],
  auth,
  async(req, res) => {

    const user = await User.findOne({id: req.userId})

    if(user.role !== 'admin') {
      return res.status(403).json({
        message: 'Только администротор может изменять настройки'
      })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: errors.array()[0].msg
      })
    }

    try{
      const {
        sber,
        mail,
        serial,
        basicCount,
        basicPrice,
        basicDomainPrice,
        basicSitePrice,
        basicCatalogPrice
      } = req.body

      await Settings.findOneAndUpdate({name: 'settings'},
        {sber, mail, serial, basicCount, basicPrice, basicDomainPrice, basicSitePrice, basicCatalogPrice},
        {
          new: true
        })

      return res.json({message: 'настройки сохранены'})
    }

    catch (e) {
      return res.status(500).json({ message: e.message })
    }
  }
)

// /api/settings/get
router.get(
  '/get',
  async(req, res) => {
    try {

      const settings = await Settings.findOne({name: 'settings'})

      if(settings) {
        return res.json({settings})
      }

      return res.status(400).json({ message: 'Нужно создать настройки' })


    }

    catch (e) {
      return res.status(500).json({ message: 'Не удалось получить настройки' })
    }

  }
)


module.exports = router

