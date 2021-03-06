exports.getNewId = (array) => {
  if (array.length > 0) {
    // Find the id of the last element and increment it by 1
    return array[array.length - 1].id + 1;
  }
  // If no element is found (empty)
  return 1;
};

/**
 * @param {string} password
 * @param {string} confirmpassword
 * @returns {boolean} true | false
 * @description Compare password and confirmpassword
 */
exports.matchPasswords = (password, confirmpassword) => {
  if (password !== confirmpassword) {
    return false;
  }
  return true;
};
