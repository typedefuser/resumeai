package com.backend.resumeai.models.resumesubfields;
import com.fasterxml.jackson.annotation.JsonBackReference;
import  jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.backend.resumeai.models.Resume;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonBackReference
    private Resume resume;

    private String projectName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String link;

    private List<String> technologiesUsed;

//getters and setters

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public List<String> getTechnologies() {
        return technologiesUsed;
    }

    public void setTechnologies(List<String> technologies) {
        this.technologiesUsed = technologies;
    }
}