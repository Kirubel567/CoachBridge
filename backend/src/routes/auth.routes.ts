import express from "express";
import {
  login,
  signup,
  refreshToken,
  resetPassword,
  redirectToGoogle,
  handleCallback,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login endpoint
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *               rememberMe:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                     yearsOfExperience:
 *                       type: integer
 *                       nullable: true
 *                     certifications:
 *                       type: array
 *                       items:
 *                         type: string
 *                     specialties:
 *                       type: array
 *                       items:
 *                         type: string
 *                     hourlyRate:
 *                       type: number
 *                       nullable: true
 *                     contactInstagram:
 *                       type: string
 *                       nullable: true
 *                     contactWebsite:
 *                       type: string
 *                       nullable: true
 *                     contactTelegram:
 *                       type: string
 *                       nullable: true
 *                     dateOfBirth:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     heightCm:
 *                       type: number
 *                       nullable: true
 *                     weightKg:
 *                       type: number
 *                       nullable: true
 *                     fitnessGoals:
 *                       type: array
 *                       items:
 *                         type: string
 *                     membershipActive:
 *                       type: boolean
 *                 token:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *                       example: 86400
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 */
router.post("/login", login);


/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Signup endpoint
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [trainer, trainee, admin]
 *                 example: trainee
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Account created successfully. Please check your email for verification.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 token:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *                       example: 3600
 *       400:
 *         description: Email already registered or invalid data
 */

router.post("/signup", signup);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   get:
 *     summary: Refresh JWT token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

router.get("/refresh", authenticate, refreshToken);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Token and new password are required
 *       401:
 *         description: Invalid password reset token
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to reset password
 */
router.post("/reset-password", resetPassword);
       
// Redirect-based Google OAuth login (for browser login)
/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Redirect to Google login page
 *     tags:
 *       - Authentication
 *     description: >
 *       Redirects the user to Google's OAuth 2.0 login page.
 *       After login, Google will redirect to the callback endpoint.
 *     responses:
 *       302:
 *         description: Redirect to Google login
*/
router.get("/google", redirectToGoogle);
/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Authentication
 *     description: >
 *       Callback endpoint for Google OAuth 2.0 login. Exchanges authorization code for tokens.
 *       After successful login, the user is redirected to the frontend `/auth/success` route with a JWT token in query params.
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code returned by Google
 *     responses:
 *       302:
 *         description: Redirects to frontend /auth/success with JWT token in query parameters
 *         headers:
 *           Location:
 *             description: Frontend URL with JWT token, e.g. http://localhost:3000/auth/success?token=XXX
 *             schema:
 *               type: string
 *       400:
 *         description: Missing or invalid authorization code
 *       500:
 *         description: Google login failed
 */

// 🔁 Google OAuth callback (Google redirects here after consent)
router.get("/google/callback", handleCallback);

export default router;