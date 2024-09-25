package com.backend.resumeai.models.resumesubfields;

import com.backend.resumeai.models.Resume;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "experience")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Long experienceId;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String companyName;
    private String jobTitle;
    private LocalDate startDate;
    private LocalDate endDate;

    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL)
    private Set<Responsibility> responsibilities;

    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL)
    private Set<Achievement> achievements;

    // Getters and setters

    public Long getExperienceId() {
        return experienceId;
    }

    public void setExperienceId(Long experienceId) {
        this.experienceId = experienceId;
    }

    public Set<Achievement> getAchievements() {
        return achievements;
    }

    public void setAchievements(Set<Achievement> achievements) {
        this.achievements = achievements;
    }

    public Set<Responsibility> getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(Set<Responsibility> responsibilities) {
        this.responsibilities = responsibilities;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }
}