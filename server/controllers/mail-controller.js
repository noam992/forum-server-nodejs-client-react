const express = require("express");
const nodemailer = require('nodemailer');

const router = express.Router()

let transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass
    }
}

let transporter = nodemailer.createTransport(transport)

router.post('/send', (request, response) => {

    let name = request.body.name
    let email = request.body.email
    let message = request.body.message
    let content = `name: ${name} \nemail: ${email} \nmessage: ${message} `
  
    let mail = {
        from: name,
        to: 'visualizingnono@gmail.com',
        subject: 'New Message from Contact Form',
        text: content
    }
  
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            response.send({
                status: 'fail'
        });
        } else {
            response.send({
                name,
                email,
                message
            });
        }
    }) 
})

module.exports = router