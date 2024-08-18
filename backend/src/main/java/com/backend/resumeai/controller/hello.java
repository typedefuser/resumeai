package com.backend.resumeai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1")
public class hello {
    @GetMapping("/hello")
    private ResponseEntity<String> Show(){
        return ResponseEntity.ok("hello world");
    }
}
