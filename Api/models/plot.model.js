module.exports = mongoose => {
  const Plots = mongoose.model(
    "plots",
    mongoose.Schema({
      address: String,
      metadata: String,
      ipfs: String
    },
    { 
      timestamps: true
    })
  );
  return Plots;
}