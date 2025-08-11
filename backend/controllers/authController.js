const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

module.exports.Signup = async (req, res, next) =>{
    try{
        const { firstname, lastname, email, phone, password } = req.body;

        if (!(firstname && lastname && email && password && phone)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required information"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.toLowerCase().trim(),
            phone:phone.trim(),
            password: hashedPassword,
        });

        const token = generateToken(user);

        const userResponse = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone:user.phone,
            createdAt: user.createdAt
        };

        res.status(201).json({ 
            success: true,
            message: "User registered successfully!",
            user: userResponse,
            token: token
        });
    }catch (error) {
        console.error("Registration error:", error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during registration"
        });
    }
}

module.exports.Login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!(email && password)){
            return res.status(400).json({
                success:false,
                message: "Please provide both email and password"
            })
        }

        const user = await User.findOne({email: email.toLowerCase()});

        if(!user) {
            return res.status(401).json({
                success:false,
                message: "Invalid email or password"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const token = generateToken(user);

        const cookieOptions = {
            expires: new Date(Date.now() + 60*60*1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        const userResponse = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            type: user.type,
        };

        res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success:true,
                message: "Login Successful!",
                user: userResponse,
                token: token
            })

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
}

module.exports.Logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout"
        });
    }
};

module.exports.UserVerification = async (req, res, next) => {
    try {
        const userData = req.user
        const user = await User.findById(userData?.id);
        if (user){
            const userResponse = {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isAdmin: user.isAdmin,
            };
            return res.status(200).json({success:true, user:userResponse, message: "Login Successful!"});
        }else{
            return res.status(401).json({ success: false, message: "User not found" });
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({
            success: false,
            message: "Error verifying user"
        });
    }
}