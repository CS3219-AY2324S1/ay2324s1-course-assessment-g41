if (!process.env.ACCESS_COOKIE_KEY) {
  console.log("Missing ACCESS_COOKIE_KEY");
  process.exit();
}
export const accessTokenKey = process.env.ACCESS_COOKIE_KEY;

if (!process.env.REFRESH_COOKIE_KEY) {
  console.log("Missing REFRESH_COOKIE_KEY");
  process.exit();
}
export const refreshTokenKey = process.env.REFRESH_COOKIE_KEY;