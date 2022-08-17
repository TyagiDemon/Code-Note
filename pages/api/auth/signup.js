import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import exchange from "../../../lib/queue";
import dbConnect from "../../../lib/dbConnect";

dbConnect();

export default async function signup(req, res) {
	console.log("Received signup request");
	try {
		const existingUser = await User.findOne({ email: req.body.email });

		if (existingUser) {
			console.log(existingUser);
			throw { status: 400, message: "Account already exists" };
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 12);

		const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY);

		const newUser = await User.create({
			email: req.body.email,
			password: hashedPassword,
			name: req.body.name,
			tempToken: token,
		});

		await newUser.save();

		await exchange.publish(
			{
				email: req.body.email,
				subject: "Welcome! Activate your account",
				text: `Hello, please activate your account using the following link: http://localhost:3000/api/auth/emailVerify/${token}`,
			},
			{ key: "mail_queue" }
		);

		res.status(201).json({
			success: true,
			message: "Account not yet activated",
			token,
			newUser,
		});
	} catch (err) {
		res
			.status(err.status || 500)
			.json({ success: false, message: err.message });
	}
}
