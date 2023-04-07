module.exports = app => {
  const web3Controller = require("../web3/web3.controller.js");
  const router = require("express").Router();

  //transfer token
  router.post('/transfer-token', web3Controller.transferToken);
  //transfer matic
  router.post('/transfer-matic', web3Controller.transferMatic);
  //check if plot is assigned
  router.get('/plot-assigned/:id', web3Controller.plotAssigned);
  //save Plot info to IPFS
  router.post('/save-plot', web3Controller.savePlotToIPFS);
  
  app.use("/api/web3", router);
}