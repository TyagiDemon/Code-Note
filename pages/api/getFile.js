import jwt from "jsonwebtoken";
import File from "../../models/File";
import dbConnect from "../../lib/dbConnect";

dbConnect();

export default async function getFile(req, res) {
	console.log("Received get file request");
	try {
		const file = await File.findById(req.body.fileId);

		if (!file) throw { status: 404, message: "File not found" };

		if (file.public) return res.status(200).json({ success: true, data: file });

		const tokenData = jwt.verify(req.headers.token, process.env.SECRET_KEY);

		if (file.authorId !== tokenData?.id)
			throw { status: 400, message: "File is private" };

		res.status(200).json({ success: true, data: file });
	} catch (err) {
		res
			.status(err.status || 500)
			.json({ success: false, message: err.message || "Something went wrong" });
	}
}
