import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { activationTemplate } from "./emailTemplates/activation";
import { resetPasswordTemplate } from "./emailTemplates/resetPass";

export async function  sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMPT_EMAIL } = process.env;
  
  var transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "99b002f114f33ad754ed94890adbf67d"
    }
  });

  try {
    const testResult = await transport.verify();
    console.log("Test Result Of Transport", testResult);
  } catch (e) {
    console.log(e);
  }
  try {
    const sendResult = await transport.sendMail({
      from: SMPT_EMAIL,
      to,
      subject,
      html: body,
      
    });
    console.log({ sendResult });
    return sendResult;
  } catch (e) {
    console.log(e);
  }
}

export function compileActivationTemplate(name: string, url: string,password:string) {
  const template = Handlebars.compile(activationTemplate);
  const htmlBody = template({
    name,
    url,
    password
  });
  return htmlBody;
}


export function compileResetPassTemplate(name: string, url: string) {
  const template = Handlebars.compile(resetPasswordTemplate);
  const htmlBody = template({
    name,
    url,
  });
  return htmlBody;
}
