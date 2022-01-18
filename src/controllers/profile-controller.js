const profileService = require("../services/profile-service");

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      const userName = req.params.userName;
      const profileData = await profileService.getProfile(userName, token);
      return res.json(profileData);
    } catch (e) {
      next(e);
    }
  }
  async followProfile(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      const userName = req.params.userName;
      const profileData = await profileService.followProfile(userName, token);
      return res.json(profileData);
    } catch (e) {
      next(e);
    }
  }
  async unFollowProfile(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      const userName = req.params.userName;
      const profileData = await profileService.unFollowProfile(userName, token);
      return res.json(profileData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProfileController();
