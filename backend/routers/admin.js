const express = require('express');


const adminRouter = express();


adminRouter.get("/check" , async(req ,res) =>{
    res.send("Working")
})



module.exports = adminRouter ;