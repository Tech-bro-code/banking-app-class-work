import nodemailer from "nodemailer"

export const sendMail = async (
    data:{email:string, subject:string, emailInfo:any},
    cb:Function
  )  => {
        try {
    // const transporter = nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // // port: process.env.EMAIL_PORT,
      // secure: false,
      // auth: {
      //   user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      //       },
      //    tls: {
      //       rejectUnauthorized: true,
      //   }
      // Looking to send emails in production? Check out our Email API/SMTP product!
  const sender = "sandbox.smtp.mailtrap.io"
const transport =  nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0ae7257ab33c90",
    pass: "f984852868a6d7"
  }
             });

             const message = {
              from: sender,
              to:data.email,
              replyTo: process.env.EMAIL_USERNAME,
              subject: data.subject,
              html:cb(data)
             }
             await transport.sendMail(message)
        } catch (error) {
          console.log(error)

            
        }

}