package com.backend.resumeai.repository;

import java.time.LocalDateTime;

public interface ResumeProjection {
    Long getResumeId();
    LocalDateTime getLastModified();
    String getresumeName();

}
