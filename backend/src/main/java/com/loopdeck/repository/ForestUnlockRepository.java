package com.loopdeck.repository;

import com.loopdeck.model.ForestUnlock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForestUnlockRepository extends JpaRepository<ForestUnlock, Long> {
    List<ForestUnlock> findByForestId(Long forestId);
}
