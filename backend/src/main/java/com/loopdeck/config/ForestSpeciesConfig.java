package com.loopdeck.config;

import java.util.Map;
import java.util.HashMap;

public class ForestSpeciesConfig {

    public record SpeciesDef(String id, String name, String emoji, long maturationHours, long cycleHours, boolean isPermanent, String unlockRequirement) {}
    public record UnlockDef(String id, String name, String emoji, String requirement) {}

    private static final Map<String, SpeciesDef> SPECIES = new HashMap<>();
    private static final Map<String, UnlockDef> DECORATIONS = new HashMap<>();

    static {
        // PERMANENT TREES
        SPECIES.put("pine", new SpeciesDef("pine", "Pino", "🌲", 72, 0, true, "default"));
        SPECIES.put("oak", new SpeciesDef("oak", "Roble", "🌳", 144, 0, true, "cards_500"));
        SPECIES.put("cherry_blossom", new SpeciesDef("cherry_blossom", "Cerezo", "🌸", 120, 0, true, "streak_7"));
        SPECIES.put("maple", new SpeciesDef("maple", "Arce", "🍁", 96, 0, true, "deck_mastered_1"));

        // HARVESTABLE PLANTS (Huerto)
        SPECIES.put("tomato", new SpeciesDef("tomato", "Tomate", "🍅", 48, 48, false, "default"));
        SPECIES.put("apple_tree", new SpeciesDef("apple_tree", "Manzano", "🍎", 96, 96, false, "default"));
        SPECIES.put("sunflower", new SpeciesDef("sunflower", "Girasol", "🌻", 48, 72, false, "streak_14"));

        // DECORATIONS / FAUNA
        DECORATIONS.put("deer", new UnlockDef("deer", "Ciervo", "🦌", "streak_30"));
        DECORATIONS.put("pond", new UnlockDef("pond", "Estanque", "💧", "cards_1000"));
        DECORATIONS.put("lantern", new UnlockDef("lantern", "Farolillo", "🏮", "deck_mastered_3"));
        DECORATIONS.put("bench", new UnlockDef("bench", "Banco de madera", "🪑", "streak_60"));
    }

    public static SpeciesDef getSpecies(String id) {
        return SPECIES.get(id);
    }

    public static UnlockDef getDecoration(String id) {
        return DECORATIONS.get(id);
    }

    public static Map<String, SpeciesDef> getAllSpecies() {
        return SPECIES;
    }

    public static Map<String, UnlockDef> getAllDecorations() {
        return DECORATIONS;
    }
}
