package com.backend.resumeai.repository.resumesubrepo;

import com.backend.resumeai.models.resumesubfields.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByResume_ResumeId(Long resumeId);
}