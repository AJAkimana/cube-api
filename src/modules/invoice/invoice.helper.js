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
      status: body.status || 'pending',
    });
    return savedInvoice;
  }

  static async generatePDF(body, isDownload = false) {
    const html = fs.readFileSync('template.html', 'utf8');
    let contents =
      '<div style="font-weight:900;margin-top:00px;text-align:center;">';
    contents +=
      body.message || 'Pay the invoice within specified time';
    contents += '</div>';

    const options = {
      rmat: 'A6',
      orientation: 'landscape',
      footer: {
        height: '20mm',
        contents,
      },
    };

    const users = [
      {
        orderId: body.orderId,
        due_date: body.due_date,
        amount: `$${body.amount}`,
      },
    ];
    const invoiceFileName = './invoice.pdf';
    const document = { html, data: { users }, path: invoiceFileName };

    const invoiceDoc = await pdf.create(document, options);
    if (isDownload) {
      return invoiceDoc;
    }
    fs.readFile(invoiceFileName, async (err, data) => {
      const attachments = [
        {
          filename: 'invoice.pdf',
          content: data.toString('base64'),
          type: 'application/pdf',
          disposition: 'attachment',
          contentId: body.orderId,
        },
      ];
      await sendInvoice(
        body.customerEmail,
        'This is your invoice reach from Time Capsule 3D',
        attachments,
      );
    });
  }
}

export default InvoiceHelpers;
