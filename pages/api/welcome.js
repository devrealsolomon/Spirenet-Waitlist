import Mongoconnect from "../../utils/dbConnect";
import Waitlist from "../../model/waitlist";
import sendEmail from "../../utils/sendEmail";
import welcomeEmail from "../../templates/welcome";

export default async function handler(req, res) {
  await Mongoconnect();

  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please add your email");
  }

  if (email) {
    let user = await Waitlist.findOne({ email });

    if (user) {
      res.status(400).json({
        message: "You are already on our waitlist",
        success: false,
      });
      return;
    } else {
      await Waitlist.create({
        email,
      });
    }
  }

  try {
    const name = "Spirenetians";
    const emailTemplate = welcomeEmail(name);
    const to = email;
    const subject = "Thanks For Joining";
    const html = emailTemplate.html;

    await sendEmail(to, subject, html);
    console.log("Welcome Email sent!");
    res.status(200).json({ success: true, message: "Waitlist Email Sent" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Email not sent, please try again" });
  }
}
