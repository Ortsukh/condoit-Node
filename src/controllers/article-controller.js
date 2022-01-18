const articleService = require("../services/article-service");

class ArticleController {
  async create(req, res, next) {
    try {
      const { title, description, body, tagList } = req.body;
      const token = req.cookies.refreshToken;
      const articleData = await articleService.create(
        title,
        description,
        body,
        tagList,
        token
      );
      return res.json(articleData);
    } catch (e) {
      next(e);
    }
  }

  async getById(req, res, next) {
    try {
      const slug = req.params.slug;
      const article = await articleService.getById(slug);
      return res.json({ article: article });
    } catch (e) {
      next(e);
    }
  }
  async getYourFeedArticles(req, res, next) {
    try {
      const token = req.cookies.refreshToken;

      const article = await articleService.getYourFeedArticles(token);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }
  async getAllArticles(req, res, next) {
    try {
      const queryData = req.query;
      const token = req.cookies.refreshToken;
      let articles;
      if (queryData.tag) {
        articles = await articleService.getAllArticles(
          token,
          "tag",
          queryData.tag
        );
      } else if (queryData.author) {
        articles = await articleService.getAllArticles(
          token,
          "author",
          queryData.author
        );
      } else if (queryData.favorited) {
        articles = await articleService.getAllArticles(
          token,
          "favorited",
          queryData.favorited
        );
      } else {
        articles = await articleService.getAllArticles(token);
      }
      // if(author in queryData){
      //     const articles = await articleService.getAllArticles(queryData.author);
      //     return res.json(articles);
      // }

      return res.json({ articles: articles });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const slug = req.params.slug;
      const { title, description, body, tagList } = req.body;
      const article = await articleService.update(
        slug,
        title,
        description,
        body,
        tagList
      );
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const slug = req.params.slug;
      const result = await articleService.delete(slug);
      if (result) {
        res.writeHead(202, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Delete complite" }));
      }
    } catch (e) {
      next(e);
    }
  }

  async upFavoriteCount(req, res, next) {
    try {
      const slug = req.params.slug;
      const token = req.cookies.refreshToken;

      const article = await articleService.upFavoriteCount(slug, token);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }
  async downFavoriteCount(req, res, next) {
    try {
      const slug = req.params.slug;
      const token = req.cookies.refreshToken;

      const article = await articleService.downFavoriteCount(slug, token);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ArticleController();
