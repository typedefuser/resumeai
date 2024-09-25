package com.backend.resumeai.models.resumesubfields;
import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementId;

    @ManyToOne
    @JoinColumn(name = "experience_id", nullable = false)
    private Experience experience;

    private String description;

    // Getters and setters
}