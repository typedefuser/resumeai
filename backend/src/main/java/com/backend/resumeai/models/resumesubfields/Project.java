package com.backend.resumeai.models.resumesubfields;
import  jakarta.persistence.*;
import java.time.LocalDate;
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
    private Resume resume;

    private String projectName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String link;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<ProjectTechnology> technologies;

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

    public Set<ProjectTechnology> getTechnologies() {
        return technologies;
    }

    public void setTechnologies(Set<ProjectTechnology> technologies) {
        this.technologies = technologies;
    }
}