const userService = require("../services/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const result = {};
        errors.array().forEach((e) => {
          if (e.param == "email") result.email = ["invalid value"];
          if (e.param == "password") result.password = ["invalid value"];
        });
        return next(ApiError.BadRequest("Ошибка при валидации", result));
      }
      const { email, password, name } = req.body;
      const userData = await userService.registration(email, password, name);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: 'none',
        secure: true

      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        // sameSite: 'none'
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        // sameSite: 'none'
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async updateSetting(req, res, next) {
    console.log(22);
    if (req.body.password.length < 4 && req.body.password.length > 0) {
      console.log(13);
      const result = {};
      result.password = ["invalid value"];
      return next(ApiError.BadRequest("Ошибка при валидации", result));
    }
    try {
      const { refreshToken } = req.cookies;
      console.log(req.body);
      const { bio, image, password, username } = req.body;

      const userUpadte = await userService.updateSetting(
        bio,
        image,
        password,
        username,
        refreshToken
      );

      return res.json(userUpadte);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
