const nodemailer = require('nodemailer')
const config = require('config')

async function sendMail(conf) {
    let transporter = nodemailer.createTransport({
        host: config.get('mailSMTP'),
        port: config.get('mailPort'),
        secure: true,
        auth: {
            user: config.get('mailUser'),
            pass: config.get('mailPass')
        }
    })

    return transporter.sendMail({
        from: config.get('mailFrom'),
        to: conf.to,
        subject: conf.subject,
        html: conf.text
    })

}

module.exports = sendMail

