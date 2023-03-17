module.exports = app => {
  const moralisc = require("../moralis/moralis.controller.js");
  const router = require("express").Router();

  //request message
  router.post("/request-message", moralisc.request);
  //verify
  router.post("/sign-message", moralisc.verify);
  //transfer token
  router.post('/transfer-token', moralisc.transferToken);
  //transfer matic
  router.post('/transfer-matic', moralisc.transferMatic);
  //check if plot is assigned
  router.get('/plot-assigned/:id', moralisc.plotAssigned);
  //save Plot info to IPFS
  router.post('/save-plot', moralisc.savePlotToIPFS);
  //mint and assign the token
  // router.post('/assign', moralisc.assign);
  
  app.use("/api/moralis", router);
}