package com.backend.resumeai.service;


import com.backend.resumeai.models.Resume;
import com.backend.resumeai.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeService {


    private final ResumeRepository resumeRepository;

    @Autowired
    public ResumeService(ResumeRepository resumeRepository){
        this.resumeRepository=resumeRepository;
    }


    public  List<Resume> getResumes(){
        return resumeRepository.findAll();
    }

    public List<Resume> getResumebyUserId(Long userId){
        return resumeRepository.findByUser_UserId(userId);
    }
}
