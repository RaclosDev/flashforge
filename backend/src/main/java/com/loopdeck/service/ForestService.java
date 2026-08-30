package com.loopdeck.service;

import com.loopdeck.model.*;
import com.loopdeck.repository.*;
import com.loopdeck.config.ForestSpeciesConfig;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.Instant;
import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ForestService {

    private final UserForestRepository forestRepo;
    private final ForestPlantRepository plantRepo;
    private final ForestUnlockRepository unlockRepo;
    private final UserRepository userRepo;

    public record PlantDto(Long id, String speciesId, String status, int progressPercent, boolean isPermanent, int totalHarvested, String emoji) {}
    public record SummaryEventDto(String speciesId, String emoji, Integer quantity) {}
    public record ForestSummaryDto(List<SummaryEventDto> matured, List<SummaryEventDto> harvested, List<String> unlocksReached) {}
    public record ForestViewDto(int lightPoints, int pendingSeeds, ForestSummaryDto sinceLastVisit, List<PlantDto> plants) {}
    public record AvailableSpeciesDto(String id, String name, String emoji, String requirement, boolean unlocked) {}

    @Transactional
    public UserForest getOrCreateForest(String userId) {
        return forestRepo.findByUserId(userId).orElseGet(() -> {
            UserForest newForest = UserForest.builder().userId(userId).build();
            newForest = forestRepo.save(newForest);
            
            // Plant initial pine tree
            ForestPlant initialPlant = ForestPlant.builder()
                .forest(newForest)
                .speciesId("pine")
                .plantedAt(Instant.now().minus(Duration.ofDays(10))) // Already mature
                .maturesAt(Instant.now().minus(Duration.ofDays(7)))
                .status("mature")
                .isPermanent(true)
                .build();
            plantRepo.save(initialPlant);
            
            return newForest;
        });
    }

    @Transactional
    public ForestViewDto getForestView(String userId) {
        UserForest forest = getOrCreateForest(userId);
        Instant now = Instant.now();
        
        List<ForestPlant> plants = plantRepo.findByForest_Id(forest.getId());
        
        List<SummaryEventDto> maturedSummary = new ArrayList<>();
        List<SummaryEventDto> harvestedSummary = new ArrayList<>();
        
        for (ForestPlant plant : plants) {
            ForestSpeciesConfig.SpeciesDef def = ForestSpeciesConfig.getSpecies(plant.getSpeciesId());
            if (def == null) continue;

            if ("growing".equals(plant.getStatus()) && now.isAfter(plant.getMaturesAt())) {
                plant.setStatus("mature");
                maturedSummary.add(new SummaryEventDto(plant.getSpeciesId(), def.emoji(), 1));
                
                if (!plant.getIsPermanent()) {
                    plant.setLastHarvestAt(plant.getMaturesAt());
                    plant.setTotalHarvested(plant.getTotalHarvested() + 1);
                    harvestedSummary.add(new SummaryEventDto(plant.getSpeciesId(), def.emoji(), 1));
                }
            }
            
            // Cyclic harvests for non-permanent
            if ("mature".equals(plant.getStatus()) && !plant.getIsPermanent() && plant.getLastHarvestAt() != null) {
                long cycleMillis = def.cycleHours() * 3600000L;
                if (cycleMillis > 0) {
                    long elapsedSinceHarvest = now.toEpochMilli() - plant.getLastHarvestAt().toEpochMilli();
                    int newHarvests = (int) (elapsedSinceHarvest / cycleMillis);
                    if (newHarvests > 0) {
                        plant.setTotalHarvested(plant.getTotalHarvested() + newHarvests);
                        plant.setLastHarvestAt(plant.getLastHarvestAt().plusMillis(newHarvests * cycleMillis));
                        harvestedSummary.add(new SummaryEventDto(plant.getSpeciesId(), def.emoji(), newHarvests));
                    }
                }
            }
        }
        
        plantRepo.saveAll(plants);
        
        // Unlocks check
        List<ForestUnlock> unlocks = unlockRepo.findByForest_Id(forest.getId());
        List<String> recentUnlocks = checkMilestones(userId, forest, unlocks);
        
        ForestSummaryDto summary = null;
        if (!maturedSummary.isEmpty() || !harvestedSummary.isEmpty() || !recentUnlocks.isEmpty()) {
            summary = new ForestSummaryDto(maturedSummary, harvestedSummary, recentUnlocks);
        }
        
        forest.setLastVisit(now);
        forestRepo.save(forest);

        List<PlantDto> plantDtos = plants.stream().map(p -> {
            ForestSpeciesConfig.SpeciesDef d = ForestSpeciesConfig.getSpecies(p.getSpeciesId());
            int progress = 100;
            if ("growing".equals(p.getStatus())) {
                long totalMillis = p.getMaturesAt().toEpochMilli() - p.getPlantedAt().toEpochMilli();
                long elapsed = now.toEpochMilli() - p.getPlantedAt().toEpochMilli();
                progress = (int) ((elapsed * 100) / totalMillis);
                if (progress < 0) progress = 0;
                if (progress > 99) progress = 99;
            }
            return new PlantDto(p.getId(), p.getSpeciesId(), p.getStatus(), progress, p.getIsPermanent(), p.getTotalHarvested(), d != null ? d.emoji() : "🌱");
        }).toList();

        return new ForestViewDto(forest.getLightPoints(), forest.getPendingSeeds(), summary, plantDtos);
    }

    @Transactional
    public PlantDto plantSeed(String userId, String speciesId) {
        UserForest forest = getOrCreateForest(userId);
        if (forest.getPendingSeeds() <= 0) {
            throw new IllegalArgumentException("No tienes semillas pendientes");
        }
        
        ForestSpeciesConfig.SpeciesDef def = ForestSpeciesConfig.getSpecies(speciesId);
        if (def == null) {
            throw new IllegalArgumentException("Especie desconocida");
        }

        forest.setPendingSeeds(forest.getPendingSeeds() - 1);
        forestRepo.save(forest);

        Instant now = Instant.now();
        Instant maturesAt = now.plus(Duration.ofHours(def.maturationHours()));

        ForestPlant newPlant = ForestPlant.builder()
            .forest(forest)
            .speciesId(speciesId)
            .plantedAt(now)
            .maturesAt(maturesAt)
            .status("growing")
            .isPermanent(def.isPermanent())
            .build();
            
        newPlant = plantRepo.save(newPlant);

        return new PlantDto(newPlant.getId(), newPlant.getSpeciesId(), "growing", 0, newPlant.getIsPermanent(), 0, def.emoji());
    }

    public List<AvailableSpeciesDto> getAvailableSpecies(String userId) {
        UserForest forest = getOrCreateForest(userId);
        List<ForestUnlock> unlocks = unlockRepo.findByForest_Id(forest.getId());
        Set<String> unlockedReqs = new HashSet<>();
        unlockedReqs.add("default");
        for (ForestUnlock u : unlocks) {
            unlockedReqs.add(u.getUnlockId());
        }
        
        List<AvailableSpeciesDto> list = new ArrayList<>();
        ForestSpeciesConfig.getAllSpecies().values().forEach(def -> {
            boolean isUnlocked = unlockedReqs.contains(def.unlockRequirement());
            list.add(new AvailableSpeciesDto(def.id(), def.name(), def.emoji(), def.unlockRequirement(), isUnlocked));
        });
        
        return list;
    }

    private List<String> checkMilestones(String userId, UserForest forest, List<ForestUnlock> currentUnlocks) {
        List<String> newUnlocks = new ArrayList<>();
        Set<String> unlockedSet = new HashSet<>();
        for (ForestUnlock u : currentUnlocks) unlockedSet.add(u.getUnlockId());

        User user = userRepo.findById(userId).orElse(null);
        if (user == null) return newUnlocks;

        int streak = user.getCurrentStreak() != null ? user.getCurrentStreak() : 0;
        int cards = forest.getTotalCardsReviewed();
        int decks = forest.getMasteredDecks();

        for (ForestSpeciesConfig.UnlockDef def : ForestSpeciesConfig.getAllDecorations().values()) {
            if (!unlockedSet.contains(def.requirement()) && checkCondition(def.requirement(), streak, cards, decks)) {
                ForestUnlock u = ForestUnlock.builder().forest(forest).unlockId(def.requirement()).build();
                unlockRepo.save(u);
                unlockedSet.add(def.requirement());
                newUnlocks.add(def.name());
            }
        }
        // Also check species that have requirements
        for (ForestSpeciesConfig.SpeciesDef def : ForestSpeciesConfig.getAllSpecies().values()) {
            if (!"default".equals(def.unlockRequirement()) && !unlockedSet.contains(def.unlockRequirement()) && checkCondition(def.unlockRequirement(), streak, cards, decks)) {
                ForestUnlock u = ForestUnlock.builder().forest(forest).unlockId(def.unlockRequirement()).build();
                unlockRepo.save(u);
                unlockedSet.add(def.unlockRequirement());
                newUnlocks.add(def.name());
            }
        }
        return newUnlocks;
    }

    private boolean checkCondition(String req, int streak, int cards, int decks) {
        if (req.startsWith("streak_")) return streak >= Integer.parseInt(req.split("_")[1]);
        if (req.startsWith("cards_")) return cards >= Integer.parseInt(req.split("_")[1]);
        if (req.startsWith("deck_mastered_")) return decks >= Integer.parseInt(req.split("_")[2]);
        return false;
    }

    @Transactional
    public void addLightPoints(String userId, int points) {
        UserForest forest = getOrCreateForest(userId);
        forest.setLightPoints(forest.getLightPoints() + points);
        forest.setTotalCardsReviewed(forest.getTotalCardsReviewed() + 1);
        
        // Every 150 points = 1 seed
        int seeds = forest.getLightPoints() / 150;
        if (seeds > 0) {
            forest.setPendingSeeds(forest.getPendingSeeds() + seeds);
            forest.setLightPoints(forest.getLightPoints() % 150);
        }
        
        forestRepo.save(forest);
    }
}
