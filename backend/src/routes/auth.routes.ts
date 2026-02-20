import express from "express";
import {
  login,
  signup,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changeEmail,
  verifyChangeEmail,
  changePassword,
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
 *                 example: jiru@gmail.com
 *               password:
 *                 type: string
 *                 example: topsecret
 *     responses:
 *       200:
 *         description: User logged in successfully. business_name is null for other roles except enterprise.
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
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     business_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                     joined_at:
 *                       type: string
 *                       format: date-time
 *                 token:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */

router.post("/login", login);
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Sign up endpoint. business_name is null for other roles except enterprise.
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
 *               - phone_number
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Jiru
 *               last_name:
 *                 type: string
 *                 example: Gutema
 *               business_name:
 *                 type: string
 *                 example: LTD Trading
 *               email:
 *                 type: string
 *                 example: jirudagutema@gmail.com
 *               role:
 *                 type: enum [entrepreneur, enterprise, buyer] 
 *                 example: entrepreneur (default 'buyer')
 *               phone_number:
 *                 type: string
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Account created successfully. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                        
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     business_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     role:
 *                       type: string
 *                     joined_at:
 *                       type: string
 *                       format: date-time
 *                 token:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     expires_in:
 *                       type: integer
 *       400:
 *         description: Email already registered
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
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: new.jwt.access.token.here
 *                 refresh_token:
 *                   type: string
 *                   example: new.refresh.token.here
 *       401:
 *         description: Unauthorized
 */

router.get("/refresh", authenticate, refreshToken);
/**
 * @openapi
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify user email address
 *     description: >
 *       Verifies a user's email using the token sent to their email address.
 *       The token is included as a query parameter in the URL.
 *       Once verified, the user's account will be marked as `email_verified: true`.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The verification token sent via email.
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid or expired token
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
 *                   example: Invalid or expired verification token
 *       404:
 *         description: User not found
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
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/verify-email", verifyEmail);
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully. them email contains a new token for resetting the password. which later used in the reset-password endpoint.
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
 *                   example: Password reset email sent successfully
 *       400:
 *         description: User not found
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
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

router.post("/forgot-password", forgotPassword);
/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     description: >
 *       Resets the user's password using a token sent to their email.
 *       The token is included in the request query and new password should be included in the request body.
 *     parameters:
 *       - in: query
 *         name: token
 *         description: password-change verification token
 *         required: true
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 *                   example: Password reset successfully
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
/**
 * @swagger
 * /api/v1/auth/change-email:
 *   patch:
 *     summary: Request email change
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Confirmation email sent to new address
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
 *                   example: Confirmation email sent to new address
 *       400:
 *         description: Bad request — missing or invalid newEmail, or email already in use
 *       401:
 *         description: Unauthorized — invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.patch("/change-email", authenticate, changeEmail);

/**
 * @swagger
 * /api/v1/auth/verify-change-email:
 *   patch:
 *     summary: Verify and apply email change
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         description: Email-change verification token
 *         required: true
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Email address updated successfully
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
 *                   example: Email address updated successfully
 *       400:
 *         description: Invalid or missing token
 *       401:
 *         description: Unauthorized — invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.patch("/verify-change-email", verifyChangeEmail);
/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Changes the user's password from the user dashboard. The user must provide their current password and the new password.
 *       The request must be authenticated with a valid JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldStrongPassword123!
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully
 */
router.post("/change-password", authenticate, changePassword);
// 🌐 Redirect-based Google OAuth login (for browser login)
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