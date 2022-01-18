const tagsService = require("../services/tags-servise");

class TagsController {
  async getTopTen(req, res, next) {
    try {
      const tagsData = await tagsService.getAllTags();
      return res.json({ tags: tagsData });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TagsController();
