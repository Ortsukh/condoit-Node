const ArticleModel = require("../models/article-model");
const TokenModel = require("../models/token-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ProfileService {
  async getProfile(name, token) {
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });
    const userAuthor = await UserModel.findOne({ name });

    const isFollow = user.following.indexOf(name) == -1 ? false : true;

    const profileData = {
      bio: userAuthor.bio,
      following: isFollow,
      image: userAuthor.image,
      name: userAuthor.name,
    };

    return { profile: profileData };
  }
  async followProfile(name, token) {
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });
    const userAuthor = await UserModel.findOne({ name });

    const followArr = user.following;

    followArr.push(name);

    await UserModel.updateOne(
      { _id: userId },
      {
        following: followArr,
      }
    );
    const profileData = {
      bio: userAuthor.bio,
      following: true,
      image: userAuthor.image,
      name: userAuthor.name,
    };

    return { profile: profileData };
  }
  async unFollowProfile(name, token) {
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });
    const userAuthor = await UserModel.findOne({ name });

    const followArr = user.following;
    const indexFollowName = followArr.indexOf(name);
    if (indexFollowName == -1) {
      throw ApiError.BadRequest(`Ошибка авторизации`);
    }
    followArr.splice(indexFollowName - 1, 1);
    await UserModel.updateOne(
      { _id: userId },
      {
        following: followArr,
      }
    );
    const profileData = {
      bio: userAuthor.bio,
      following: false,
      image: userAuthor.image,
      username: userAuthor.name,
    };

    return { profile: profileData };
  }
  //   async getAllArticles() {
  //     //         const articles1 = await ArticleModel.find({tagList: { $in:["asdas", "asdas123"]}})
  //     // console.log(articles1);

  //     const twts = await ArticleModel.aggregate([
  //       // Unwind the array
  //       { $unwind: "$tagList" },

  //       // Group on tags with a count
  //       {
  //         $group: {
  //           _id: "$tagList",
  //           count: { $sum: 1 },
  //         },
  //       },
  //       // {"$sortByCount" : "$favourites.location_name"},
  //       // Optionally sort the tags by count descending
  //       { $sort: { _id: -1 } },

  //       // Optionally limit to the top "n" results. Using 10 results here
  //       { $limit: 10 },
  //     ]);
  //     console.log(twts);
  //     const arr = [];
  //     twts.forEach((e) => {
  //       arr.push(e._id);
  //     });
  //     console.log(arr);
  //     const articles = await ArticleModel.find();
  //     return articles;
  //   }

  //   async update(slug, title, description, body, tagList) {
  //     const article = await ArticleModel.findOne({ slug });
  //     if (!article) {
  //       throw ApiError.BadRequest("Данная статья не найдена");
  //     }
  //     await ArticleModel.updateOne(
  //       { slug },
  //       {
  //         title: title,
  //         description: description,
  //         body: body,
  //         tagList: tagList,
  //       }
  //     );
  //     const newArticle = await ArticleModel.findOne({ slug });
  //     // newArticle.save()
  //     return newArticle;
  //   }

  //   async delete(slug) {
  //     const article = await ArticleModel.findOne({ slug });
  //     if (!article) {
  //       throw ApiError.BadRequest("Данная статья не найдена");
  //     }
  //     await ArticleModel.deleteOne({ slug });
  //     return true;
  //   }

  //   async upFavoriteCount(slug) {
  //     const article = await ArticleModel.findOne({ slug });
  //     article.favoritesCount++;
  //     article.save();
  //     return article;
  //   }
  //   async downFavoriteCount(slug) {
  //     const article = await ArticleModel.findOne({ slug });
  //     article.favoritesCount--;
  //     article.save();
  //     return article;
  //   }
}

module.exports = new ProfileService();
