const config = require('config')
const footer = require('./basicFooter')

const template = (userName, product) => {
  const mailTo = config.get('baseUrl')

  return `
    <p>Здравствуйте,</p>
    <p>Клиент ${userName} решил отказаться от услуги ${product}</p>
    <br>
    <p><a href="${mailTo}" target="_blank">Перейти в личный кабинет</a></p>
    
    ${footer}
  `
}

module.exports = template
