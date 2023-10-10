const mongoose = require("mongoose");

const AgencySchema = new mongoose.Schema(
  {
    // AgencyId: { type: String, trim: true, required: true, unique: true },
    Name: { type: String, trim: true, required: true },
    Address1: { type: String, trim: true, required: true },
    Address2: { type: String, trim: true },
    State: { type: String, trim: true, required: true },
    City: { type: String, trim: true, required: true },
    PhoneNumber: { type: String, trim: true, required: true, unique: true },
  },
  { timestamps: true }
);

AgencySchema.virtual("AgencyId").get(function () {
  return this._id.toHexString();
});

AgencySchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Agencies", AgencySchema);
