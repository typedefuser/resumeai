package com.backend.resumeai.models;

import jakarta.persistence.*;
import com.backend.resumeai.models.User;

@Entity
@Table(name = "passwords")
public class Password {
    @Id
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String hashedPassword;

    @Column(nullable = false)
    private String salt;

    // Getters and setters

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }
}
