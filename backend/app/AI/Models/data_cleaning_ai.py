import re

def parse_multiple_fields_in_row(row_wrapper) -> list[tuple[str, str]]:
    results = []
    sub_blocks = row_wrapper.find_all("div", recursive=False)

    for block in sub_blocks:
        h4 = block.find("h4")
        p = block.find("p")
        if h4 and p:
            key = h4.text.strip()
            value = p.text.strip()
            results.append((key, value))

    return results

def clean_price(price_text):
    if isinstance(price_text, str):
        price_text = re.sub(r'[\s\u202f\u00a0]', '', price_text)
        prices = list(map(int, re.findall(r'\d+', price_text)))
        if len(prices) == 1:
            return prices[0]
        elif len(prices) > 1:
            return sum(prices) // len(prices)
    return 0

def clean_area(area_text):
    if isinstance(area_text, str):
        match = re.search(r'(\d+(?:[\.,]\d+)?)', area_text)
        if match:
            return float(match.group(1).replace(',', '.'))
    return 0

def clean_rooms(rooms_text):
    if isinstance(rooms_text, str):
        match = re.search(r'(\d+)', rooms_text)
        if match:
            return int(match.group(1))
    return 2

def clean_title(title_text):
    if not isinstance(title_text, str):
        return "onbekend"
    
    # Zet om naar kleine letters voor case-insensitive matching
    title_text = title_text.lower()
    
    # Verwijder nieuwbouwproject indicaties en "te koop" om het basis type te extraheren
    title_text = title_text.replace("(nieuwbouwproject)", "").replace("te koop", "").strip()
    
    # Identificeer het type vastgoed
    if "project:" in title_text:
        return "project"
    elif "appartement" in title_text:
        return "appartement"
    elif "duplex" in title_text:
        return "appartement"  # duplex is een soort appartement
    elif "huis gemengd gebruik" in title_text:
        return "huis_gemengd"
    elif "huis" in title_text:
        return "huis"
    elif "villa" in title_text:
        return "villa"
    elif "herenhuis" in title_text:
        return "herenhuis"
    elif "bungalow" in title_text:
        return "bungalow"
    elif "fermette" in title_text:
        return "fermette"
    elif "parking" in title_text or "garagebox" in title_text:
        return "parking"
    elif "grond" in title_text or "verkavelingsgrond" in title_text:
        return "grond"
    elif "handelspand" in title_text:
        return "handelspand"
    elif "handelsfonds" in title_text:
        return "handelsfonds"
    elif "kantoor" in title_text:
        return "kantoor"
    elif "opbrengsteigendom" in title_text:
        return "opbrengsteigendom"
    elif "penthouse" in title_text:
        return "penthouse"
    else:
        return "overig"
    
def clean_surface_area_m2(raw_text):
    """
    Extracts the first float value from a string containing surface area, e.g. '15 m²' → 15.0
    """
    if isinstance(raw_text, str):
        match = re.search(r'(\d+(?:[.,]\d+)?)', raw_text)
        if match:
            return float(match.group(1).replace(',', '.'))
    return 0

def clean_street_name(full_address):
    if full_address == "None" or not full_address:
        return "None"

    full_address = full_address.strip()
    match = re.search(r'(\d+[A-Za-z]*)$', full_address)

    if match:
        street = full_address[:match.start()].strip()
        street = re.sub(r'[\,\s]+$', '', street)
        return street
    else:
        return full_address

def clean_house_number(full_address):
    if full_address == "None" or not full_address:
        return 0

    match = re.search(r'(\d+[A-Za-z]*)$', full_address)

    if match:
        return match.group(1)
    else:
        return 0

def clean_city(postal_city_text):
    if postal_city_text == "None" or not postal_city_text:
        return "None"

    match = re.search(r'^\d{4}\s+(.+)$', postal_city_text)

    if match:
        return match.group(1).strip()
    else:
        match = re.search(r'[^\d\s]+.*$', postal_city_text)
        if match:
            return match.group(0).strip()
        else:
            return "None"

def clean_postal_code(postal_city_text):
    if postal_city_text == "None" or not postal_city_text:
        return "None"

    match = re.search(r'^(\d{4})', postal_city_text)

    if match:
        return match.group(1)
    else:
        return "None"   

def clean_boolean(value_text):
    """
    Converts a string boolean or missing value into a proper boolean.
    'ja', 'yes', 'true' → True
    'nee', 'no', 'false', 'none', '', None → False
    """
    if not value_text or str(value_text).strip().lower() in {"none", "", "false", "nee", "no"}:
        return False
    return True

def clean_none(int_text):
    if not int_text or str(int_text).strip().lower() in {"none"}:
        return 0
    return int_text