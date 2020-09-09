'use strict';
const nodemailer = require("nodemailer");

exports.main_handler = async (event, context, callback) => {

  let user_name = JSON.parse(event.body).name
	let user_email = JSON.parse(event.body).email
	let user_feedback = JSON.parse(event.body).feedback

  console.log(user_name, user_email, user_feedback);

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    //service: 'gmail', // for using gmail
    port: 587,
    tls: { // add tls param when using Outlook
       ciphers:'SSLv3'
    },
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_ADDRESS_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: 'Customer Feedback Collection',
    html: `<p> New feedback sent from customer: ${user_name}. </p><br>\
    <p>Feedback: ${user_feedback}</p><br>\
    <p>Customer's email address: ${user_email}<p><br>`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent: ' + info.response)
    return info.response
  } catch (e) {
    console.log(e)
  }
  return [user_name, user_feedback]
}
