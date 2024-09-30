package com.backend.resumeai.controller;


import com.backend.resumeai.models.DTO.CreateResumeDTO;
import com.backend.resumeai.models.DTO.ResumeResponse;
import com.backend.resumeai.models.Resume;
import com.backend.resumeai.models.respnose.CreateResumeResponse;
import com.backend.resumeai.repository.ResumeProjection;
import com.backend.resumeai.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/create")
    public ResponseEntity<CreateResumeResponse> createResume(@RequestBody CreateResumeDTO createResumeDTO){
        CreateResumeResponse response=resumeService.createResume(createResumeDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<List<ResumeProjection>> getResumesbyUserId(@PathVariable Long user_id){
        List<ResumeProjection> resumeList=resumeService.getResumebyUserId(user_id);
        return ResponseEntity.ok(resumeList);
    }

    @PostMapping("/delete/{resumeId}")
    public ResponseEntity<String> deletebyResumeId(@PathVariable Long resumeId) {
        resumeService.deletebyResumeId(resumeId);
        return ResponseEntity.ok("RESUME DELETED");
    }

    @GetMapping("/get/{resumeId}")
    public ResponseEntity<ResumeResponse> getResumebyId(@PathVariable Long resumeId){
        ResumeResponse resume = resumeService.getResumebyId(resumeId);
        return ResponseEntity.ok(resume);
    }
}
