package com.loopdeck.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "forest_plants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForestPlant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forest_id", nullable = false)
    private UserForest forest;

    @Column(name = "species_id", nullable = false)
    private String speciesId;

    @Builder.Default
    @Column(name = "planted_at", nullable = false)
    private Instant plantedAt = Instant.now();

    @Column(name = "matures_at", nullable = false)
    private Instant maturesAt;

    @Builder.Default
    @Column(name = "status", nullable = false)
    private String status = "growing"; // 'growing' or 'mature'

    @Column(name = "is_permanent", nullable = false)
    private Boolean isPermanent;

    @Column(name = "last_harvest_at")
    private Instant lastHarvestAt;

    @Builder.Default
    @Column(name = "total_harvested", nullable = false)
    private Integer totalHarvested = 0;
}
