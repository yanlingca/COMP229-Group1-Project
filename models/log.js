const mongoose = require("mongoose");
const LogSchema = mongoose.Schema({
  LogNo: Number,
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  ItemDesc: String,
  TurnedInBy: String,
  ClaimedBy: String,
  Phone: String,
  ReleasedBy: String,
  DateReleased: Date,
});

module.exports = mongoose.model("Log", LogSchema);
