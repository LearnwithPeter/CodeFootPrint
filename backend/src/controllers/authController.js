// Controllers stay thin: read the request, call a service, send a response.
// No business logic here - that all lives in authService.js.

import { registerUser, loginUser, getUserById } from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { user, token } = await registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error); // passes the error to errorMiddleware.js
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// Protected route - authMiddleware runs first and sets req.userId
export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
