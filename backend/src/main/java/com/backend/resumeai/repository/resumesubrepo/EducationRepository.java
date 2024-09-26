package com.backend.resumeai.repository.resumesubrepo;

import com.backend.resumeai.models.resumesubfields.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByResume_ResumeId(Long resumeId);
}