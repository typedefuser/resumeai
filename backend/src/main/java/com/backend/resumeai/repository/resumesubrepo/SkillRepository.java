package com.backend.resumeai.repository.resumesubrepo;

import com.backend.resumeai.models.resumesubfields.Skill;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByResume_ResumeId(Long resumeId);

    @Modifying
    @Transactional
    void deleteByResume_ResumeId(Long resumeId);
}