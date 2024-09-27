import axios from 'axios';

// Base URL from environment variables
const apiBaseURL = import.meta.env.VITE_BASE_URL;
const LOGiN_URL = `${apiBaseURL}/auth/login`;
const SIGNUP_URL = `${apiBaseURL}/auth/signup`;

// Interfaces for login and signup data
export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export const login = async (data: LoginData | SignupData, isLogin: boolean) => {
    const API_URL = isLogin ? LOGiN_URL : SIGNUP_URL;

    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        
        if (response.status === 200) {
            console.log('Login/Signup successful', response.data);
            return response.data; 
        } else {
            console.error('Login/Signup failed:', response.status);
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error during login/signup:', error);
        throw error; 
    }
};


export const logout = async () => {
   
    

    try {
        const response = await axios.post(`${apiBaseURL}/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            console.log('Logout successful');
        } else {
            console.error('Logout failed:', response.status);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
};
