const Router = require('express').Router;
const articleController = require('../controllers/article-controller');
const router = new Router();

router.post('/',articleController.create);
router.get('/', articleController.getAllArticles);
router.get('/feed', articleController.getYourFeedArticles);
router.get('/:slug', articleController.getById);//author/.favorite/tags
router.put('/:slug', articleController.update);
router.delete('/:slug', articleController.delete);
router.post('/:slug/favorite', articleController.upFavoriteCount);
router.delete('/:slug/favorite', articleController.downFavoriteCount);

module.exports = router