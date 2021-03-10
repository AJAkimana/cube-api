/* eslint-disable prettier/prettier */
import fs from 'fs';
import pdf from 'pdf-creator-node';
import { sendInvoice } from '../mail/mail.controller';
import Invoice from '../../database/model/invoice.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';

/**
 * This class will contains all helpers function to handle invoice generation
 * required to generate invoice when order made successfully
 */
class InvoiceHelpers {
  static async saveInvoice(body) {
    const savedInvoice = await InstanceMaintain.createData(Invoice, {
      orderId: body.orderId,
      due_date: body.due_date,
      amount: body.amount,
      status: 'pending',
    });
    return savedInvoice;
  }

  static async generatePDF(body) {
    const html = fs.readFileSync('template.html', 'utf8');
    const options = { rmat: "A6", orientation: "landscape","footer": {"height": "20mm", contents: '<div style="font-weight: 900; margin-top: 00px; text-align: center;">Hey !! Pay your invoice within 5 days</div>'}
    }

    const users = [ { orderId: body.orderId.trim(""), due_date: body.due_date.trim(""), amount: `$${body.amount}` } ]
    const document = { html, data: { users }, path: "./invoice.pdf" };

    await pdf.create(document, options);
    fs.readFile('./invoice.pdf', async function(err, data) {
      const attachments = [{filename: 'invoice.pdf', content: data.toString('base64'), type: 'application/pdf', disposition: 'attachment', contentId:  body.orderId }];
      await sendInvoice(body.customerEmail, 'This is your invoice reach from Time Capsule 3D', attachments);
    });

  }
}

export default InvoiceHelpers;