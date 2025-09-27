export default function validatePass(password) {
  password = password.trim();

  //checking password length
  if (password.length < 12) {
    return {
      resStatus: 400,
      resMessage: {
        Error: "Password must be of 12 characters",
      },
    };
  }
  //checking for the at least 1 digit
  if (!/\d/.test(password)) {
    return {
      resStatus: 400,
      resMessage: {
        Error: "Password must have at least 1 digit",
      },
    };
  }
  //checking for the at least 1 symbol
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      resStatus: 400,
      resMessage: {
        Error: "Password must have at least 1 symbol",
      },
    };
  }

  return {
    resStatus: 200,
    resMessage: { message: "Password is valid" },
  };
}
