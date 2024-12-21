const jwt = require("jsonwebtoken");
const decode = require("jsonwebtoken/decode");
const Validator = require("validatorjs");

//Admin authentication middlware
const AdminAuthentication = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(404).json({ error: "Not autherized" });
  }
  await jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ message: "Not authorized" });
    }
    req.user = decode;
    next();
  });
};

//for admin credential validation middlware
const validateAdminCredential = (req, res, next) => {
  const { AdminEmail, AdminPass } = req.body;
  const adminInfo = {
    Email: AdminEmail,
    Password: AdminPass,
  };
  console.log(adminInfo.Email);
  const rules = {
    Email: "required|email|between:5,35",
    Password: "required|between:6,15",
  };
  const validation = new Validator(adminInfo, rules);
  if (validation.fails()) {
    const error =
      validation.errors.first("Name") ||
      validation.errors.first("Email") ||
      validation.errors.first("Password");
    return res.status(400).json({ Error: error });
  }
  next();
};

//for add user by admin(middlware)
const userCredentialValidation = (req, res, next) => {
  const { username, email, password } = req.body;

  const data = {
    Name: username,
    Email: email,
    Password: password,
  };
  const rules = {
    Name: "required|alpha|between:5,10",
    Email: "required|email",
    Password: "required|between:6,15",
  };

  const validation = new Validator(data, rules);
  if (validation.fails()) {
    const error =
      validation.errors.first("Name") ||
      validation.errors.first("Email") ||
      validation.errors.first("Password");
    return res.status(400).json({ message: error });
  }

  next();
};

//Delete user middlware (by admin)
const validateDeletion = (req, res, next) => {
  const { id } = req.params;
  const data = {
    Id: id,
  };
  const rules = {
    Id: "required|integer|min:1",
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ message: "Can't find" });
  }
  next();
};

module.exports = {
  AdminAuthentication,
  validateAdminCredential,
  userCredentialValidation,
  validateDeletion,
};
