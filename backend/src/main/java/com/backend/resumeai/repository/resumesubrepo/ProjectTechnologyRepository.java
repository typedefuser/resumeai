package com.backend.resumeai.repository.resumesubrepo;

import com.backend.resumeai.models.resumesubfields.ProjectTechnology;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTechnologyRepository extends JpaRepository<ProjectTechnology, Long> {
    List<ProjectTechnology> findByProject_ProjectId(Long projectId);
}
