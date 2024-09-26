package com.backend.resumeai.exception.users;

import com.backend.resumeai.exception.ApiError;
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
