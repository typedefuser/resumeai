package com.backend.resumeai.models.DTO;

import java.time.LocalDate;

public class CreateResumeDTO {
    private String email;
    private String resumeName;
    private final LocalDate lastModified;


    public CreateResumeDTO(String resumeName, String email,LocalDate lastModified) {
        this.resumeName = resumeName;
        this.email = email;
        this.lastModified=lastModified;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDate() {
        return lastModified;
    }
}
