import { INTERNAL_SERVER_ERROR, CREATED, OK } from 'http-status';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import Invoice from '../../database/model/invoice.model';
import ResponseUtil from '../../utils/response.util';
import invoiceHelper from './invoice.helper';

/**
 * This class will contains all function to handle account
 * required to create account for now
 */
class InvoiceController {
  /**
   * This function to handle generate invoice request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async generateInvoice(req, res) {
    try {
      await invoiceHelper.generatePDF(req.body);
      const data = await InstanceMaintain.createData(
        Invoice,
        req.body,
      );
      ResponseUtil.setSuccess(
        CREATED,
        'Invoice generated successfully, check your email',
        data,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * @description this function is invoked to pay invoice
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing invoice and order details
   */
  static async paymentOfInvoice(req, res) {
    try {
      const { id } = req.params;
      const { amount, status } = req.body;
      // get invoice id to be updated
      const updateInvoice = await InstanceMaintain.findByIdAndUpdateData(
        Invoice,
        id,
        { amount, status },
      );
      ResponseUtil.setSuccess(
        OK,
        'Invoice has been updated successfully',
        {
          Invoice: updateInvoice,
        },
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }
}

export default InvoiceController;