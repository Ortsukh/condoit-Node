const Router = require('express').Router;

const profileController = require('../controllers/profile-controller');
const router = new Router();

router.get('/:userName', profileController.getProfile);
router.post('/:userName/follow', profileController.followProfile);
router.delete('/:userName/follow', profileController.unFollowProfile);


module.exports = router