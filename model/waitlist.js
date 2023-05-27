import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
});

export default mongoose.models.waitlistModel || mongoose.model("waitlistModel", waitlistSchema);