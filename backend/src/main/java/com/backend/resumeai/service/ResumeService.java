package com.backend.resumeai.service;


import com.backend.resumeai.auth.models.User;
import com.backend.resumeai.auth.repository.UserRepository;
import com.backend.resumeai.exception.users.InvalidCredentialsException;
import com.backend.resumeai.models.DTO.CreateResumeDTO;
import com.backend.resumeai.models.DTO.ResumeResponse;
import com.backend.resumeai.models.Resume;
import com.backend.resumeai.models.respnose.CreateResumeResponse;
import com.backend.resumeai.models.resumesubfields.*;
import com.backend.resumeai.repository.ResumeProjection;
import com.backend.resumeai.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.UnknownServiceException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ResumeService {


    private final ResumeRepository resumeRepository;


    private final UserRepository userRepository;

    @Autowired
    public ResumeService(ResumeRepository resumeRepository,UserRepository userRepository){
        this.resumeRepository=resumeRepository;
        this.userRepository=userRepository;
    }


    public  List<Resume> getResumes(){
        return resumeRepository.findAll();
    }

    public List<ResumeProjection> getResumebyUserId(Long userId){
        return resumeRepository.findByUser_UserId(userId);
    }

    public CreateResumeResponse createResume(CreateResumeDTO createResumeDTO) {
        User user=userRepository.findByEmail(createResumeDTO.getEmail());
        if(user==null){
            throw new InvalidCredentialsException(createResumeDTO.getEmail());
        }
        Resume resume=new Resume();
        resume.setUser(user);
        resume.setResumeName(createResumeDTO.getResumeName());
        resume.setLastModified(createResumeDTO.getDate());

        Resume savedResume=resumeRepository.save(resume);
        return new CreateResumeResponse(
                savedResume.getUser().getUserId(),
                savedResume.getResumeName(),
                savedResume.getResumeId(),
                savedResume.getLastModified()
        );
    }

    public void deletebyResumeId(Long resumeId) {
        resumeRepository.deleteById(resumeId);
    }

    public ResumeResponse getResumebyId(Long resumeId) {
        Optional<Resume> curr=resumeRepository.findById(resumeId);
        Resume resume=curr.orElseThrow(()->new RuntimeException("resume not found"));
        ResumeResponse.PersonalDetails personalDetails=new ResumeResponse.PersonalDetails(
                resume.getUser().getFirstname(),
                resume.getUser().getLastname(),
                resume.getUser().getEmail(),
                resume.getSummary(),
                resume.getPhoneno(),
                resume.getLinkedin(),
                resume.getGithub(),
                resume.getPortfolio()
        );
        ResumeResponse.Address address=new ResumeResponse.Address(
                resume.getStreet(),
                resume.getCity(),
                resume.getState(),
                resume.getPostalCode(),
                resume.getCountry()
        );
        return new ResumeResponse(
                resume.getProjects(),
                resume.getLanguages(),
                resume.getCertifications(),
                resume.getSkills(),
                resume.getExperiences(),
                resume.getEducations(),
                address,
                personalDetails
        );
    }


}
