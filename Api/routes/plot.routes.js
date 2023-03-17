module.exports = app => {
    const plot = require("../controllers/plot.controller.js");
    const router = require("express").Router();
    //create plot
    router.post("/", plot.create);
    //get plot info address
    router.get("/:address", plot.findByAddress);
    
    app.use("/api/plot", router);
}