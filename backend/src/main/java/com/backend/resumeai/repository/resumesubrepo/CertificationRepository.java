package com.backend.resumeai.repository.resumesubrepo;

import com.backend.resumeai.models.resumesubfields.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByResume_ResumeId(Long resumeId);
}