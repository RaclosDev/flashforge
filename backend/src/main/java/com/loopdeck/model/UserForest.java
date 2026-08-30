package com.loopdeck.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_forests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserForest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Builder.Default
    @Column(name = "light_points", nullable = false)
    private Integer lightPoints = 0;

    @Builder.Default
    @Column(name = "pending_seeds", nullable = false)
    private Integer pendingSeeds = 1;

    @Builder.Default
    @Column(name = "last_visit", nullable = false)
    private Instant lastVisit = Instant.now();

    @Builder.Default
    @Column(name = "total_cards_reviewed", nullable = false)
    private Integer totalCardsReviewed = 0;

    @Builder.Default
    @Column(name = "mastered_decks", nullable = false)
    private Integer masteredDecks = 0;

    @Builder.Default
    @OneToMany(mappedBy = "forest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ForestPlant> plants = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "forest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ForestUnlock> unlocks = new ArrayList<>();
}
