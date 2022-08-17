import mongoose from "mongoose";

const fileSchema = mongoose.Schema(
	{
		name: String,
		lang: String,
		content: String,
		public: { type: Boolean, default: false },
		authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.File || mongoose.model("File", fileSchema);
