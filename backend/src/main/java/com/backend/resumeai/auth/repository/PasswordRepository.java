package com.backend.resumeai.auth.repository;

import com.backend.resumeai.auth.models.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordRepository extends JpaRepository<Password,Long> {

}
