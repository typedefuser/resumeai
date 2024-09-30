package com.backend.resumeai.models.DTO;

import com.backend.resumeai.models.resumesubfields.*;
import java.util.Set;

public class ResumeResponse {
    private PersonalDetails personalDetails;
    private Address address;
    private Set<Education> educations;
    private Set<Experience> experiences;
    private Set<Skill> skills;
    private Set<Certification> certifications;
    private Set<Project> projects;
    private Set<Language> languages;
    // Nested classes

    public static class PersonalDetails {
        private String firstname;
        private String lastname;
        private String email;
        private String phoneno;
        private String summary;
        private String linkedin;
        private String github;
        private String portfolio;

        // Getters and setters


        public PersonalDetails(String firstname, String lastname, String email, String summary, String phoneno, String linkedin, String github, String portfolio) {
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
            this.summary = summary;
            this.phoneno = phoneno;
            this.linkedin = linkedin;
            this.github = github;
            this.portfolio = portfolio;
        }

        public String getFirstname() {
            return firstname;
        }

        public void setFirstname(String firstname) {
            this.firstname = firstname;
        }

        public String getLastname() {
            return lastname;
        }

        public void setLastname(String lastname) {
            this.lastname = lastname;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhoneno() {
            return phoneno;
        }

        public void setPhoneno(String phoneno) {
            this.phoneno = phoneno;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public String getLinkedin() {
            return linkedin;
        }

        public void setLinkedin(String linkedin) {
            this.linkedin = linkedin;
        }

        public String getGithub() {
            return github;
        }

        public void setGithub(String github) {
            this.github = github;
        }

        public String getPortfolio() {
            return portfolio;
        }

        public void setPortfolio(String portfolio) {
            this.portfolio = portfolio;
        }
    }
    public static  class Address{
        private String street;
        private String city;
        private String state;
        private String postalCode;
        private String country;

        public Address(String street, String city, String postalCode, String state, String country) {
            this.street = street;
            this.city = city;
            this.postalCode = postalCode;
            this.state = state;
            this.country = country;
        }

        //Getters and setters

        public String getStreet() {
            return street;
        }

        public void setStreet(String street) {
            this.street = street;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(String postalCode) {
            this.postalCode = postalCode;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }
    }

    public ResumeResponse(Set<Project> projects, Set<Language> languages, Set<Certification> certifications, Set<Skill> skills, Set<Experience> experiences, Set<Education> educations, Address address, PersonalDetails personalDetails) {
        this.projects = projects;
        this.languages = languages;
        this.certifications = certifications;
        this.skills = skills;
        this.experiences = experiences;
        this.educations = educations;
        this.address = address;
        this.personalDetails = personalDetails;
    }



    public Set<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(Set<Language> languages) {
        this.languages = languages;
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

    public Set<Experience> getExperience() {
        return experiences;
    }

    public void setExperience(Set<Experience> experience) {
        this.experiences = experience;
    }

    public Set<Education> getEducation() {
        return educations;
    }

    public void setEducation(Set<Education> education) {
        this.educations = education;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public PersonalDetails getPersonalDetails() {
        return personalDetails;
    }

    public void setPersonalDetails(PersonalDetails personalDetails) {
        this.personalDetails = personalDetails;
    }

}