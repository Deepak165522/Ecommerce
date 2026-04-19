import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    ALL_USERS_FAIL,
    ALL_USERS_SUCCESS,
    ALL_USERS_REQUEST,
} from '../constants/userConstants';

import axios from 'axios';

// ✅ BASE URL
const API = process.env.REACT_APP_API_URL;

// ================= AUTH =================

// Login
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const { data } = await axios.post(
            `${API}/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error?.response?.data?.message || "Login failed",
        });
    }
};

// Register
export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const { data } = await axios.post(
            `${API}/register`,
            userData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || "Register failed",
        });
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get(`${API}/me`);

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error?.response?.data?.message || "Load user failed",
        });
    }
};

// Logout
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get(`${API}/logout`);
        dispatch({ type: LOGOUT_USER_SUCCESS });
    } catch (error) {
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error?.response?.data?.message || "Logout failed",
        });
    }
};

// ================= PROFILE =================

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const { data } = await axios.put(
            `${API}/me/update`,
            userData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error?.response?.data?.message || "Update failed",
        });
    }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const { data } = await axios.put(
            `${API}/password/update`,
            passwords,
            { headers: { "Content-Type": "application/json" } }
        );

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error?.response?.data?.message || "Update password failed",
        });
    }
};

// ================= PASSWORD =================

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const { data } = await axios.post(
            `${API}/password/forgot`,
            { email }, // ✅ IMPORTANT FIX
            { headers: { "Content-Type": "application/json" } }
        );

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error?.response?.data?.message || "Error",
        });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const { data } = await axios.put(
            `${API}/password/reset/${token}`,
            passwords,
            { headers: { "Content-Type": "application/json" } }
        );

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error?.response?.data?.message || "Error",
        });
    }
};

// ================= ADMIN =================

// Get All Users
export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });

        const { data } = await axios.get(`${API}/admin/users`);

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        });

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error?.response?.data?.message || "Error",
        });
    }
};

// Get User Details
export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });

        const { data } = await axios.get(`${API}/admin/user/${id}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error?.response?.data?.message || "Error",
        });
    }
};

// Update User
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const { data } = await axios.put(
            `${API}/admin/user/${id}`,
            userData,
            { headers: { "Content-Type": "application/json" } }
        );

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error?.response?.data?.message || "Error",
        });
    }
};

// Delete User
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });

        const { data } = await axios.delete(`${API}/admin/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error?.response?.data?.message || "Error",
        });
    }
};

// ================= COMMON =================

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
