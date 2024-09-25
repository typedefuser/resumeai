package com.backend.resumeai.models.resumesubfields;

import jakarta.persistence.*;

@Entity
@Table(name = "project_technologies")
public class ProjectTechnology {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectTechnologyId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private String technology;

    // Getters and setters

    public Long getProjectTechnologyId() {
        return projectTechnologyId;
    }

    public void setProjectTechnologyId(Long projectTechnologyId) {
        this.projectTechnologyId = projectTechnologyId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }
}