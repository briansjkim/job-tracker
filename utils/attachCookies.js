export const attachCookie = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    // if it's prod, then it'll be set to secure
    secure: process.env.NODE_ENV == "production",
  });
};
