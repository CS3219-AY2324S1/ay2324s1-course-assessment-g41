import { Request, Response } from "express";
import authService from "@/services/auth-service";
import userService from "@/services/user-service";

const testEmail = "example@email.com";

const cookieConfig = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
};

if (!process.env.LOGIN_REDIRECT_URL) {
  console.log("Missing LOGIN_REDIRECT_URL");
  process.exit();
}
const loginRedirectURL = process.env.LOGIN_REDIRECT_URL;

if (!process.env.ACCESS_COOKIE_KEY) {
  console.log("Missing ACCESS_COOKIE_KEY");
  process.exit();
}
const accessTokenKey = process.env.ACCESS_COOKIE_KEY;

if (!process.env.REFRESH_COOKIE_KEY) {
  console.log("Missing REFRESH_COOKIE_KEY");
  process.exit();
}
const refreshTokenKey = process.env.REFRESH_COOKIE_KEY;

export async function googleAuth(req: Request, res: Response): Promise<void> {
  if (process.env.EXE_ENV === "DEV" && process.env.SKIP_LOGIN_AUTH === "TRUE") {
    let user = await userService.readByEmail(testEmail);

    if (!user) {
      user = await userService.create(testEmail, "");
    }

    const accessToken = await authService.generateAccessToken(user!.id);
    const refreshToken = await authService.generateRefreshToken(user!.id);

    res.cookie(accessTokenKey, accessToken, cookieConfig);
    res.cookie(refreshTokenKey, refreshToken, cookieConfig);

    res.status(200).json(user);
  }
  const authUrl = authService.getGoogleAuthURL();
  res.redirect(authUrl);
}

export async function googleRedirect(
  req: Request,
  res: Response
): Promise<void> {
  const code = req.query.code;

  try {
    const userInfo = await authService.googleCallback(code as string);

    let user = await userService.readByEmail(userInfo.email);

    if (!user) {
      user = await userService.create(userInfo.email, userInfo.picture);
    }

    const accessToken = await authService.generateAccessToken(user!.id);
    const refreshToken = await authService.generateRefreshToken(user!.id);

    res.cookie(accessTokenKey, accessToken, cookieConfig);
    res.cookie(refreshTokenKey, refreshToken, cookieConfig);

    res.redirect(loginRedirectURL);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    res.status(500).json({ message: "Google Auth failed" });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies[refreshTokenKey];

  if (token) {
    try {
      const decodedToken = authService.verifyRefreshToken(token);

      const tokenStore = await authService.readRefreshToken(decodedToken.id);
      if (!tokenStore || tokenStore.revoked) {
        console.log("Invalid refresh token");
        res.status(500).send();
      }

      // sync delete, if failed dont continue
      await authService.deleteRefreshToken(decodedToken.id);
      const accessToken = authService.generateAccessToken(decodedToken.userId);
      const refreshToken = await authService.generateRefreshToken(
        decodedToken.userId
      );

      res.cookie(accessTokenKey, accessToken, cookieConfig);
      res.cookie(refreshTokenKey, refreshToken, cookieConfig);

      res
        .status(200)
        .json({ access_token: accessToken, refresh_token: refreshToken });
    } catch (err) {
      console.log("Token verification failed", err);
      res.status(401).send();
    }
  } else {
    res.status(401).send();
  }
}

export async function checkAuth(req: Request, res: Response): Promise<void> {
  const token = req.cookies[accessTokenKey];

  if (token) {
    try {
      authService.verifyAccessToken(token).userId;

      res.status(200).send();
    } catch (err) {
      res.status(401).send();
    }
  } else {
    res.status(401).send();
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.cookies[refreshTokenKey];

  if (token) {
    try {
      const id = authService.verifyRefreshToken(token).tokenId;
      await authService.deleteRefreshToken(id);

      res.clearCookie(accessTokenKey, cookieConfig);
      res.clearCookie(refreshTokenKey, cookieConfig);

      res.status(200).send();
    } catch (err) {
      res.status(401).send();
    }
  } else {
    res.status(400).send();
  }
}
