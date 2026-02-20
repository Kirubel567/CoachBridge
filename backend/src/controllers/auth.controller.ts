import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

import {
  HTTP_STATUS,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
} from "../config/constants";
import { LoginRequest, SignupRequest, RefreshTokenRequest } from "../types";
import { sendEmail, transporter } from "../services/email";
import path from "path";
// import { createNotificationService } from "../services/notification";
import { client } from "../services/google";

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const refreshExpiry = rememberMe ? "30d" : "1d";

    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: refreshExpiry },
    );

    res.json({
      status: "success",
      message: "User logged in successfully",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        avatar_url: user.avatar_url,
        joined_at: user.created_at,
        // Updated
        contact_telegram: user.contact_telegram,
        location_id: user.location_id,

        // New
        business_id: user.business_id,
        TIN_number: user.TIN_number,
        business_description: user.business_description,
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: rememberMe ? 3600 * 24 * 30 : 3600 * 24,
      },
    });
    console.log("user", user);
    console.log("sending email in login controller");
    if (user.role && user.role === "enterprise" && user.business_name) {
      console.log("sending email in login controller");
      await sendLoginDetectedEmail(user.business_name, user.email);
    } else if (user.first_name) {
      console.log("sending email in login controller");
      await sendLoginDetectedEmail(user.first_name, user.email);
    }

    const ipAddress =
      (req.headers["x-forwarded-for"] as string | undefined)
        ?.split(",")[0]
        ?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "unknown";

    // await createNotificationService({
    //   userId: user.id,
    //   title: "New login detected",
    //   message: `A login was detected from
    //  IP ${ipAddress} on ${new Date().toLocaleString()}.`,
    //   type: "security",
    //   related_entity_type: "UserLogin",
    // });
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: error.message,
    });
  }
};

async function sendLoginDetectedEmail(username: string, email: string) {
  const from = `"Gulit Marketplace" <${process.env.SMTP_USER}>`;
  const to = email;
  const subject = "New Login Detected - Gulit Marketplace";
  // const body = "new-login-detected.html";
  const body = path.join(
    __dirname,
    "../templates/emails/new-login-detected.html",
  );
  await sendEmail(from, to, subject, body, { username });
}

export const signup = async (
  req: Request<{}, {}, SignupRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { email, phone_number, role, password } = req.body;

    // Validate role
    if (role !== "entrepreneur" && role !== "enterprise" && role !== "buyer") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Invalid user role",
      });
      return;
    }

    // Validate required fields based on role
    if (role === "enterprise") {
      const business_name = req.body.business_name;
      if (!business_name) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: "error",
          message: "Business name is required for enterprise role",
        });
        return;
      }
    } else {
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      if (!first_name || !last_name) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: "error",
          message: "First name and last name are required",
        });
        return;
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone_number }] },
    });

    if (existingUser) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Email or phone number is already registered",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const userId = uuidv4();

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId, email, type: "email_verify" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    // Try sending email BEFORE creating the user
    try {
      if (role === "enterprise") {
        const business_name = req.body.business_name!;
        await sendVerificationEmail(business_name, email, verificationToken);
      } else {
        const first_name = req.body.first_name!;
        await sendVerificationEmail(first_name, email, verificationToken);
      }
    } catch (err) {
      console.error("Failed to send verification email:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to send verification email. Please try again.",
      });
    }

    let user;
    if (role === "buyer") {
      user = await prisma.user.create({
        data: {
          id: userId,
          first_name: req.body.first_name!,
          last_name: req.body.last_name!,
          is_approved: true,
          email,
          role: role,
          phone_number,
          password_hash: hashedPassword,
          email_verified: false,
        },
      });
    } else if (role === "enterprise") {
      user = await prisma.user.create({
        data: {
          id: userId,
          business_name: req.body.business_name!,
          email,
          role: role,
          phone_number,
          password_hash: hashedPassword,
          email_verified: false,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          id: userId,
          first_name: req.body.first_name!,
          last_name: req.body.last_name!,
          email,
          role: role,
          phone_number,
          password_hash: hashedPassword,
          email_verified: false,
        },
      });
    }

    // Create access & refresh tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );
    // await createNotificationService({
    //   userId: user.id,
    //   title: "Welcome to Gulit Marketplace",
    //   message: `Thank you for signing up, ${
    //     user.first_name || user.business_name
    //   }! We're excited to have you on board.`,
    //   type: "welcome",
    // });

    res.json({
      status: "success",
      message:
        "Account created successfully. Please check your email for verification.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        avatar_url: user.avatar_url,
        joined_at: user.created_at,
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600,
      },
    });
  } catch (error: any) {
    console.log("Error during signup:", error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: error.message,
    });
  }
};

export const refreshToken = async (
  req: Request<{}, {}, RefreshTokenRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Refresh token is required",
      });
      return;
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET!) as {
      userId: string;
      type: string;
    };

    if (decoded.type !== "refresh") {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid refresh token",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid refresh token",
      });
      return;
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN },
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    res.json({
      token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: "error",
      message: "Invalid or expired refresh token",
    });
  }
};

// Utility to send emails
const sendVerificationEmail = async (
  username: string,
  email: string,
  token: string,
) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP credentials are not set in environment variables");
  }
  const from = `"Gulit Marketplace" <${process.env.SMTP_USER}>`;
  const to = email;
  const body = path.join(__dirname, "../templates/emails/verify-email.html");
  // const body = "verify-email.html";
  const subject = "Verify Your Email - Gulit Marketplace";
  await sendEmail(from, to, subject, body, {
    username,
    verification_link: verifyLink,
  });
};

// Send verification email (after signup)
export const sendVerification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // from JWT authenticate middleware
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (user.email_verified) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already verified" });
    }

    const token = jwt.sign(
      { userId: user.id, type: "email_verify" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    if (user.role && user.role === "enterprise" && user.business_name) {
      await sendVerificationEmail(user.business_name, user.email, token);
    } else if (user.first_name) {
      await sendVerificationEmail(user.first_name, user.email, token);
    }

    return res.json({ status: "success", message: "Verification email sent" });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ status: "error", message: "Token is required" });
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Update user
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { email_verified: true },
    });

    return res.json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Email verification error:", error);
    return res
      .status(400)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Email is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    // ✅ Determine correct greeting name
    const username =
      user.role === "enterprise" && user.business_name
        ? user.business_name
        : user.first_name || "User";

    // ✅ Send reset email once, with correct arg order
    await sendResetPasswordEmail(username, user.email, user.id, resetToken);

    // Create notification log
    // await createNotificationService({
    //   userId: user.id,
    //   title: "Password Reset Requested",
    //   message: `A password reset was requested for your account on ${new Date().toLocaleString()}. If you did not request this, please ignore this email.`,
    //   type: "security",
    //   related_entity_type: "PasswordReset",
    // });

    res.json({
      status: "success",
      message: "Password reset email sent successfully",
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { newPassword } = req.body;
  const { token } = req.query;
  try {
    if (!token || !newPassword) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Token and new password are required",
      });
      return;
    }
    if (!token || typeof token !== "string") {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ status: "error", message: "Token is required" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      type: string;
    };
    if (decoded.type !== "password_reset") {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: "error",
        message: "Invalid password reset token",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword },
    });

    // await createNotificationService({
    //   userId: user.id,
    //   title: "Password Changed Successfully",
    //   message: `Your password was changed successfully on ${new Date().toLocaleString()}. If you did not perform this action, please contact support immediately.`,
    //   type: "security",
    //   related_entity_type: "PasswordChange",
    // });

    res.json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Error resetting password:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to reset password. Please try again.",
    });
  }
};

async function sendResetPasswordEmail(
  username: string,
  email: string,
  userId: string,
  resetToken: string,
) {
  if (!email) {
    console.error("❌ No email provided to sendResetPasswordEmail()");
    throw new Error("Email address is missing.");
  }

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const to = email;
  const subject = "Reset Your Password - Gulit Marketplace";
  // const body = "reset-password.html";
  const body = path.join(__dirname, "../templates/emails/reset-password.html");
  const from = `"Gulit Marketplace" <${process.env.SMTP_USER}>`;

  await sendEmail(from, to, subject, body, {
    username,
    reset_link: resetLink,
  });
}

// Utility to send change email verification email
async function sendChangeEmailEmail(
  username: string,
  email: string,
  token: string,
) {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-change-email?token=${token}`;
  const from = `"Gulit Marketplace" <${process.env.SMTP_USER}>`;
  const subject = "Confirm Your New Email - Gulit Marketplace";
  // const body = "change-email.html";
  const body = path.join(__dirname, "../templates/emails/change-email.html");
  await sendEmail(from, email, subject, body, {
    username: username,
    verification_link: verifyLink,
  });
} // * Done

async function emailChangedEmail(
  username: string,
  email: string,
  old_email: string,
  new_email: string,
) {
  const from = `"Gulit Marketplace" <${process.env.SMTP_USER}>`;
  const subject = "Your Email Has Been Changed - Gulit Marketplace";
  // const body = "email-changed.html";
  const body = path.join(__dirname, "../templates/emails/email-changed.html");
  await sendEmail(from, email, subject, body, {
    username: username,
    old_email: old_email,
    new_email: new_email,
  });
} // * Done
async function passwordChangedEmail(username: string, email: string) {
  const from = `"Gulit Marketplace" <${process.env.SMTP_USER}>`;
  const subject = "Your Password Has Been Changed - Gulit Marketplace";
  // const body = "password-changed.html";
  const body = path.join(
    __dirname,
    "../templates/emails/password-changed.html",
  );
  await sendEmail(from, email, subject, body, {
    username: username,
    reset_link: `${process.env.FRONTEND_URL}/forgot-password`,
  });
} // * Done

// Request to change email
export const changeEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { newEmail } = req.body;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: "error", message: "Unauthorized" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ status: "error", message: "User not found" });
      return;
    }
    if (!newEmail) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ status: "error", message: "New email is required" });
      return;
    }
    const existing = await prisma.user.findFirst({
      where: { email: newEmail },
    });
    if (existing) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ status: "error", message: "Email already in use" });
      return;
    }
    const token = jwt.sign(
      { userId, newEmail, type: "email_change" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );
    if (user.role && user.role === "enterprise" && user.business_name) {
      await sendChangeEmailEmail(user.business_name, newEmail, token);
    } else if (user.first_name) {
      await sendChangeEmailEmail(user.first_name, newEmail, token);
    }
    res.json({
      status: "success",
      message: "Confirmation email sent to new address",
    });
  } catch (error: any) {
    console.error("Error during change email request:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Failed to send confirmation email" });
  }
};

// Verify new email
export const verifyChangeEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ status: "error", message: "Token is required" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      newEmail: string;
      type: string;
    };
    if (decoded.type !== "email_change") {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: "error", message: "Invalid token" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ status: "error", message: "User not found" });
      return;
    }
    const existing = await prisma.user.findFirst({
      where: { email: decoded.newEmail },
    });
    if (existing) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ status: "error", message: "Email already in use" });
      return;
    }
    const old_Email = user.email;
    const new_Email = decoded.newEmail;
    const username = user.first_name || user.business_name || "User";
    await emailChangedEmail(username, decoded.newEmail, old_Email, new_Email);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { email: decoded.newEmail, email_verified: true },
    });
    // await createNotificationService({
    //   userId: decoded.userId,
    //   title: "Email Address Changed",
    //   message: `Your email address was changed to ${
    //     decoded.newEmail
    //   } on ${new Date().toLocaleString()}. If you did not perform this action, please contact support immediately.`,
    //   type: "security",
    //   related_entity_type: "EmailChange",
    // });

    res.json({
      status: "success",
      message: "Email address updated successfully",
    });
  } catch (error: any) {
    console.error("Verify change email error:", error);
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: "error", message: "Unauthorized" });
      return;
    }
    if (!currentPassword || !newPassword) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Current and new passwords are required",
      });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ status: "error", message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ status: "error", message: "Current password is incorrect" });
      return;
    }

    if (await bcrypt.compare(newPassword, user.password_hash)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "New password cannot be the same as the Current password",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });
    console.log(user.email);
    await passwordChangedEmail(
      user.first_name || user.business_name || "User",
      user.email,
    );
    res.json({ status: "success", message: "Password changed successfully" });
  } catch (error: any) {
    console.error("Error during change password:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Failed to change password" });
  }
};

export const redirectToGoogle = (req: Request, res: Response) => {
  const redirectUri = encodeURIComponent(
    process.env.GOOGLE_REDIRECT_URI as string,
  );

  const clientId = process.env.GOOGLE_CLIENT_ID as string;
  const scope = encodeURIComponent("openid email profile");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
};

/**
 * Step 2: Handle callback from Google after login
 */
export const handleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing authorization code" });
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid Google user data" });
    }

    // Check or create user
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: payload.email,
          first_name: payload.given_name || "User",
          last_name: payload.family_name || "",
          avatar_url: payload.picture || "",
          // phone_number is required by the Prisma schema; provide an empty string or a suitable default
          phone_number: "",
          email_verified: true,
          role: "buyer",
          password_hash: "",
        },
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN },
    );
    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    // Redirect or respond
    // If this is a browser flow, redirect to frontend with tokens in query params:
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(redirectUrl);

    // OR if this is an API-based flow, return JSON:
    // res.json({ status: "success", accessToken, refreshToken, user });
  } catch (error: any) {
    console.error("Error handling Google callback:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to process Google callback" });
  }
};