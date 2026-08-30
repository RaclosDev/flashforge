package com.loopdeck.repository;

import com.loopdeck.model.UserForest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserForestRepository extends JpaRepository<UserForest, Long> {
    Optional<UserForest> findByUserId(String userId);
}
