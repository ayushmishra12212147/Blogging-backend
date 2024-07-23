const bcrypt = require('bcrypt');
const User = require('../models/user.js');






const userlogin = async (req, res) => {
    const { user } = req.body;
    if (!user || !user.email || !user.password) {
        return res.status(400).json({ message: "all fields are required" });
    }

    //since email is unique , we will use this to search 
    const loginUser = await User.findOne({ email: user.email }).exec();

    if (!loginUser) {
        // console.log({loginUser})
        return res.status(404).json({ message: "User not found" })


    }


    //Checking and matching the password
    const match = await bcrypt.compare(user.password, loginUser.password);


    if (!match) {
        return res.status(401).json({ message: "Wrong Password" });


    }
    return res.status(200).json({
        user: loginUser.toUserResponse()
    });





    res.status(200).send({ loginUser });
}

const registeruser = async (req, res) => {

    //logic to register user
    const {user}= req.body;
    console.log(user)
    if (!user || !user.email || !user.password || !user.username) {
        return res.status(400).json({ message: "all fields are required" });
    }

    //hasing + salting (adding unique String to it ) =>encryptinh the password
    const hashPass = await bcrypt.hash(user.password, 10);//10 is the salting number for string size
    const userObject = {
        username: user.username,
        email: user.email,
        password: hashPass
    }


    //using our defined schema to create user
    const createdUser = await User.create(userObject);
    if (createdUser) {
        res.status(201).json({
            user: createdUser.toUserResponse(),
        });
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user",
            },
        });
    }
}

const getCurrentUser = async (req, res) => {
    //after authentication , email and hashed password and that we need to store
    //in the req

    const email = req.userEmail;

    // console.log('email',{email})
    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });  
    }
    return res.status(200).json({ user: user.toUserResponse() });


}

const updateUser = async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({ message: "Required a user Object" })


    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();
    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPass = await bcrypt.hash(user.password, 10);
        target.password = hashedPass;
    }



    if (typeof user.image !== 'undefined') {
        target.image = user.image;
    }


    if (typeof user.bio !== 'undefined') {
        target.bio = user.bio;
    }

    await target.save();
    return res.status(200).json({
        user: target.toUserResponse()

    });
}



module.exports = {
    userlogin,
    registeruser,
    getCurrentUser,
    updateUser
}
