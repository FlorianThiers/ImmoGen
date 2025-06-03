import requests
from bs4 import BeautifulSoup

from app.AI.Models.data_cleaning_ai import parse_multiple_fields_in_row

def scrape_property_details(detail_url, headers={"User-Agent": "Mozilla/5.0"}):
    """
    Scrape detailed property information from a property detail page.
    
    Args:
        detail_url (str): URL of the property detail page
        headers (dict): HTTP headers for the request
        
    Returns:
        dict: Dictionary containing all scraped property details
    """
    property_data = {
        "header": {
            "title": "None",
            "straat_nr": "None",
            "dorp_postcode": "None",
            "prijs": "None"
        },
        "basisinfo": {
            "staat_pand": "None",
            "bouwjaar": "None"
        },
        "interieur": {
            "slaapkamers": "None",
            "oppervlakte_slaapkamer_1": "None",
            "oppervlakte_slaapkamer_2": "None",
            "oppervlakte_slaapkamer_3": "None",
            "oppervlakte_slaapkamer_4": "None",
            "oppervlakte_slaapkamer_5": "None",
            "oppervlakte_slaapkamer_6": "None",
            "oppervlakte": "None",
            "bewoonbare_opp": "None",
            "oppervlakte_woonruimte": "None",
            "zolder": "None",
            "oppervlakte_zolder": "None",
            "kelder": "None",
            "oppervlakte_kelder": "None",
            "garage": "None",
            "aantal_garages": "None",
            "aantal_parkeerplaatsen": "None",
            "bemeubeld": "None"
        },
        "keuken_sanitair": {
            "oppervlakte_keuken": "None",
            "keukenuitrusting": "None", 
            "badkamers": "None",
            "aantal_douchecabines": "None",
            "aantal_baden": "None",
            "aantal_toiletten": "None"
        },
        "energie_milieu": {
            "type_verwarming": "None",
            "type_glas": "None"
        },
        "uitrusting": {
            "lift": "None",
            "toegang_mindervaliden": "None"
        },
        "buitenruimte": {
            "aantal_gevels": "None",
            "breedte_voorgevel": "None",
            "aantal_verdiepingen": "None",
            "terras": "None",
            "oppervlakte_terras": "None",
            "totale_opp": "None",
            "diepte_perceel": "None",
            "breedte_voorkant_terras": "None",
            "aansluiting_riolering": "None",
            "aansluiting_waterleiding": "None",
            "aansluiting_gasleiding": "None",
            "zwembad": "None",
            "zwembad_oppervlakte": "None",
            "tuin": "None",
            "tuin_oppervlakte": "None",
        }
    }
    
    try:
        response = requests.get(detail_url, headers=headers)
        if response.status_code == 200:
            soup_detail = BeautifulSoup(response.text, 'html.parser')
            
            # Get property title
            title_element = soup_detail.find("h1")
            title = title_element.text.strip() if title_element else "None"
            property_data["header"]["title"] = title
            
            # Get street and number
            address_section = soup_detail.find("div", class_="detail__header_address")
            street_element = address_section.find("span") if address_section else None
            street = street_element.text.strip() if street_element else "None"
            property_data["header"]["straat_nr"] = street
            
            # Get postal code and city
            city_element = address_section.find("span", class_="city-line") if address_section else None
            postal_city = city_element.text.strip() if city_element else "None"
            property_data["header"]["dorp_postcode"] = postal_city
            
            # Get price
            price_element = soup_detail.find("p", class_="detail__header_price")
            price_text = price_element.text.strip() if price_element else "None"
            property_data["header"]["prijs"] = price_text
            
            # Print extracted data for debugging
            print(f"\nExtracted property header details:")
            print(f"  Title: {property_data['header']['title']}")
            print(f"  Street and number: {property_data['header']['straat_nr']}")
            print(f"  Postal code & city: {property_data['header']['dorp_postcode']}")
            print(f"  Price: {property_data['header']['prijs']}")
            
            # Debug: Print all section headers to see available sections
            all_sections = soup_detail.find_all("div", class_="data-row")
            # print(f"\nFound {len(all_sections)} sections on detail page:")
            for i, section in enumerate(all_sections):
                header = section.find("h3")
                header_text = header.text.strip() if header else "No header"
                # print(f"  Section {i+1}: {header_text}")

            # Define data_sections here before it's used
            data_sections = soup_detail.find_all("div", class_="data-row")
            
            # If we can't find sections with data-row class, try to find information in other ways
            if not data_sections or len(data_sections) == 0:
                # print("No data-row sections found, trying alternative approach...")
                
                # Try to find general-info sections
                general_info = soup_detail.find("div", class_="general-info-wrapper")
                if general_info:
                    # print("Found general-info-wrapper section")
                    
                    # Look for basisinformatie
                    basisinfo_section = general_info.find("div", string=lambda text: text and "Basisinformatie" in text)
                    if basisinfo_section:
                        section_parent = basisinfo_section.parent
                        data_rows = section_parent.find_all("div", class_="data-row-wrapper")
                        
                        for row in data_rows:
                            field_name_elem = row.find("h4")
                            field_value_elem = row.find("p")
                            
                            if field_name_elem and field_value_elem:
                                field_name = field_name_elem.text.strip()
                                field_value = field_value_elem.text.strip()
                                print(f"Found field in basisinfo section: '{field_name}' = '{field_value}'")
                                
                                # Process fields
                                if "bouwjaar" in field_name.lower():
                                    property_data["basisinfo"]["bouwjaar"] = field_value
                                elif "staat" in field_name.lower():
                                    property_data["basisinfo"]["staat_pand"] = field_value
                    
                    # Look for interieur section
                    interieur_section = general_info.find("div", string=lambda text: text and any(x in text for x in ["Interieur", "Beschrijving interieur"]))
                    if interieur_section:
                        section_parent = interieur_section.parent
                        data_rows = section_parent.find_all("div", class_="data-row-wrapper")
                        
                        for row in data_rows:
                            field_name_elem = row.find("h4")
                            field_value_elem = row.find("p")
                            
                            if field_name_elem and field_value_elem:
                                field_name = field_name_elem.text.strip()
                                field_value = field_value_elem.text.strip()
                                print(f"Found field in interieur section: '{field_name}' = '{field_value}'")
                                
                                field_name_lower = field_name.lower()
                                # Process fields
                                if any(x in field_name_lower for x in ["bewoonbare opp", "bewoonbare oppervlakte", "woonopp"]):
                                    property_data["interieur"]["bewoonbare_opp"] = field_value
                                elif any(x in field_name_lower for x in ["oppervlakte slaapkamer 1", "opp. slaapkamer 1"]):
                                    property_data["interieur"]["oppervlakte_slaapkamer_1"] = field_value
                                # ... and so on for other fields
                    
                # And so on for other sections...
            
            # Process all found sections
            
            for section in data_sections:
                # Get section header
                section_header = section.find("h3")
                if section_header:
                    section_name = section_header.text.strip().lower()
                    print(f"\nProcessing section: '{section_name}'")
                    
                    # Map section names to our predefined categories
                    section_category = None
                    if any(x in section_name for x in ["basisinformatie", "informatie"]):
                        section_category = "basisinfo"
                    elif any(x in section_name for x in ["interieur", "binnen", "beschrijving interieur"]):
                        section_category = "interieur"
                    elif any(x in section_name for x in ["keuken", "sanitair", "badkamer"]):
                        section_category = "keuken_sanitair"
                    elif any(x in section_name for x in ["energie", "milieu", "isolatie", "epc"]):
                        section_category = "energie_milieu"
                    elif "uitrusting" in section_name:
                        section_category = "uitrusting"
                    elif any(x in section_name for x in ["buiten", "tuin", "terras", "exterieur"]):
                        section_category = "buitenruimte"
                    
                    print(f"  Mapped to category: '{section_category}'")
                    
                    if section_category:
                        # Find all data rows in this section
                        data_rows = section.find_all("div", class_="data-row-wrapper")
                        print(data_rows)
                        
                        for row_wrapper in section.find_all("div", class_="data-row-wrapper"):
                            field_pairs = parse_multiple_fields_in_row(row_wrapper)
                            for field_name, field_value in field_pairs:
                                print(f"  → {field_name}: {field_value}")

                                field_name_lower = field_name.lower()

                                # Map specific field names to our property data structure
                                if section_category == "basisinfo":
                                    field_name_lower = field_name.lower()
                                    print(f"  Found field in 'basisinfo' section: '{field_name}' = '{field_value}'")
                                    if "bouwjaar" in field_name_lower:
                                        property_data["basisinfo"]["bouwjaar"] = field_value
                                        print(f"    → Saved bouwjaar: {field_value}")
                                    elif "staat" in field_name_lower:
                                        property_data["basisinfo"]["staat_pand"] = field_value
                                        print(f"    → Saved staat_pand: {field_value}")
                                        
                                elif section_category == "interieur":
                                    # Debug print to see what fields are found
                                    print(f"Found field in 'interieur' section: '{field_name}' = '{field_value}'")
                                    
                                    # First check for specific fields with flexible matching
                                    field_name_lower = field_name.lower()
                                    
                                    # Bewoonbare oppervlakte - try multiple variants
                                    if any(x in field_name_lower for x in ["bewoonbare opp", "bewoonbare oppervlakte", "woonopp"]):
                                        property_data["interieur"]["bewoonbare_opp"] = field_value
                                        print(f"  → Found bewoonbare_opp: {field_value}")
                                    
                                    # Slaapkamers - different ways they might appear
                                    elif "aantal slaapkamers" in field_name_lower:
                                        property_data["interieur"]["slaapkamers"] = field_value
                                        print(f"  → Found slaapkamers: {field_value}")
                                    
                                    # Slaapkamer oppervlaktes
                                    elif "oppervlakte slaapkamer 1" in field_name_lower or "opp. slaapkamer 1" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_slaapkamer_1"] = field_value
                                        print(f"  → Found oppervlakte_slaapkamer_1: {field_value}")
                                    elif "oppervlakte slaapkamer 2" in field_name_lower or "opp. slaapkamer 2" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_slaapkamer_2"] = field_value
                                        print(f"  → Found oppervlakte_slaapkamer_2: {field_value}")
                                    elif "oppervlakte slaapkamer 3" in field_name_lower or "opp. slaapkamer 3" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_slaapkamer_3"] = field_value
                                        print(f"  → Found oppervlakte_slaapkamer_3: {field_value}")
                                    elif "oppervlakte slaapkamer 4" in field_name_lower or "opp. slaapkamer 4" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_slaapkamer_4"] = field_value
                                        print(f"  → Found oppervlakte_slaapkamer_4: {field_value}")
                                    elif "oppervlakte slaapkamer 5" in field_name_lower or "opp. slaapkamer 5" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_slaapkamer_5"] = field_value
                                        print(f"  → Found oppervlakte_slaapkamer_5: {field_value}")
                                    elif "oppervlakte slaapkamer 6" in field_name_lower or "opp. slaapkamer 6" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_slaapkamer_6"] = field_value
                                        print(f"  → Found oppervlakte_slaapkamer_6: {field_value}")
                                    
                                    # Other interior features
                                    
                                    elif any(x in field_name_lower for x in ["oppervlakte van de woonruimte", "opp. woonruimte"]):
                                        property_data["interieur"]["oppervlakte_woonruimte"] = field_value
                                        print(f"  → Found oppervlakte_woonruimte: {field_value}")
                                    elif field_name_lower == "veranda":
                                        property_data["interieur"]["veranda"] = field_value
                                        print(f"  → Found veranda: {field_value}")
                                    elif "oppervlakte veranda" in field_name_lower or "opp. veranda" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_veranda"] = field_value
                                        print(f"  → Found oppervlakte_veranda: {field_value}")
                                    elif field_name_lower == "zolder":
                                        property_data["interieur"]["zolder"] = field_value
                                        print(f"  → Found zolder: {field_value}")
                                    elif "oppervlakte zolder" in field_name_lower or "opp. zolder" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_zolder"] = field_value
                                        print(f"  → Found oppervlakte_zolder: {field_value}")
                                    elif field_name_lower == "kelder":
                                        property_data["interieur"]["kelder"] = field_value
                                        print(f"  → Found kelder: {field_value}")
                                    elif "oppervlakte kelder" in field_name_lower or "opp. kelder" in field_name_lower:
                                        property_data["interieur"]["oppervlakte_kelder"] = field_value
                                        print(f"  → Found oppervlakte_kelder: {field_value}")
                                    elif field_name_lower == "garage":
                                        property_data["interieur"]["garage"] = field_value
                                        print(f"  → Found garage: {field_value}")
                                    elif "aantal garages" in field_name_lower:
                                        property_data["interieur"]["aantal_garages"] = field_value
                                        print(f"  → Found aantal_garages: {field_value}")
                                    elif "aantal parkeerplaatsen" in field_name_lower:
                                        property_data["interieur"]["aantal_parkeerplaatsen"] = field_value
                                        print(f"  → Found aantal_parkeerplaatsen: {field_value}")
                                    elif field_name_lower == "bemeubeld":
                                        property_data["interieur"]["bemeubeld"] = field_value
                                        print(f"  → Found bemeubeld: {field_value}")
                                        
                                # Add similar mappings for other sections
                                elif section_category == "keuken_sanitair":
                                    if "oppervlakte keuken" in field_name.lower():
                                        property_data["keuken_sanitair"]["oppervlakte_keuken"] = field_value
                                    elif "keukenuitrusting" in field_name.lower():
                                        property_data["keuken_sanitair"]["keukenuitrusting"] = field_value
                                    elif "aantal badkamers" in field_name.lower():
                                        property_data["keuken_sanitair"]["badkamers"] = field_value
                                    elif "douchecabines" in field_name.lower():
                                        property_data["keuken_sanitair"]["aantal_douchecabines"] = field_value
                                    elif "baden" in field_name.lower():
                                        property_data["keuken_sanitair"]["aantal_baden"] = field_value
                                    elif "toiletten" in field_name.lower():
                                        property_data["keuken_sanitair"]["aantal_toiletten"] = field_value
                                    
                                # Continue from where keuken_sanitair section ended
                                elif section_category == "energie_milieu":
                                    field_name_lower = field_name.lower()
                                    
                                    if any(x in field_name_lower for x in ["type verwarming", "verwarming", "verwarmingstype"]):
                                        property_data["energie_milieu"]["type_verwarming"] = field_value
                                        print(f"  → Found type_verwarming: {field_value}")
                                    elif any(x in field_name_lower for x in ["type glas", "dubbel glas", "beglazing"]):
                                        property_data["energie_milieu"]["type_glas"] = field_value
                                        print(f"  → Found type_glas: {field_value}")

                                elif section_category == "uitrusting":
                                    field_name_lower = field_name.lower()
                                    
                                    if "lift" in field_name_lower:
                                        property_data["uitrusting"]["lift"] = field_value
                                        print(f"  → Found lift: {field_value}")
                                    elif any(x in field_name_lower for x in ["toegang mindervaliden", "mindervaliden", "toegankelijkheid"]):
                                        property_data["uitrusting"]["toegang_mindervaliden"] = field_value
                                        print(f"  → Found toegang_mindervaliden: {field_value}")

                                elif section_category == "buitenruimte":
                                    field_name_lower = field_name.lower()
                                    
                                    # Check for all buitenruimte fields with flexible matching
                                    if any(x in field_name_lower for x in ["aantal gevels", "gevels"]):
                                        property_data["buitenruimte"]["aantal_gevels"] = field_value
                                        print(f"  → Found aantal_gevels: {field_value}")
                                    elif any(x in field_name_lower for x in ["breedte voorgevel", "breedte gevel", "voorgevel"]):
                                        property_data["buitenruimte"]["breedte_voorgevel"] = field_value
                                        print(f"  → Found breedte_voorgevel: {field_value}")
                                    elif any(x in field_name_lower for x in ["aantal verdiepingen", "verdiepingen"]):
                                        property_data["buitenruimte"]["aantal_verdiepingen"] = field_value
                                        print(f"  → Found aantal_verdiepingen: {field_value}")
                                    elif field_name_lower == "terras":
                                        property_data["buitenruimte"]["terras"] = field_value
                                        print(f"  → Found terras: {field_value}")
                                    elif any(x in field_name_lower for x in ["oppervlakte terras", "opp. terras"]):
                                        property_data["buitenruimte"]["oppervlakte_terras"] = field_value
                                        print(f"  → Found oppervlakte_terras: {field_value}")
                                    elif any(x in field_name_lower for x in ["totale oppervlakte", "totale opp", "Totaal grondoppervlakte"]):
                                        property_data["buitenruimte"]["totale_opp"] = field_value
                                        print(f"  → Found totale_opp: {field_value}")
                                    elif any(x in field_name_lower for x in ["diepte perceel", "perceel diepte"]):
                                        property_data["buitenruimte"]["diepte_perceel"] = field_value
                                        print(f"  → Found diepte_perceel: {field_value}")
                                    elif any(x in field_name_lower for x in ["breedte voorkant terras", "breedte terras"]):
                                        property_data["buitenruimte"]["breedte_voorkant_terras"] = field_value
                                        print(f"  → Found breedte_voorkant_terras: {field_value}")
                                    elif any(x in field_name_lower for x in ["aansluiting riolering", "riolering"]):
                                        property_data["buitenruimte"]["aansluiting_riolering"] = field_value
                                        print(f"  → Found aansluiting_riolering: {field_value}")
                                    elif any(x in field_name_lower for x in ["aansluiting waterleiding", "waterleiding"]):
                                        property_data["buitenruimte"]["aansluiting_waterleiding"] = field_value
                                        print(f"  → Found aansluiting_waterleiding: {field_value}")
                                    elif any(x in field_name_lower for x in ["aansluiting gasleiding", "gasleiding"]):
                                        property_data["buitenruimte"]["aansluiting_gasleiding"] = field_value
                                        print(f"  → Found aansluiting_gasleiding: {field_value}")
                                    elif field_name_lower == "zwembad":
                                        property_data["buitenruimte"]["zwembad"] = field_value
                                        print(f"  → Found zwembad: {field_value}")
                                    elif field_name_lower == "zwembad oppervlakte":
                                        property_data["buitenruimte"]["zwembad_oppervlakte"] = field_value
                                        print(f"  → Found buitenruimte: {field_value}")
                                    elif field_name_lower == "tuin":
                                        property_data["buitenruimte"]["tuin"] = field_value
                                        print(f"  → Found tuin: {field_value}")
                                    elif field_name_lower == "Oppervlakte tuin":
                                        property_data["buitenruimte"]["tuin_oppervlakte"] = field_value
                                        print(f"  → Found tuin_oppervlakte: {field_value}")
                            
    except Exception as e:
        print(f"Error scraping detail page {detail_url}: {e}")
    
    return property_data
            