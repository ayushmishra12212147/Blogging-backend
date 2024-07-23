const Article = require('../models/article.js');
const User = require('../models/user.js');







const createArticle = async (req, res) => {
    //after authentication , email and hashed password and that we need to store
    //in the req

    const id = req.userId;

    // console.log('id', { id })
    const author = await User.findOne({ id }).exec();


    const { title, description, body, tagList } = req.body.article;

    if (!title||!description || !body) {
        return res.status(400).json({ message: "All fileds are required" });
    }


    const article= await Article.create({title, description, body})
    // console.log({article});
    article.author=id;
    if(Array.isArray(tagList) && tagList.length>0){
        article.tagList=tagList;

    }
    await article.save();
    return res.status(200).json({ article:await article.toArticleResponse(author) });


}


const feedArticles = async (req, res) => {
    Article.find({})
    .then(articles => {
        res.json(articles);  // Send JSON response with the articles
    })
    .catch(err => {
        console.error('Error fetching articles', err);
        res.status(500).json({ error: 'Error fetching articles' });
    });
    
}


const getArticleWithSlug = async (req,res) => {
    const {slug} = req.params;

    const article = await Article.findOne({slug}).exec();

    if(!article){
        return res.status(401).json({
            message:'Article Not Found'
        })
    }

    return res.status(200).json({
        article:await article.toArticleResponse(false)
    })
}




module.exports = {
    createArticle,
    feedArticles,
    getArticleWithSlug

}
