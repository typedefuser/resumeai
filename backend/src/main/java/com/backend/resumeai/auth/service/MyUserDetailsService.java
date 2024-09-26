package com.backend.resumeai.auth.service;

import com.backend.resumeai.auth.models.User;
import com.backend.resumeai.auth.repository.UserRepository;
import com.backend.resumeai.exception.users.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String UsernameOrEmail) throws InvalidCredentialsException {
        User user = userRepository.findByUsernameOrEmail(UsernameOrEmail, UsernameOrEmail);
        if (user == null) {
            throw new InvalidCredentialsException("User not found with the provided email");
        }
        System.out.println(user.getPasswordEntity());
        return user;
    }
}
