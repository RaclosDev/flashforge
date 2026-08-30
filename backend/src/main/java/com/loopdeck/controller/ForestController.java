package com.loopdeck.controller;

import com.loopdeck.service.ForestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/forest")
@RequiredArgsConstructor
public class ForestController {

    private final ForestService forestService;

    @GetMapping
    public ResponseEntity<ForestService.ForestViewDto> getForest(Authentication auth) {
        return ResponseEntity.ok(forestService.getForestView(auth.getName()));
    }

    public record PlantSeedRequest(String speciesId) {}

    @PostMapping("/plant")
    public ResponseEntity<ForestService.PlantDto> plantSeed(Authentication auth, @RequestBody PlantSeedRequest req) {
        return ResponseEntity.ok(forestService.plantSeed(auth.getName(), req.speciesId()));
    }

    @GetMapping("/available-species")
    public ResponseEntity<List<ForestService.AvailableSpeciesDto>> getAvailableSpecies(Authentication auth) {
        return ResponseEntity.ok(forestService.getAvailableSpecies(auth.getName()));
    }
}
