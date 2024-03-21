// LoginAPI.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const sendOtpEmail = async (phoneNumber) => {
    try {
        const response = await axios.post(`${API_URL}/signin`, {
            randomNumber: phoneNumber,
        });

        return response.data;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

export const verifyOtp = async (phoneNumber, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verifyOTP`, {
            randomNumber: phoneNumber,
            otp: parseInt(otp),
        });

        return response.data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};
