import json
import os

TEMPLATES_DIR = "backend/src/main/resources/templates"
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Datos base
countries = [
    {"name": "España", "capital": "Madrid", "continent": "Europe", "flag": "🇪🇸"},
    {"name": "Francia", "capital": "París", "continent": "Europe", "flag": "🇫🇷"},
    {"name": "Alemania", "capital": "Berlín", "continent": "Europe", "flag": "🇩🇪"},
    {"name": "Italia", "capital": "Roma", "continent": "Europe", "flag": "🇮🇹"},
    {"name": "Reino Unido", "capital": "Londres", "continent": "Europe", "flag": "🇬🇧"},
    {"name": "Portugal", "capital": "Lisboa", "continent": "Europe", "flag": "🇵🇹"},
    {"name": "Grecia", "capital": "Atenas", "continent": "Europe", "flag": "🇬🇷"},
    {"name": "Rusia", "capital": "Moscú", "continent": "Europe", "flag": "🇷🇺"},
    {"name": "Suecia", "capital": "Estocolmo", "continent": "Europe", "flag": "🇸🇪"},
    {"name": "Noruega", "capital": "Oslo", "continent": "Europe", "flag": "🇳🇴"},
    {"name": "Finlandia", "capital": "Helsinki", "continent": "Europe", "flag": "🇫🇮"},
    {"name": "Polonia", "capital": "Varsovia", "continent": "Europe", "flag": "🇵🇱"},
    {"name": "Ucrania", "capital": "Kiev", "continent": "Europe", "flag": "🇺🇦"},
    {"name": "Irlanda", "capital": "Dublín", "continent": "Europe", "flag": "🇮🇪"},
    {"name": "Países Bajos", "capital": "Ámsterdam", "continent": "Europe", "flag": "🇳🇱"},

    {"name": "Estados Unidos", "capital": "Washington D.C.", "continent": "America", "flag": "🇺🇸"},
    {"name": "Canadá", "capital": "Ottawa", "continent": "America", "flag": "🇨🇦"},
    {"name": "México", "capital": "Ciudad de México", "continent": "America", "flag": "🇲🇽"},
    {"name": "Brasil", "capital": "Brasilia", "continent": "America", "flag": "🇧🇷"},
    {"name": "Argentina", "capital": "Buenos Aires", "continent": "America", "flag": "🇦🇷"},
    {"name": "Colombia", "capital": "Bogotá", "continent": "America", "flag": "🇨🇴"},
    {"name": "Chile", "capital": "Santiago", "continent": "America", "flag": "🇨🇱"},
    {"name": "Perú", "capital": "Lima", "continent": "America", "flag": "🇵🇪"},
    {"name": "Venezuela", "capital": "Caracas", "continent": "America", "flag": "🇻🇪"},
    {"name": "Cuba", "capital": "La Habana", "continent": "America", "flag": "🇨🇺"},

    {"name": "China", "capital": "Pekín", "continent": "Asia", "flag": "🇨🇳"},
    {"name": "Japón", "capital": "Tokio", "continent": "Asia", "flag": "🇯🇵"},
    {"name": "Corea del Sur", "capital": "Seúl", "continent": "Asia", "flag": "🇰🇷"},
    {"name": "India", "capital": "Nueva Delhi", "continent": "Asia", "flag": "🇮🇳"},
    {"name": "Turquía", "capital": "Ankara", "continent": "Asia", "flag": "🇹🇷"},
    {"name": "Arabia Saudita", "capital": "Riad", "continent": "Asia", "flag": "🇸🇦"},
    {"name": "Indonesia", "capital": "Yakarta", "continent": "Asia", "flag": "🇮🇩"},
    {"name": "Irán", "capital": "Teherán", "continent": "Asia", "flag": "🇮🇷"},
    {"name": "Pakistán", "capital": "Islamabad", "continent": "Asia", "flag": "🇵🇰"},
    {"name": "Vietnam", "capital": "Hanói", "continent": "Asia", "flag": "🇻🇳"},

    {"name": "Egipto", "capital": "El Cairo", "continent": "Africa", "flag": "🇪🇬"},
    {"name": "Sudáfrica", "capital": "Pretoria", "continent": "Africa", "flag": "🇿🇦"},
    {"name": "Nigeria", "capital": "Abuya", "continent": "Africa", "flag": "🇳🇬"},
    {"name": "Kenia", "capital": "Nairobi", "continent": "Africa", "flag": "🇰🇪"},
    {"name": "Marruecos", "capital": "Rabat", "continent": "Africa", "flag": "🇲🇦"},
    {"name": "Argelia", "capital": "Argel", "continent": "Africa", "flag": "🇩🇿"},
    {"name": "Etiopía", "capital": "Adís Abeba", "continent": "Africa", "flag": "🇪🇹"},
    {"name": "Ghana", "capital": "Acra", "continent": "Africa", "flag": "🇬🇭"},

    {"name": "Australia", "capital": "Canberra", "continent": "Oceania", "flag": "🇦🇺"},
    {"name": "Nueva Zelanda", "capital": "Wellington", "continent": "Oceania", "flag": "🇳🇿"},
    {"name": "Fiyi", "capital": "Suva", "continent": "Oceania", "flag": "🇫🇯"},
]

templates = []

def create_capitals_template(id_suffix, name, desc, continent_filter=None):
    filtered = [c for c in countries if continent_filter is None or c["continent"] == continent_filter]
    if not filtered: return
    cards = [{"front": c["name"], "back": c["capital"]} for c in filtered]
    
    data = {
        "id": f"capitals-{id_suffix}",
        "name": name,
        "description": desc,
        "category": "Geografía",
        "icon": "🌍" if continent_filter is None else "🗺️",
        "cards": cards
    }
    
    path = os.path.join(TEMPLATES_DIR, f"{data['id']}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    templates.append(data)

# Capitals
create_capitals_template("europe", "Capitales de Europa", "Aprende las capitales de los principales países europeos.", "Europe")
create_capitals_template("america", "Capitales de América", "Aprende las capitales de los principales países americanos.", "America")
create_capitals_template("asia", "Capitales de Asia", "Aprende las capitales de los principales países asiáticos.", "Asia")
create_capitals_template("africa", "Capitales de África", "Aprende las capitales de los principales países africanos.", "Africa")
create_capitals_template("oceania", "Capitales de Oceanía", "Aprende las capitales de Oceanía.", "Oceania")
create_capitals_template("world", "Capitales del Mundo", "El reto definitivo. Todas las capitales importantes del mundo en un solo mazo.", None)

# Flags
flags_cards = [{"front": f"<div style='font-size: 80px; text-align: center;'>{c['flag']}</div>", "back": c["name"]} for c in countries]
flags_data = {
    "id": "flags-world",
    "name": "Banderas del Mundo",
    "description": "Memoriza las banderas de los principales países usando emojis nativos.",
    "category": "Cultura",
    "icon": "🚩",
    "cards": flags_cards
}
path = os.path.join(TEMPLATES_DIR, f"{flags_data['id']}.json")
with open(path, "w", encoding="utf-8") as f:
    json.dump(flags_data, f, ensure_ascii=False, indent=2)
templates.append(flags_data)

# Registry
registry = [
    {
        "id": t["id"],
        "name": t["name"],
        "description": t["description"],
        "category": t["category"],
        "icon": t["icon"],
        "cardCount": len(t["cards"])
    }
    for t in templates
]

with open(os.path.join(TEMPLATES_DIR, "registry.json"), "w", encoding="utf-8") as f:
    json.dump(registry, f, ensure_ascii=False, indent=2)

print("✅ Templates generated successfully in", TEMPLATES_DIR)
