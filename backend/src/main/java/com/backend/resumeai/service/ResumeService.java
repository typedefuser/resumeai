package com.backend.resumeai.service;


import com.azure.core.exception.ResourceNotFoundException;
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
import com.backend.resumeai.repository.resumesubrepo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.net.UnknownServiceException;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ResumeService {


    private final ResumeRepository resumeRepository;


    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private  final LanguageRepository languageRepository;
    private  final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;

    @Autowired
    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository, SkillRepository skillRepository, LanguageRepository languageRepository, ProjectRepository projectRepository, ExperienceRepository experienceRepository, EducationRepository educationRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.languageRepository = languageRepository;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
    }


    public List<Resume> getResumes() {
        return resumeRepository.findAll();
    }

    public List<ResumeProjection> getResumebyUserId(Long userId) {
        return resumeRepository.findByUser_UserId(userId);
    }

    public CreateResumeResponse createResume(CreateResumeDTO createResumeDTO) {
        User user = userRepository.findByEmail(createResumeDTO.getEmail());
        if (user == null) {
            throw new InvalidCredentialsException(createResumeDTO.getEmail());
        }
        Resume resume = new Resume();
        resume.setUser(user);
        resume.setResumeName(createResumeDTO.getResumeName());
        resume.setLastModified(createResumeDTO.getDate());

        Resume savedResume = resumeRepository.save(resume);
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
                personalDetails,
                resume.getLastModified()
        );
    }

    @Transactional
    public void updateResume(Long id, ResumeResponse updates) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found with id: " + id));

        resume.setLastModified(updates.getLastModified());

        // Update each sub-entity
        updateCertifications(resume, updates.getCertifications());
        updateLanguages(resume, updates.getLanguages());
        updateProjects(resume, updates.getProjects());
        updateEducation(resume, updates.getEducation());
        updateExperience(resume, updates.getExperience());
        updateSkills(resume, updates.getSkills());

        // Update address if not null
        if (updates.getAddress() != null) {
            resume.setCity(updates.getAddress().getCity());
            resume.setState(updates.getAddress().getState());
            resume.setStreet(updates.getAddress().getStreet());
            resume.setCountry(updates.getAddress().getCountry());
            resume.setPostalCode(updates.getAddress().getPostalCode());
        }

        // Update personal details if not null
        if (updates.getPersonalDetails() != null) {
            resume.setLinkedin(updates.getPersonalDetails().getLinkedin());
            resume.setGithub(updates.getPersonalDetails().getGithub());
            resume.setSummary(updates.getPersonalDetails().getSummary());
            resume.setPortfolio(updates.getPersonalDetails().getPortfolio());
            resume.setPhoneno(updates.getPersonalDetails().getPhoneno());
        }

        // Save the resume
        resumeRepository.save(resume);
    }

    private void updateCertifications(Resume resume, Set<Certification> updatedCertifications) {
        if (updatedCertifications != null) {
           // certificationRepository.deleteByResumeId(resume.getId()); // Delete existing records
            resume.getCertifications().clear(); // Clear existing certifications
            updatedCertifications.forEach(cert -> {
                cert.setResume(resume); // Associate new certifications with the resume
                resume.getCertifications().add(cert); // Add new certifications
            });
        }
    }

    private void updateLanguages(Resume resume, Set<Language> updatedLanguages) {
        if (updatedLanguages != null) {
            languageRepository.deleteByResume_ResumeId(resume.getResumeId()); // Delete existing records
            resume.getLanguages().clear(); // Clear existing languages
            updatedLanguages.forEach(lang -> {
                lang.setResume(resume); // Associate new languages with the resume
                resume.getLanguages().add(lang); // Add new languages
            });
        }
    }

    private void updateProjects(Resume resume, Set<Project> updatedProjects) {
        if (updatedProjects != null) {
            projectRepository.deleteByResume_ResumeId(resume.getResumeId()); // Delete existing records
            resume.getProjects().clear(); // Clear existing projects
            updatedProjects.forEach(proj -> {
                proj.setResume(resume); // Associate new projects with the resume
                resume.getProjects().add(proj); // Add new projects
            });
        }
    }

    private void updateEducation(Resume resume, Set<Education> updatedEducation) {
        if (updatedEducation != null) {
            educationRepository.deleteByResume_ResumeId(resume.getResumeId()); // Delete existing records
            resume.getEducations().clear(); // Clear existing education
            updatedEducation.forEach(edu -> {
                edu.setResume(resume); // Associate new education with the resume
                resume.getEducations().add(edu); // Add new education
            });
        }
    }

    private void updateExperience(Resume resume, Set<Experience> updatedExperience) {
        if (updatedExperience != null) {
            experienceRepository.deleteByResume_ResumeId(resume.getResumeId()); // Delete existing records
            resume.getExperiences().clear(); // Clear existing experience
            updatedExperience.forEach(exp -> {
                exp.setResume(resume); // Associate new experience with the resume
                resume.getExperiences().add(exp); // Add new experience
            });
        }
    }

    private void updateSkills(Resume resume, Set<Skill> updatedSkills) {
        if (updatedSkills != null) {
            skillRepository.deleteByResume_ResumeId(resume.getResumeId()); // Delete existing records
            resume.getSkills().clear(); // Clear existing skills
            updatedSkills.forEach(skill -> {
                skill.setResume(resume); // Associate new skills with the resume
                resume.getSkills().add(skill); // Add new skills
            });
        }
    }



}
