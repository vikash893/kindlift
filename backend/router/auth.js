const express = require("express"); 
const User = require("../models/User");

const authRouter = express.Router(); 


authRouter.get("/" , async(req ,res)=>{
    res.send("yes it is working");
})


authRouter.post("/register", async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        // Validation
        if (!name || !phone || !email || !password){
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // Check existing user
        const existuser = await User.findOne({email});

        if (existuser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create user
        const user = new User({
            user_id: "USR" + Date.now(),
            name,
            phone,
            email,
            password, 
            coin : 0 , 
            rating:0 ,
        });

        await user.save();

        return res.status(200).json({
            message: "User registered successfully"
        });

    } catch (error) {

        // Handle duplicate error properly
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Phone or Email already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password){
            return res.status(400).json({
                error: "Please enter all the fields"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user){
            return res.status(400).json({
                error: "User does not exist"
            });
        }

        // Compare password (plain text for now)
        if (user.password !== password){
            return res.status(400).json({
                error: "Invalid password"
            });
        }

        return res.status(200).json({
            message: "User login successfully",
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

module.exports = authRouter ;