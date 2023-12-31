import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import config from '../../config/config';
import { validationMail } from '../../utils/validationMail';

const sgMail = require('@sendgrid/mail');

const sendgridAPIKey =
  process.env.SENDGRID_API_KEY || config.sendgrid_api_key;
sgMail.setApiKey(sendgridAPIKey);

const sendConfirmationEmail = async (
  user,
  subject = '',
  action = '',
  content = '',
) => {
  try {
    const url = `${process.env.FRONTEND_URL}/set-password/${user.resetKey}`;
    const data = {
      from: process.env.MAIL_FROM,
      to: `${user.email}`,
      subject,
      html: validationMail(url, action, content),
    };
    await sgMail.send(data);
  } catch (error) {
    throw error;
  }
};

const mail = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      package: package_type,
      message,
    } = req.body;

    let data;
    if (message) {
      data = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'Contact form submission',
        html: `<div><p>${message}</p><p><b>Contact Email:</b> ${email}<br/>`,
      };
    }

    if (package_type) {
      data = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'AKADOMORW ORDER REQUEST',
        html: `<div><p><b>Name:</b> ${fullname}</b><br/><b>Package:</b> ${package_type}<br/><b>Phone:</b> ${phone}<br/><b>Email:</b> ${email}  </p></div>`,
      };
    }

    await sgMail.send(data);
    return res.status(OK).json({ status: OK, message: 'email sent' });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

const sendInvoice = async (email, message, attachments) => {
  try {
    const data = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'A.R.I Invoice',
      attachments,
      html: `<div><p>${message}</p><p><b>Contact Email:</b> ${process.env.MAIL_FROM}<br/>`,
    };
    if (process.env.NODE_ENV === 'production') {
      await sgMail.send(data);
    }
  } catch (error) {
    throw error;
  }
};
const sendUserEmail = async (
  user = {},
  subject = '',
  content = '',
) => {
  try {
    const data = {
      from: process.env.MAIL_FROM,
      to: `${user.email}`,
      subject,
      html: content,
    };
    if (process.env.NODE_ENV === 'production') {
      await sgMail.send(data);
    }
  } catch (error) {
    throw error;
  }
};
export { sendConfirmationEmail, mail, sendInvoice, sendUserEmail };
