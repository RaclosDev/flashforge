import json
import os
import urllib.request

TEMPLATES_DIR = "backend/src/main/resources/templates"
os.makedirs(TEMPLATES_DIR, exist_ok=True)

print("Fetching countries data...")
url = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

countries = []
for country in data:
    name = country.get('translations', {}).get('spa', {}).get('common', country.get('name', {}).get('common'))
    capital = country.get('capital', [""])[0] if country.get('capital') else ""
    continent = country.get('region', "Unknown") 
    flag = country.get('flag', "") 
    
    if not capital: continue
    
    region_map = {
        "Europe": "Europe",
        "Americas": "America",
        "Asia": "Asia",
        "Africa": "Africa",
        "Oceania": "Oceania"
    }
    
    mapped_continent = region_map.get(continent, "Unknown")
    
    if mapped_continent != "Unknown" and flag:
        countries.append({
            "name": name,
            "capital": capital,
            "continent": mapped_continent,
            "flag": flag
        })

countries.sort(key=lambda x: x['name'])
print(f"Loaded {len(countries)} countries.")

# Agrupar por continentes
by_continent = {"Europe": [], "America": [], "Asia": [], "Africa": [], "Oceania": []}

for c in countries:
    if c["continent"] in by_continent:
        by_continent[c["continent"]].append(c)

# 1. Capitales por continente
continent_names = {
    "Europe": "Europa",
    "America": "América",
    "Asia": "Asia",
    "Africa": "África",
    "Oceania": "Oceanía"
}

for cont, list_c in by_continent.items():
    if not list_c: continue
    cards = [{"front": c["name"], "back": c["capital"]} for c in list_c]
    deck = {
        "id": f"capitals-{cont.lower()}",
        "name": f"Capitales de {continent_names[cont]}",
        "description": f"Aprende las capitales de los países de {continent_names[cont]}.",
        "category": "Geografía",
        "cards": cards
    }
    with open(f"{TEMPLATES_DIR}/capitals-{cont.lower()}.json", "w", encoding="utf-8") as f:
        json.dump(deck, f, ensure_ascii=False, indent=2)

# 2. Capitales del mundo
world_cards = [{"front": c["name"], "back": c["capital"]} for c in countries]
world_deck = {
    "id": "capitals-world",
    "name": "Capitales del Mundo",
    "description": "El reto definitivo. Todas las capitales del mundo en un solo mazo.",
    "category": "Geografía",
    "cards": world_cards
}
with open(f"{TEMPLATES_DIR}/capitals-world.json", "w", encoding="utf-8") as f:
    json.dump(world_deck, f, ensure_ascii=False, indent=2)

# 3. Banderas del mundo
flags_cards = [{"front": c["flag"], "back": c["name"]} for c in countries]
flags_deck = {
    "id": "flags-world",
    "name": "Banderas del Mundo",
    "description": "Memoriza las banderas de todos los países usando emojis nativos.",
    "category": "Cultura",
    "cards": flags_cards
}
with open(f"{TEMPLATES_DIR}/flags-world.json", "w", encoding="utf-8") as f:
    json.dump(flags_deck, f, ensure_ascii=False, indent=2)

# 4. Generar registry.json
registry = []
for cont, list_c in by_continent.items():
    if not list_c: continue
    registry.append({
        "id": f"capitals-{cont.lower()}",
        "name": f"Capitales de {continent_names[cont]}",
        "description": f"Aprende las capitales de {continent_names[cont]}.",
        "category": "Geografía",
        "icon": "🗺️",
        "cardCount": len(list_c)
    })

registry.append({
    "id": "capitals-world",
    "name": "Capitales del Mundo",
    "description": "El reto definitivo. Todas las capitales del mundo en un solo mazo.",
    "category": "Geografía",
    "icon": "🌍",
    "cardCount": len(countries)
})

registry.append({
    "id": "flags-world",
    "name": "Banderas del Mundo",
    "description": "Memoriza las banderas de todos los países usando emojis nativos.",
    "category": "Cultura",
    "icon": "🚩",
    "cardCount": len(countries)
})

with open(f"{TEMPLATES_DIR}/registry.json", "w", encoding="utf-8") as f:
    json.dump(registry, f, ensure_ascii=False, indent=2)

print("¡Archivos JSON generados correctamente!")
