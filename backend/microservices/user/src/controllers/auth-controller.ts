import e, { Request, Response } from 'express';
import authService from '@/services/auth-service';
import userService from '@/services/user-service';
import { StatusCodes } from 'http-status-codes';
import { handleServiceError } from '@/controllers/error-handler';
import jwt from 'jsonwebtoken';
import { cookieConfig } from '@/constants/cookie-config';
import { accessTokenKey, refreshTokenKey } from '@/constants/token';
const { JsonWebTokenError } = jwt;

const testEmail = "example@email.com";

if (!process.env.LOGIN_REDIRECT_URL) {
  console.log("Missing LOGIN_REDIRECT_URL");
  process.exit();
}
export const loginRedirectURL = process.env.LOGIN_REDIRECT_URL;

export async function googleAuth(req: Request, res: Response): Promise<void> {
  if (process.env.EXE_ENV === "DEV" && process.env.SKIP_LOGIN_AUTH === "TRUE") {
    let user = await userService.readByEmail(testEmail);

    if (!user) {
      user = await userService.create(testEmail, "");
    }

    const accessToken = await authService.generateAccessToken(user.id, user.roles);
    const refreshToken = await authService.generateRefreshToken(user.id);

    res.cookie(accessTokenKey, accessToken, cookieConfig);
    res.cookie(refreshTokenKey, refreshToken, cookieConfig);

    res.status(StatusCodes.OK).json(user)
    return
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

    const accessToken = await authService.generateAccessToken(user.id, user.roles);
    const refreshToken = await authService.generateRefreshToken(user.id);

    res.cookie(accessTokenKey, accessToken, cookieConfig);
    res.cookie(refreshTokenKey, refreshToken, cookieConfig);

    res.redirect(loginRedirectURL);
  } catch (error) {
    console.error('googleRedirect: ', error);
    
    handleServiceError(error, res)
    res.send();
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies[refreshTokenKey];

  if (token) {
    try {
      const decodedToken = authService.verifyRefreshToken(token);

      const tokenStore = await authService.readRefreshToken(decodedToken.tokenId);
      if (!tokenStore || tokenStore.revoked) {
        res.status(StatusCodes.UNAUTHORIZED).send()
      }

      let user = await userService.read(decodedToken.userId);

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).send()
        return
      }

      // sync delete, if failed dont continue
      await authService.deleteRefreshToken(decodedToken.tokenId);
      const accessToken = authService.generateAccessToken(user?.email, user?.roles);
      const refreshToken = await authService.generateRefreshToken(
        decodedToken.userId
      );

      res.cookie(accessTokenKey, accessToken, cookieConfig);
      res.cookie(refreshTokenKey, refreshToken, cookieConfig);

      res.status(StatusCodes.OK).send()
    } catch(error) {
      if (error instanceof JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Token/Expired token"})
      } else {
        handleServiceError(error, res)
      }

      res.send();
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).send()
  }
}

export async function checkAuth(req: Request, res: Response): Promise<void> {
  const token = req.cookies[accessTokenKey];

  if (token) {
    try {
      authService.verifyAccessToken(token).userId;

      res.status(StatusCodes.OK).send()
    } catch(err) {
      res.status(StatusCodes.UNAUTHORIZED).send()
    }
  } else {
      res.status(StatusCodes.UNAUTHORIZED).send()
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
          
      res.status(StatusCodes.OK).send()
    } catch(err) {
      res.status(StatusCodes.UNAUTHORIZED).send()
    }
  } else {
      res.status(StatusCodes.OK).send()
  }
}

export class OAuthError extends Error {
  constructor(message: string) {
      super(message);
  }
}
