const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./user');
const slugify = require('slugify')

//each fields emsures mongodb follow this rules 
const articleSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    tagList: [{
        type: String,
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    favouriteCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},
     {
        timestamps: true
    }

)





articleSchema.plugin(uniqueValidator);

//middleware we want to run before saving for pre as server event , run a function before saving 

articleSchema.pre('save', function(next){
    this.slug=slugify(this.title,{lower:true , replacement:'-'});
    next();
})



articleSchema.methods.toArticleResponse = async function (user) {
    const authorObj = await User.findById(this.author).exec();
  
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favourited: false,
      favouritesCount: this.favouritesCount,
      author: authorObj.toProfileJSON(user),
    };
  };






module.exports = mongoose.model('Article', articleSchema);