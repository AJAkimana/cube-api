import {
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
} from 'http-status';
import { randomBytes } from 'crypto';
import ResponseUtil from '../../utils/response.util';
import User from '../../database/model/user.model';
import BcryptUtil from '../../utils/Bcrypt.util';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import data from '../../database/seed/data';
import TokenUtil from '../../utils/jwt.util';
import { sendConfirmationEmail } from '../mail/mail.controller';

/**
 * This class will contains all function to handle account
 * required to create account for now
 */
class AuthController {
  /**
   * This function to handle create ccount request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async createAccount(req, res) {
    try {
      req.body.resetKey = randomBytes(40).toString('hex');
      if (req.body.role.toLowerCase() === 'client') {
        req.body.role = 'visitor';
      }
      const user = await InstanceMaintain.createData(User, req.body);
      await sendConfirmationEmail(user);
      return ResponseUtil.handleSuccessResponse(
        CREATED,
        'User account created successfully',
        user,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  /**
   * This function to handle update user request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of updated account.
   */
  static async updateUserInfo(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findByIdAndUpdate(userId, req.body);
      return ResponseUtil.handleSuccessResponse(
        CREATED,
        'User account update successfully',
        user,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
  /**
   * This function to handle delete user request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status.
   */
  static async deleteUser(req, res) {
    const { userId } = req.params;
    try {
      await User.findByIdAndRemove(userId);
      return ResponseUtil.handleSuccessResponse(
        CREATED,
        'User account deleted successfully',
        {},
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
  /**
   * @description this function is invoked to login
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing a success message and token
   */

  static async login(req, res) {
    const { email } = req.body;
    try {
      const user = await InstanceMaintain.findOneData(User, {
        email,
      });

      const userData = { ...user._doc };
      delete userData.password;
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Successfully logged in',
        {
          user: userData,
          token: TokenUtil.generateToken(userData),
        },
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static async editAccount(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        if (BcryptUtil.comparePassword(password, user.password)) {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.companyName = req.body.companyName;
          user.companyUrl = req.body.companyUrl;
          user.phoneNumber = req.body.phoneNumber;
          user.address = req.body.address;
          user.country = req.body.country;
          user.state = req.body.state;
          user.city = req.body.city;
          user.postalCode = req.body.postalCode;
          await user.save();
          return res.status(OK).json({
            status: OK,
            message: 'User account updated successfully',
            data: user,
          });
        }
      }
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: 'You dont have permission to perform the actio',
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: INTERNAL_SERVER_ERROR,
        message: 'Failed to update profile',
      });
    }
  }

  /**
   * This function is for updating the user password.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async updatingPassword(req, res) {
    const { email, password } = req.body;
    try {
      await InstanceMaintain.findOneAndUpdateData(
        User,
        { email },
        {
          password: BcryptUtil.hashPassword(password),
        },
      );

      const user = await InstanceMaintain.findOneData(User, {
        email,
      });
      if (user && user.role === 'visitor') {
        await InstanceMaintain.findOneAndUpdateData(
          User,
          { email },
          { role: 'client' },
          { new: true },
        );
      }
      const updatedData = { ...user._doc };
      delete updatedData.password;

      ResponseUtil.setSuccess(
        OK,
        'Successful updated your password',
        updatedData,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * This function is for setting a new password user password.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async setNewPassword(req, res) {
    const { token, password } = req.body;
    try {
      const user = await User.findOne({ resetKey: token });
      if (user && user.role === 'visitor') {
        user.password = BcryptUtil.hashPassword(password);
        user.role = 'Client';
        user.resetKey = null;

        await user.save();
        const updatedData = { ...user._doc };
        delete updatedData.password;

        ResponseUtil.setSuccess(
          OK,
          'Successful set new password',
          updatedData,
        );
        return ResponseUtil.send(res);
      }
      ResponseUtil.setError(NOT_FOUND, 'Token not found');
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  static async seed(req, res) {
    await User.deleteMany({});
    const userSeed = await InstanceMaintain.createData(
      User,
      data.users,
    );
    ResponseUtil.setSuccess(201, 'Users seeded', userSeed);
    return ResponseUtil.send(res);
  }

  /**
   * This function to handle all getting users.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async getUsers(req, res) {
    try {
      const users = await User.find()
        .sort({ createdAt: -1 })
        .select({ password: 0, resetKey: 0 });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'User accounts have been retrieved',
        users,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
}

export default AuthController;
