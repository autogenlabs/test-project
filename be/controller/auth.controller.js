const authService = require("../service/auth.service");
const tokenService = require("../service/token.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const userServices = require("../service/user.service");
const emailService = require("../service/email.service");

function generateOTP() {
    // Generates a random number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Return as string in case you need to store it as a string
}

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: "Invalid credentials",
    });
  }

  // Generate OTP
  const otp = generateOTP();
  console.log(otp, "===otpppp");
  
  // Set expiration time for the OTP (for example, 5 minutes)
  const otpExpireTime = new Date();
  otpExpireTime.setMinutes(otpExpireTime.getMinutes() + 5);

  // Update the user record with the OTP and its expiration
  await userServices.storeOtp(user.id, otp);

  // Send OTP via email
  await emailService.sendOtpForLogin(email, otp);

  res.status(200).send({ message: "OTP has been sent to your email" });
});

// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   if (!user) {
//     res.status(httpStatus.UNAUTHORIZED).send({
//       message: "Invalid credentials",
//     });
//     return;
//   }

//   // const otp = generateOTP();
//   // const optSend = sendOtpForLogin
//   const userInfo = userServices.getUserInfo(user);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ ...tokens, ...userInfo });
// });

const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userServices.getUserByEmail(email);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: "Invalid email" });
  }

  // Check if OTP matches and if it's not expired
  if (user.otp !== otp) {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: "Invalid or expired OTP" });
  }

  // OTP is valid, generate auth tokens
  const tokens = await tokenService.generateAuthTokens(user);

  // Clear OTP from user record after successful verification
  await userServices.clearOtp(user.id);

  // Send response with user info and tokens
  const userInfo = userServices.getUserInfo(user);
  res.status(200).send({ ...tokens, ...userInfo });
});


const register = catchAsync(async (req, res) => {
  const user = await userServices.createUser(req.body, req.user);
  if (user) {
    res.send({ user });
    return;
  }
  res.status(httpStatus.CONFLICT).send({
    message: "User already exists",
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  login,
  register,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyOtp,
};
