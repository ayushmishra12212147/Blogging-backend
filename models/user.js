const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//each fields emsures mongodb follow this rules 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is valid'], //to check if its valid or nor i.e. it has @ and .(dot) in it
        index: true //optimizing query performance i.e. Searching 
    }
})



userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign({
        user: {
            id: this._id,
            email: this.email,
            password: this.password
        }
    },
        process.env.accessSecretToken,
        {
            expiresIn: "1d"
        }
    )
    return accessToken;
}




userSchema.methods.toUserResponse = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateAccessToken()

    }
}



userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: 10

    }
}

module.exports = mongoose.model('User', userSchema);