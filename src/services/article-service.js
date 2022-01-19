const ArticleModel = require("../models/article-model");
const TokenModel = require("../models/token-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class ArticleService {
  async create(title, description, body, tagList, token) {
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });

    const createdAt = new Date().toString().slice(0, -37);
    const author = {
      bio: user.bio,
      following: user.following,
      followed:false,
      image: user.image,
      username: user.name,
    };
    const article = await ArticleModel.create({
      title,
      description,
      createdAt,
      author,
      body,
      tagList,
    });

    return { article };
  }

  async getById(slug, token) {
    const article = await ArticleModel.findOne({ slug });
    if (!article) {
      throw ApiError.BadRequest("Данная статья не найдена");
    }
    
    return article;
  }
  async getYourFeedArticles(token) {
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });
    const followingArr = user.following;
    
    const resultArr = await ArticleModel.find({
      "author.username": { $in: followingArr },
    });

   

    return { articles: resultArr };
  }

  async getAllArticles(token, swither, query) {
    //         const articles1 = await ArticleModel.find({tagList: { $in:["asdas", "asdas123"]}})
    // console.log(articles1);

    // const twts = await ArticleModel.aggregate([
    //     // Unwind the array
    //     { "$unwind": "$tagList" },

    //     // Group on tags with a count
    //     { "$group": {
    //         "_id": "$tagList",
    //         "count": { "$sum": 1 }
    //     }},
    //     // {"$sortByCount" : "$favourites.location_name"},
    //     // Optionally sort the tags by count descending
    //     { "$sort": { "_id": -1 } },

    //     // Optionally limit to the top "n" results. Using 10 results here
    //     { "$limit": 10 }
    // ])
    // console.log(twts);
    // const arr = []
    // twts.forEach(e => {
    //     arr.push(e._id)
    // })
    // console.log(arr);
    let articles;
    if (token) {
      const userData = await TokenModel.findOne({ refreshToken: token });

      const userId = await userData.user.toString();
      const user = await UserModel.findOne({ _id: userId });

      if (swither == "tag") {
        articles = await ArticleModel.find({ tagList: { $in: [query] } });
      } else if (swither == "author") {
        articles = await ArticleModel.find({ "author.username": query });
      } else if (swither == "favorited") {
        articles = await ArticleModel.find({ favoritedUser: { $in: [query] } });
      } else {
        articles = await ArticleModel.find();
      }

      articles.forEach((article) => {
        if (article.favoritedUser.indexOf(user.name) !== -1) {
          article.favorited = true;
        }
      });
    } else {
      articles = await ArticleModel.find();
    }
   
    return articles.reverse();
  }

  async update(slug, title, description, body, tagList) {
    const article = await ArticleModel.findOne({ slug });
    if (!article) {
      throw ApiError.BadRequest("Данная статья не найдена");
    }
    await ArticleModel.updateOne(
      { slug },
      {
        title: title,
        description: description,
        body: body,
        tagList: tagList,
      }
    );
    const newArticle = await ArticleModel.findOne({ slug });
    // newArticle.save()
    return { article: newArticle };
  }

  async delete(slug) {
    const article = await ArticleModel.findOne({ slug });

    if (!article) {
      throw ApiError.BadRequest("Данная статья не найдена");
    }
    await ArticleModel.deleteOne({ slug });
    return true;
  }

  async upFavoriteCount(slug, token) {
    const article = await ArticleModel.findOne({ slug });
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });
    article.favoritesCount++;
    article.favoritedUser.push(user.name);
    article.save();

    return article;
  }
  async downFavoriteCount(slug, token) {
    const article = await ArticleModel.findOne({ slug });
    const userData = await TokenModel.findOne({ refreshToken: token });
    const userId = userData.user.toString();
    const user = await UserModel.findOne({ _id: userId });
    article.favoritesCount--;

    const indexFavorName = article.favoritedUser.indexOf(user.name);
    if (indexFavorName == -1) {
      throw ApiError.BadRequest(`Ошибка авторизации`);
    }
    article.favoritedUser.splice(indexFavorName - 1, 1);
    article.save();
    return article;
  }
}

module.exports = new ArticleService();
