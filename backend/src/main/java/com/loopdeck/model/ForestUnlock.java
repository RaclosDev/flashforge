package com.loopdeck.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "forest_unlocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForestUnlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forest_id", nullable = false)
    private UserForest forest;

    @Column(name = "unlock_id", nullable = false)
    private String unlockId;

    @Builder.Default
    @Column(name = "unlocked_at", nullable = false)
    private Instant unlockedAt = Instant.now();
}
