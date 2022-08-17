import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import exchange from "../../../../lib/queue";
import dbConnect from "../../../../lib/dbConnect";

dbConnect();

export default async function emailVerify(req, res) {
	console.log("Received email verify request");
	const { token } = req.query;
	try {
		const existingUser = await User.findOne({ tempToken: token });

		if (!existingUser) {
			throw { status: 400, message: "Invalid token or token may has expired" };
		}

		if (existingUser.emailVerified) {
			throw { status: 400, message: "Account already activated" };
		}

		const isValid = jwt.verify(token, process.env.SECRET_KEY);

		if (isValid) {
			existingUser.emailVerified = true;
			existingUser.tempToken = false;

			await existingUser.save();
		} else {
			throw { status: 400, message: "Invalid token or token may has expired" };
		}

		await exchange.publish(
			{
				email: existingUser.email,
				subject: "Account activated",
				text: "Hello, your account is successfully activated!",
			},
			{ key: "mail_queue" }
		);

		res.status(200).json({ existingUser, message: "Account activated" });
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message });
	}
}
