package com.backend.resumeai.auth.service;

import com.backend.resumeai.auth.models.LoginRequest;
import com.backend.resumeai.auth.models.Password;
import com.backend.resumeai.auth.models.User;
import com.backend.resumeai.auth.models.UserDTO;
import com.backend.resumeai.auth.repository.PasswordRepository;
import com.backend.resumeai.auth.repository.UserRepository;
import com.backend.resumeai.exception.users.InvalidCredentialsException;
import com.backend.resumeai.exception.users.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordRepository passwordRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordRepository passwordRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordRepository = passwordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UserAlreadyExistsException(userDTO.getEmail());
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setFirstname(userDTO.getFirstname());
        user.setLastname(userDTO.getLastname());


        User savedUser = userRepository.save(user);


        Password userPassword = new Password();
        userPassword.setUser(savedUser);
        userPassword.setHashedPassword(passwordEncoder.encode(userDTO.getPassword()));
        passwordRepository.save(userPassword);

        return savedUser;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Long login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            throw new InvalidCredentialsException("User not found with the provided email");
        }


        Password passwordEntity = user.getPasswordEntity();
        if (passwordEntity == null || !passwordEncoder.matches(loginRequest.getPassword(), passwordEntity.getHashedPassword())) {
            throw new InvalidCredentialsException("Incorrect password for the provided email");
        }

        return user.getUserId();
    }
}
