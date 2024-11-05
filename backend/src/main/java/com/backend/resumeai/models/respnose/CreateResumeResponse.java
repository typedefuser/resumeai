package com.backend.resumeai.models.respnose;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CreateResumeResponse {
    private Long userId;
    private String resumeName;
    private Long resumeId;
    private LocalDateTime lastModified;

    public CreateResumeResponse(Long userId, String resumeName, Long resumeId, LocalDateTime lastModified) {
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

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }
}
