const generateOTP = (size = 6, type = "alphanumeric") => {
  let alphaNumeric =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let small = "abcdefghijklmnopqrstuvwxyz";
  let numeric = "0123456789";
  let str = alphaNumeric;

  if (type == "numeric") {
    str = numeric;
  } else if (type == "capital") {
    str = capital;
  } else if (type == "small") {
    str = small;
  }

  let otp = "";

  for (let i = 0; i < size; i++) {
    otp += Math.round(Math.random() * str.length);
  }

  return otp;
};

module.exports = generateOTP;
