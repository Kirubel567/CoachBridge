import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {prisma} from "../config/prisma";
import { v4 as uuidv4 } from "uuid";

import {
  HTTP_STATUS,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
} from "../config/constants";
import { LoginRequest, SignupRequest, RefreshTokenRequest } from "../types";
// import { createNotificationService } from "../services/notification";
import { client } from "../services/google";

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshExpiry = rememberMe ? "30d" : "1d";
    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: refreshExpiry }
    );

    res.json({
      status: "success",
      message: "User logged in successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

        // Trainer optional fields
        bio: user.bio,
        yearsOfExperience: user.yearsOfExperience,
        certifications: user.certifications,
        specialties: user.specialties,
        hourlyRate: user.hourlyRate,
        contactInstagram: user.contactInstagram,
        contactWebsite: user.contactWebsite,
        contactTelegram: user.contactTelegram,

        // Client optional fields
        dateOfBirth: user.dateOfBirth,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        fitnessGoals: user.fitnessGoals,
        membershipActive: user.membershipActive,
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: rememberMe ? 3600 * 24 * 30 : 3600 * 24,
      },
    });

    console.log("user logged in:", user);

  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: error.message,
    });
  }
};

export const signup = async (
  req: Request<{}, {}, SignupRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, role, fullName } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Full name, email, and password are required",
      });
      return;
    }

    // Validate role
    if (role !== "trainer" && role !== "trainee" && role !== "admin") {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Invalid user role",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Email is already registered",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const userId = uuidv4();
    // Generate verification token
    const verificationToken = jwt.sign(
      { userId, email, type: "email_verify" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Create user
    const user = await prisma.user.create({
      data: {
        id: userId,
        fullName,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Generate access & refresh tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      message: "Account created successfully. Please check your email for verification.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600,
      },
    });
  } catch (error: any) {
    console.error("Error during signup:", error);
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
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: "error",
      message: "Invalid or expired refresh token",
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
    if (!token || typeof token !== "string" || !newPassword) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Token and new password are required",
      });
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
      data: { password: hashedPassword },
    });

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

/**
 * Step 1: Redirect user to Google for authentication
 */
export const redirectToGoogle = (req: Request, res: Response) => {
  const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI as string);
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
      return res.status(400).json({ status: "error", message: "Missing authorization code" });
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
      return res.status(401).json({ status: "error", message: "Invalid Google user data" });
    }

    // Check or create user
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    const { v4: uuidv4 } = await import("uuid"); 
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: payload.email,
          fullName: `${payload.given_name || "User"} ${payload.family_name || ""}`,
          password: "", // no password since Google login
          role: "trainee", // default role
          // optional fields can be left undefined
        },
      });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(redirectUrl);

  } catch (error: any) {
    console.error("Error handling Google callback:", error);
    res.status(500).json({ status: "error", message: "Failed to process Google callback" });
  }
};