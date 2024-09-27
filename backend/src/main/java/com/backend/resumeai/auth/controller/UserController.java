package com.backend.resumeai.auth.controller;


import com.backend.resumeai.auth.models.LoginRequest;
import com.backend.resumeai.auth.models.UserDTO;
import com.backend.resumeai.config.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.resumeai.auth.service.UserService;
import com.backend.resumeai.auth.models.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService,JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil=jwtUtil;
    }


    @PostMapping("/signup")
    public ResponseEntity<User> createUser(@RequestBody UserDTO userDTO) {
        User createdUser = userService.createUser(userDTO);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> validateUser(@RequestBody LoginRequest loginRequest){
        Map<String,Object> response=new HashMap<>();
        Long userId=userService.login(loginRequest);
        String jwtToken=jwtUtil.generateToken(loginRequest.getEmail());
        response.put("token",jwtToken);
        response.put("user_id",userId);
        response.put("success",true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String,Object>> LogoutUSer(@RequestHeader("Authorization") String token){
        Map<String,Object> response=new HashMap<>();
        String jwtToken=token.substring(7);
        jwtUtil.blacklistToken(jwtToken);
        response.put("success",true);
        response.put("message","LOGOUT SUCCESSFUL");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public  ResponseEntity<List<User>> getAll(){
        List<User> users=userService.getAll();
        return  ResponseEntity.ok(users);
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}