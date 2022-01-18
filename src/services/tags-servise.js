const ArticleModel = require("../models/article-model");

class TagsService {
  async getAllTags() {
    const tags = await ArticleModel.aggregate([
      // Unwind the array
      { $unwind: "$tagList" },

      // Group on tags with a count
      {
        $group: {
          _id: "$tagList",
          count: { $sum: 1 },
        },
      },
      // {"$sortByCount" : "$favourites.location_name"},
      // Optionally sort the tags by count descending
      { $sort: { _id: -1 } },

      // Optionally limit to the top "n" results. Using 10 results here
      { $limit: 10 },
    ]);
    const arrOfTags = [];
    tags.forEach((e) => {
      arrOfTags.push(e._id);
    });
    return arrOfTags;
  }
}

module.exports = new TagsService();
