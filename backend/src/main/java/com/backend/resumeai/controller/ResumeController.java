package com.backend.resumeai.controller;


import com.backend.resumeai.models.Resume;
import com.backend.resumeai.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    @Autowired
    public  ResumeController(ResumeService resumeService){
        this.resumeService=resumeService;
    }


    @GetMapping("/all")
    public ResponseEntity<List<Resume>> getResumes(){
        List<Resume> resumeList=resumeService.getResumes();
        return ResponseEntity.ok(resumeList);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<List<Resume>> getResumesbyUserId(@PathVariable Long user_id){
        List<Resume> resumeList=resumeService.getResumebyUserId(user_id);
        return ResponseEntity.ok(resumeList);
    }

}
