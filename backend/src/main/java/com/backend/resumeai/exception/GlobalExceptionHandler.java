package com.backend.resumeai.exception;

import com.backend.resumeai.exception.users.InvalidCredentialsException;
import com.backend.resumeai.exception.users.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Object> handleUserAlreadyExistsException(
            UserAlreadyExistsException ex, WebRequest request) {
        List<String> details = new ArrayList<>();
        details.add("Email " + ex.getEmail() + " is already registered");
        ApiError err = new ApiError(
                HttpStatus.CONFLICT,
                "User Registration Failed",
                details);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Object> handleInvalidCredentials(
            InvalidCredentialsException ex, WebRequest request) {
        List<String> details = new ArrayList<>();
        if (ex.getMessage() != null) {
            details.add(ex.getMessage());
        } else {
            details.add("Invalid email or password");
        }
        ApiError err = new ApiError(
                HttpStatus.UNAUTHORIZED,
                "Login Failed",
                details);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        List<String> details = new ArrayList<>();
        details.add(ex.getLocalizedMessage());
        ApiError err = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Server Error",
                details);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }

}
