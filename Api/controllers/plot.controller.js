const db = require("../models");
const Plot = db.Plots;

//create and save new plot
exports.create = (req, res) => {
  //check if the request body is empty
  if (!req.body) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }

  //create the plot 
  const plot = new Plot({
    address: req.body.address,
    metadata: req.body.metadata,
    ipfs: req.body.ipfs
  });

  //save
  plot.save(plot)
    .then(data => {
      res.status(201).send({
        res: "OK",
        msg: "Insert successfully"
      });
    })
    .catch(err => {
      console.log("err:", err);
      res.status(500).send({
        res: "KO",
        msg: "Insert error"
      });
    });
};

//find a plot by address
exports.findByAddress = (req, res) => {
  const address = req.params.address;

  if (!address) {
    res.status(400).send({
      res: "KO",
      msg: "No data"
    });
    return;
  }

  Plot.findOne({address: address})
    .then(data => {
      if (!data) {
        res.status(400).send({
          res: "KO",
          msg: "Plot not found"
        });
      } else {
        res.status(200).send({
          res: "OK",
          msg: data
        });
      }
    })
    .catch(err => {
        res.status(400).send({
          res: "KO",
          msg: "Error getting data"
        });
    });
};