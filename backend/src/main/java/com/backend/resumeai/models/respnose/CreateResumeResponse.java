package com.backend.resumeai.models.respnose;

import java.time.LocalDate;

public class CreateResumeResponse {
    private Long userId;
    private String resumeName;
    private Long resumeId;
    private LocalDate lastModified;

    public CreateResumeResponse(Long userId, String resumeName, Long resumeId,LocalDate lastModified) {
        this.userId = userId;
        this.resumeName = resumeName;
        this.resumeId = resumeId;
        this.lastModified=lastModified;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public LocalDate getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDate lastModified) {
        this.lastModified = lastModified;
    }
}
