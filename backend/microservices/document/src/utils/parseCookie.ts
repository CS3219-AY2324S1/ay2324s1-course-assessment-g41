export const parseCookie = (cookieString: string) => {
  if (!process.env.ACCESS_COOKIE_KEY) {
    console.log("Missing ACCESS_COOKIE_KEY")
    process.exit()
  }
  const accessTokenKey = process.env.ACCESS_COOKIE_KEY
  const cookies = new Map<string, string>();
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts[1];
    cookies.set(name, value)
  });
  return Object.fromEntries(cookies)[accessTokenKey];
}