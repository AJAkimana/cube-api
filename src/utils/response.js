/* eslint-disable import/prefer-default-export */

/**
 *
 * @param {Response} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {any} data
 * @param {Number} totalItems
 * @returns
 */
export const serverResponse = (
  res,
  statusCode = 200,
  message = 'Success',
  data = null,
  totalItems = 0,
) => {
  const messageType = statusCode >= 400 ? 'error' : 'message';
  return res.status(statusCode).json({
    status: statusCode,
    [messageType]: message,
    data,
    totalItems,
  });
};
