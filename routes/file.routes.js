const {Router} = require('express')
const Settings = require('../models/Settings')
const editTemplate = require('../mailer/generateFile')
const router = Router()
const auth = require('../middleware/auth.middleware')
const fs = require('fs')
const path = require('path')
const pdf = require('html-pdf')

// /api/file/generate

router.post(
  '/generate',
  auth,
  async (req, res) => {

    try{
      let {name, order, serial, products} = req.body


      const options = { format: 'Letter' };

      await fs.readFile(path.join(__dirname, 'template.html',), 'utf8', async (err, content) => {

        content = editTemplate(content, {name, order, serial, products})

        const fileName = Math.random().toString(36).substring(7)

        pdf.create(content, options).toFile(`./client/public/docs/${fileName}.pdf`, async function(err) {
          if (err)  return res.status(400).json({message: 'Не удалось сгенерировать файл '});

          await Settings.findOneAndUpdate({name: 'settings'},
            {serial: serial + 1},
            {
              new: true
            })

          return res.json({file: fileName})
        });

      });

    }

    catch{
      return res.status(400).json({message: 'Не удалось сгенерировать файл '})
    }
  }
)


module.exports = router
