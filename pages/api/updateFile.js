import jwt from "jsonwebtoken";
import File from "../../models/File";
import dbConnect from "../../lib/dbConnect";

dbConnect();

export default async function updateFile(req, res) {
	console.log("Received update file request");
	try {
		const data = jwt.verify(req.headers.token, process.env.SECRET_KEY);

		req.body.userId = data?.id;
		if (!req.body.userId)
			throw { status: 400, message: "Please login to continue" };

		const filter = { _id: req.body.fileId, authorId: req.body.userId };
		const update = {
			name: req.body.name,
			lang: req.body.lang,
			content: req.body.content,
			public: req.body.public,
		};

		const file = await File.findOneAndUpdate(filter, update, { new: true });

		if (!file) throw { status: 404, message: "File not found" };

		res.status(201).json({ success: true, file });
	} catch (err) {
		res.status(err.status || 500).json({
			success: false,
			message: err.message || "Something went wrong",
		});
	}
}
