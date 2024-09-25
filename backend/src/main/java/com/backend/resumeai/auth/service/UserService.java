package com.backend.resumeai.auth.service;

import com.backend.resumeai.auth.models.Password;
import com.backend.resumeai.auth.models.User;
import com.backend.resumeai.auth.models.UserDTO;
import com.backend.resumeai.auth.repository.PasswordRepository;
import com.backend.resumeai.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordRepository passwordRepository;

    @Autowired
    public UserService(UserRepository userRepository,PasswordRepository passwordRepository) {
        this.userRepository = userRepository;
        this.passwordRepository=passwordRepository;
    }

    public User createUser(UserDTO userDTO) {
        if (userRepository.existsByUserId(userDTO.getUserId())) {
            throw new IllegalArgumentException("User ID already exists"); // Handle as needed
        }
        User user = new User();
        user.setUserId(userDTO.getUserId());
        user.setEmail(userDTO.getEmail());
        user.setFirstname(userDTO.getFirstname());
        user.setLastname(userDTO.getLastname());

        User savedUser = userRepository.save(user);

        Password userPassword = new Password();
        userPassword.setUser(savedUser);
        userPassword.setHashedPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));

        passwordRepository.save(userPassword);
        return savedUser;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAll(){
        return userRepository.findAll();
    }
}