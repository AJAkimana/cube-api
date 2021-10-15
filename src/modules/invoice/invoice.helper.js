/* eslint-disable prettier/prettier */
import fs from 'fs';
import pdf from 'pdf-creator-node';
import { sendInvoice } from '../mail/mail.controller';
import Invoice from '../../database/model/invoice.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import User from '../../database/model/user.model';

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
    const { message, type = 'invoice', items = [] } = body;
    // console.log(items);
    try {
      let fileName = `./${type}.pdf`;
      let html = fs.readFileSync(`${type}.html`, 'utf8');
      const user = await User.findById(body.userId);
      let contents =
        '<div style="font-weight:900;margin-top:00px;text-align:center;">';
      contents += message;
      contents += '</div>';

      const options = {
        format: 'A3',
        orientation: 'portrait',
        footer: {
          height: '20mm',
          contents,
        },
      };

      const invoice = {
        orderId: body.order._id,
        due_date: body.due_date,
        createdAt: body.createdAt,
        total: `$${body.amounts?.total?.toLocaleString('en-US')}`,
        subTotal: `$${body.amounts?.subtotal?.toLocaleString(
          'en-US',
        )}`,
        projectName: body.project?.name,
        projectType: body.project?.type,
        invoiceNumber: body.order.invoiceNumber || 4,
        status: body.order.status,
        amountDue: 0,
      };

      const document = {
        html,
        data: {
          invoice,
          user: user.toObject(),
          orderNumber: invoice.invoiceNumber,
          propasalText: body.order.propasalText || '',
          customerNote: body.order.customerNote || '',
          items,
        },
        path: fileName,
      };

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
          user.email,
          'This is your invoice reach from Time Capsule 3D',
          attachments,
        );
      });
    } catch (error) {
      throw Error(error);
    }
  }
}

export default InvoiceHelpers;
