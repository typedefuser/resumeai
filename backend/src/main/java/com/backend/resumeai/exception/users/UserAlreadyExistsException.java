package com.backend.resumeai.exception.users;

public class UserAlreadyExistsException extends RuntimeException {
    private final String email;

    public UserAlreadyExistsException(String email) {
        super("User with email " + email + " already exists");
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}