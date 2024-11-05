package com.backend.resumeai;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.backend.resumeai.auth.models.User;
import com.backend.resumeai.auth.repository.UserRepository;
import com.backend.resumeai.auth.service.UserService;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class UserIntegrationTests {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    User createuser(){
        User user=new User();
        user.setEmail("johndoe@gmail.com");
        user.setFirstname("john");
        user.setLastname("doe");
        return user;
    }
    // Create a user
    @Test
    @DisplayName("User Creation Test")
    public void testCreateUser(){
       
        User user=createuser();
        userRepository.save(user);

        User fetchedUser=userService.getUserByEmail(user.getEmail());
        assertEquals(user.getEmail(), fetchedUser.getEmail(),"Email should match");
        System.out.println("User creation test passed successfully!");
        
    }

    //delete a User

    @Test
    @DisplayName("User deletion Test")
    public void testDeleteUser(){
        User user=createuser();
        userRepository.save(user);

        userRepository.delete(user);
        User deleteduser=userRepository.findByEmail(user.getEmail());
        assertNull(deleteduser,"User should be deleted");
        System.out.println("User deletion test passed successfully!");
    }

}
