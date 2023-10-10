const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    // ClientId: { type: String, trim: true, required: true, unique: true },
    // AgencyId: { type: String, trim: true, required: true },
    AgencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agencies",
      required: true,
    },
    Name: { type: String, trim: true, required: true },
    Email: { type: String, trim: true, required: true, unique: true },
    PhoneNumber: { type: String, trim: true, required: true, unique: true },
    TotalBill: { type: mongoose.Schema.Types.Decimal128, required: true },
  },
  { timestamps: true }
);

ClientSchema.virtual("ClientId").get(function () {
  return this._id.toHexString();
});

ClientSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Clients", ClientSchema);
