package com.backend.resumeai.models;

import com.backend.resumeai.auth.models.User;
import com.backend.resumeai.models.resumesubfields.*;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "resumes")
public class Resume {
    @Id
    @Column(name = "resume_id",nullable = false,unique = true)
    private String resumeId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String summary;
    private String linkedin;
    private String github;
    private String portfolio;
    private String phoneno;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private Set<Education> educations;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private Set<Experience> experiences;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private Set<Skill> skills;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private Set<Certification> certifications;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private Set<Project> projects;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private Set<Language> languages;

    // Getters and setters


    public String getResumeId() {
        return resumeId;
    }

    public void setResumeId(String resumeId) {
        this.resumeId = resumeId;
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    public Set<Certification> getCertifications() {
        return certifications;
    }

    public void setCertifications(Set<Certification> certifications) {
        this.certifications = certifications;
    }

    public Set<Skill> getSkills() {
        return skills;
    }

    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }

    public Set<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(Set<Experience> experiences) {
        this.experiences = experiences;
    }

    public Set<Education> getEducations() {
        return educations;
    }

    public void setEducations(Set<Education> educations) {
        this.educations = educations;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getPhoneno() {
        return phoneno;
    }

    public void setPhoneno(String phoneno) {
        this.phoneno = phoneno;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public Set<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(Set<Language> languages) {
        this.languages = languages;
    }
}