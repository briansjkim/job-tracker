// This middleware will be looking for non-existant requests
export const notFoundMiddleware = (req, res) => {
  res.status(404).send("Route does not exist");
};
