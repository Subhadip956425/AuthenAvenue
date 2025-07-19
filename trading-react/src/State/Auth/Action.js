import axios from "axios";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "./ActionTypes";
import { frontend_baseurl } from "../Enviorenment/env";

//Signup Method
export const register =
  (userData, navigate, setSuccessMessage, setErrorMessage) =>
  async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });

    const baseurl = frontend_baseurl || "http://localhost:5454";

    try {
      const response = await axios.post(`${baseurl}/auth/signup`, userData);
      const user = response.data;
      console.log(user);

      dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
      localStorage.setItem("jwt", user.jwt);

      setSuccessMessage?.("Account created successfully!");
      setErrorMessage?.("");

      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Signup failed. Please try again.";

      dispatch({ type: REGISTER_FAILURE, payload: message });
      console.log(error);

      setErrorMessage?.(message);
      setSuccessMessage?.("");
    }
  };

//Login Method
export const login =
  ({ data, navigate, setSuccessMessage, setErrorMessage }) =>
  async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    const baseurl = frontend_baseurl || "http://localhost:5454";

    try {
      const response = await axios.post(`${baseurl}/auth/signin`, data);
      const user = response.data;
      console.log(user);

      dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
      localStorage.setItem("jwt", user.jwt);

      setSuccessMessage("Login successful!");
      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message || // from backend
        error?.response?.data?.error || // fallback
        "Login failed. Please check your credentials.";

      setErrorMessage(message);
      dispatch({ type: LOGIN_FAILURE, payload: message });
      console.error("Login failed:", message);
    }
  };

//Get User Data
export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  const baseurl = frontend_baseurl || "http://localhost:5454";

  try {
    const response = await axios.get(`${baseurl}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const user = response.data;
    console.log(user);

    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error.message });
    console.log(error);
  }
};

// Logout Method
export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
};

// Update User Profile
export const updateProfileDetails = (userData) => async (dispatch) => {
  const baseurl = frontend_baseurl || "http://localhost:5454";

  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.error("No JWT token found.");
    dispatch({ type: GET_USER_FAILURE, payload: "Unauthorized" });
    return;
  }

  try {
    const response = await axios.put(
      `${baseurl}/api/users/profile/update`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const updatedUser = response.data;
    console.log("Profile updated:", updatedUser);

    dispatch({ type: GET_USER_SUCCESS, payload: updatedUser });
  } catch (error) {
    console.log("Profile update failed:", error.message);
    dispatch({ type: GET_USER_FAILURE, payload: error.message });
  }
};

// Send OTP for account verification
export const sendVerificationOtp = (verificationType) => async (dispatch) => {
  const baseurl = frontend_baseurl || "http://localhost:5454";
  const jwt = localStorage.getItem("jwt");

  try {
    const response = await axios.post(
      `${baseurl}/api/users/verification/${verificationType}/send-otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("OTP sent:", response.data);
    return { success: true, message: response.data };
  } catch (error) {
    console.error("OTP send failed:", error);
    return { success: false, message: error.response?.data || error.message };
  }
};

// Verify OTP for enabling 2FA
export const verifyOtp = (otp) => async (dispatch) => {
  const baseurl = frontend_baseurl || "http://localhost:5454";
  const jwt = localStorage.getItem("jwt");

  try {
    const response = await axios.patch(
      `${baseurl}/api/users/enable-two-factor/verify-otp/${otp}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("2FA verified and enabled:", response.data);
    dispatch({ type: GET_USER_SUCCESS, payload: response.data });
    return { success: true, user: response.data };
  } catch (error) {
    console.error("OTP verification failed:", error);
    return { success: false, message: error.response?.data || error.message };
  }
};

// Send OTP to Email for Forgot Password
export const sendForgotPasswordOtp = (email) => async () => {
  const baseurl = frontend_baseurl || "http://localhost:5454";
  try {
    const res = await axios.post(
      `${baseurl}/auth/users/reset-password/send-otp`,
      {
        sendTo: email,
        verificationType: "EMAIL",
      }
    );
    console.log("OTP sent:", res.data);
    return { success: true, session: res.data.session };
  } catch (err) {
    console.error("OTP send failed:", err);
    return { success: false, message: err.response?.data || err.message };
  }
};

// Verify OTP and Reset Password
export const verifyForgotPasswordOtp = (id, otp, newPassword) => async () => {
  const baseurl = frontend_baseurl || "http://localhost:5454";
  try {
    const res = await axios.patch(
      `${baseurl}/auth/users/reset-password/verify-otp?id=${id}`,
      {
        otp,
        password: newPassword,
      }
    );
    console.log("Password reset success:", res.data);
    return { success: true };
  } catch (err) {
    console.error("Password reset failed:", err);
    return { success: false, message: err.response?.data || err.message };
  }
};
