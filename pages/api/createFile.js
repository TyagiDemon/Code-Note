import jwt from "jsonwebtoken";
import File from "../../models/File";
import dbConnect from "../../lib/dbConnect";

dbConnect();

export default async function createFile(req, res) {
	console.log("Received create file request");
	try {
		const data = jwt.verify(req.headers.token, process.env.SECRET_KEY);

		req.body.userId = data?.id;
		if (!req.body.userId)
			throw { status: 400, message: "Please login to continue" };

		const file = await File.create({
			name: req.body.name,
			lang: req.body.lang,
			content: req.body.content,
			authorId: req.body.userId,
		});

		await file.save();

		res.status(201).json({ success: true, file });
	} catch (err) {
		res.status(err.status || 500).json({
			success: false,
			message: err.message || "Something went wrong",
		});
	}
}
