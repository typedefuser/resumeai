package com.backend.resumeai.models.resumesubfields;

import jakarta.persistence.*;

@Entity
@Table(name = "certifications")
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long certificationId;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String certificationName;
    private String issuingOrganization;
    private LocalDate issueDate;

    // Getters and setters
}