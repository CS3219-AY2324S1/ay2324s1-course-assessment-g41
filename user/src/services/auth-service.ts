import jwt from "jsonwebtoken";
import postgresClient from "@/clients/postgres";
import { RefreshToken } from "@/models/auth";
import { google } from "googleapis";

interface AccessPayload extends jwt.JwtPayload {
  userId: string;
}

interface RefreshPayload extends jwt.JwtPayload {
  userId: string;
  tokenId: string;
}

export class AuthService {
  private googleClient;
  private jwtSecret;

  constructor() {
    this.googleClient = new google.auth.OAuth2(
      process.env.OAUTH_GOOGLE_CLIENT,
      process.env.OAUTH_GOOGLE_SECRET,
      process.env.AUTH_DOMAIN + "/auth/google/callback"
    );

    // const secret = "secret";
    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.log("Missing JWT_SECRET wtf");
      process.exit();
    }

    this.jwtSecret = secret;
  }

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: "1h" });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const currentTimestampSeconds = Math.floor(Date.now() / 1000);

    const thirtyDaysSeconds = 30 * 24 * 60 * 60;
    const thirtyDaysTimestamp = currentTimestampSeconds + thirtyDaysSeconds;

    const token = await authService.createRefreshToken(
      userId,
      thirtyDaysTimestamp
    );
    return jwt.sign({ userId, tokenId: token.id }, this.jwtSecret, {
      expiresIn: "30d",
    });
  }

  verifyAccessToken(token: string): AccessPayload {
    const decoded = jwt.verify(token, this.jwtSecret) as AccessPayload;
    return decoded;
  }

  verifyRefreshToken(token: string): RefreshPayload {
    const decoded = jwt.verify(token, this.jwtSecret) as RefreshPayload;
    return decoded;
  }

  getGoogleAuthURL() {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    return this.googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });
  }

  async googleCallback(code: string) {
    try {
      const tokenResp = await this.googleClient.getToken(code);
      await this.googleClient.setCredentials(tokenResp.tokens);
      const credentials = this.googleClient.credentials;

      const accessToken = credentials.access_token;
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token${accessToken}`
      );
      const data = await res.json();

      return data;
    } catch (err) {
      console.log("Google callback failed");
    }
  }

  async createRefreshToken(
    user_id: string,
    expiry: number
  ): Promise<RefreshToken> {
    try {
      const query = `
                INSERT INTO refresh_tokens (user_id, revoked, expiry)
                VALUES ($1, FALSE, to_timestamp($2))
                RETURNING *;
            `;

      const result = await postgresClient.query<RefreshToken>(query, [
        user_id,
        expiry,
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async readRefreshToken(id: string): Promise<RefreshToken | null> {
    try {
      const query = "SELECT * FROM refresh_tokens WHERE id = $1";
      const result = await postgresClient.query<RefreshToken>(query, [id]);

      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  async deleteRefreshToken(id: string): Promise<void> {
    try {
      const query = "DELETE FROM refresh_tokens WHERE id = $1";
      await postgresClient.query(query, [id]);
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
