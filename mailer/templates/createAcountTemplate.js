const config = require('config')
const footer = require('./basicFooter')

const template = (userName, userPass) => {
  const mailTo = config.get('baseUrl')

  return `
    <p>Здравствуйте,</p>
    <p>вам открыт доступ в личный кабинет для управления услугой размещения сайта в BSS70, в нем вы сможете отслеживать статус и сроки предоставляемых услуг, а так же осуществлять их продление.</p>
    <br>
    <p>Наш сервис будет автоматически уведомлять вас о необходимости продления истекающих услуг.</p>
    <br>
    <p>Доступы в личный кабинет:</p>
    <p>Логин ${userName}</p>
    <p>Пароль ${userPass}</p>
    <p><a href="${mailTo}" target="_blank">Перейти в личный кабинет</a></p>
    
    ${footer}
  `
}

module.exports = template
