const Router = require('express').Router;
const tagsController = require('../controllers/tags-controller');
const router = new Router();

router.get('/', tagsController.getTopTen);


module.exports = router