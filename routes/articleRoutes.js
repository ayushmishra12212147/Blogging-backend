const express = require('express');
const articlesController = require('../controllers/articlesController')
const verifyJWT = require('../middleware/verifyJWT')
const router = express();



//to publish a article
router.post('/', verifyJWT, articlesController.createArticle);


//to display all articles in feed format
router.get('/feed', verifyJWT, articlesController.feedArticles);





module.exports = router;
