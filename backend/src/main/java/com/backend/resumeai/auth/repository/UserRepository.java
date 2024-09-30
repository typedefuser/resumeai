package com.backend.resumeai.auth.repository;
import com.backend.resumeai.auth.models.DTO.UserProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.resumeai.auth.models.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    UserProjection findProjectionByEmail(String email);
    boolean existsByEmail(String email);
    User findByUsernameOrEmail(String Username,String Email);
}