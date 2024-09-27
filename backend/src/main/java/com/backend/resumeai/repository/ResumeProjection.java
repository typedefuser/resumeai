package com.backend.resumeai.repository;

import java.time.LocalDate;

public interface ResumeProjection {
    Long getResumeId();
    LocalDate getLastModified();
    String getresumeName();

}
