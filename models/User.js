import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		emailVerified: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
