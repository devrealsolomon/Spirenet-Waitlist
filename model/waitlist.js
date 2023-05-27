import mongoose from 'mongoose';

const waitlistSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please add your email"],
            unique: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please enter a valid email"
            ]
        }
    }
);

export default mongoose.model("Waitlist", waitlistSchema);
