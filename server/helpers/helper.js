const matchPasswords = (password, confirmpassword) => {
  if (password !== confirmpassword) {
    return false;
  }
  return true;
};

export default {
  matchPasswords,
};
