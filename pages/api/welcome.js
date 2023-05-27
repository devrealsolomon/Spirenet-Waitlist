import Mongoconnect from "../../utils/dbConnect";
import waitlistModel from "../../model/waitlist";
import sendEmail from "../../utils/sendEmail";
import welcomeEmail from "../../templates/welcome";

export default async function handler(req, res) {
  await Mongoconnect();

  const { email } = req.body;

  if (!email || email === "") {
    return res.status(200).send({ message: "Invalid email" });
  }

  try {
    let oldUser = await waitlistModel.findOne({ email });

    if (oldUser) {
      console.log("old", oldUser);
      return res.status(200).send({ message: "You are already waitlisted" });
    }

    let user = new waitlistModel({
      email,
    });

    const emailTemplate = welcomeEmail;
    const to = email;
    const subject = "Welcome To Spirenet";
    const html = emailTemplate;

    await sendEmail(to, subject, html);

    await user.save();
    res.status(201).send({ message: "User added to waitlist successfully" });
  } catch (err) {
    res.send(err.message);
  }
}
