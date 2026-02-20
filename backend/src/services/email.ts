import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import handlebars from "handlebars";

dotenv.config();

// Production-grade transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: false,
  debug: false,
});

/**
 * Send an email using a Handlebars template
 * @param from - sender email
 * @param to - recipient email
 * @param subject - email subject
 * @param templateName - template filename, e.g. "reset-password.html"
 * @param context - dynamic values to replace in template
 */

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  templateName: string, // this is complete pasth for the template name. it is being provided by the parents who uses this services
  context: { [key: string]: any },
) => {
  try {
    const templateSource = await fs.readFile(templateName, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(context);

    await transporter.sendMail({ from, to, subject, html });
  } catch (error: any) {
    console.error("❌ EMAIL ERROR:");
    console.error("Message:", error.message);
    console.error("Path:", error.path);
    console.error("Stack:", error.stack);
  }
};