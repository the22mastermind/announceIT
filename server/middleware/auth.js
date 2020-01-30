import jwt from 'jsonwebtoken';

const myToken = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  return req.userData;
};

export default {
  myToken,
};
