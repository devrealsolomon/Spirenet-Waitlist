import nodemailer from "nodemailer";
import path from "path";
import hbs from 'nodemailer-express-handlebars';
import { MongoClient } from 'mongodb';

const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./templates/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./templates/"),
    extName: ".hbs",
  };
  
  async function ContactApi(req, res) {
    const { email } = req.body;
  
    const transporter = nodemailer.createTransport({
      port: 465,
      secure: true,
      host: process.env.CONTACT_FORM_HOST,
      auth: {
        user: process.env.CONTACT_FORM_SEND_EMAIL,
        pass: process.env.CONTACT_FORM_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
    transporter.use("compile", hbs(handlebarOptions));
  
    try {
      await transporter.sendMail({
        from: `Spirenet`,
        replyTo: email,
        to: email,
        subject: `Thanks For Joining`,
        template: "welcome",
      });
  
      // Save the email in MongoDB
      const uri = process.env.MONGODB_URI;
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
      await client.connect();
      const db = client.db("spire");
      const collection = db.collection("waitlist");
  
      // Create a document and insert it into the collection
      await collection.insertOne({ email });
  
      await client.close();
  
      res.status(200).json({ message: "success" });
    } catch (err) {
      res.status(500).json({ message: "an error occurred" });
      console.log(err);
    }
  }

module.exports = ContactApi;
