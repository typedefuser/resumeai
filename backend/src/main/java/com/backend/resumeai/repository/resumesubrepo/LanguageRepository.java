package com.backend.resumeai.repository.resumesubrepo;

import com.backend.resumeai.models.resumesubfields.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    List<Language> findByResume_ResumeId(Long resumeId);
    void deleteByResume_ResumeId(Long resumeId);
}