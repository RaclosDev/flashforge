package com.loopdeck.repository;

import com.loopdeck.model.ForestPlant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForestPlantRepository extends JpaRepository<ForestPlant, Long> {
    List<ForestPlant> findByForest_Id(Long forestId);
}
