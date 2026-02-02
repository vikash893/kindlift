
const express = require('express');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs')
const User = require('../models/User')


const adminRouter = express();


adminRouter.get("/check" , async(req ,res) =>{
    res.send("Working")
})



adminRouter.post("/register" , async(req ,res) => {
try {
        const {name , phone , password , email} = req.body 
        const hashpassword = await bcrypt.hash("password" , 10);

    if (!name || ! phone || ! password || ! email){
        res.status(400).json({
            error :"All fields are required"
        })
    }

    if (password.length != 6){
        res.status(400).json({
            error : "Password should be of length 6"
        })
    }

    if (phone.length != 10){
         res.status(400).json({
            error : "Password should be of length 6"
        })
    }

    const admin = new AdminUser({
        name, 
        phone ,
        password : hashpassword, 
        email 
    })
    
    await admin.save() ;

    res.status(400).json({
        message : "Admin login sucessfully"
    })
} catch (error) {
    res.status(500).json({
        error : "Internal Server error"
    })
}
})

adminRouter.post("/login" , async(req ,res) => {
    try {
        const {name , password } = req.body ; 
    if (!name || ! password) {
        res.status(400).json({
            error : "All field are required please enter all the fields"
        })
    }

    const admin = await AdminUser.findOne({name});

    if (!admin) {
        res.status(400).json({
            error : "User not found"
        })
    }

    res.status(200).json({
        message : "Login sucessfully"
    })

    const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
          return res.status(400).json({ error: "Invalid password" });
    
        const userData = user.toObject();
        delete userData.password; 

    } catch (error) {
        res.status(500).json({
            error : "internal server error "
        })
    }
})

// get total users 
adminRouter.get("/getusers", async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.status(200).json({
      message: "Total Users",
      userCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// delete user 
adminRouter.delete("/delete-user/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deletedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// update user 
adminRouter.put("/update-user/:email",  async (req, res) => {
  try {
    const { email } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { email },        // find by email
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get user details
adminRouter.get("/get-user/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = adminRouter ;