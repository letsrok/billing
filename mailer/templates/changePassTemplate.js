const config = require('config')
const footer = require('./basicFooter')

const template = (userName, userPass) => {
  const mailTo = config.get('baseUrl')

  return `
    <p>Здравствуйте,</p>
    <p>Вы оформили запрос на восстановление доступа к личному кабинету для управления услугой размещения сайта в BSS70.</p>
    <p>Просьба уведомить нас, если вы не отправляли такой запрос на восстановление доступа.</p>
    <br>

    <p>Доступы в личный кабинет:</p>
    <p>Логин ${userName}</p>
    <p>Пароль ${userPass}</p>
    <p><a href="${mailTo}" target="_blank">Перейти в личный кабинет</a></p>
    
    ${footer}
  `
}

module.exports = template
