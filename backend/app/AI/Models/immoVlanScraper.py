import time
import requests
import pandas as pd
from bs4 import BeautifulSoup
from sqlalchemy import Null
from sqlalchemy.orm import Session

from app.models.house import ScrapeHouse

from app.AI.Models.data_cleaning_ai import clean_price, clean_area, clean_rooms
from app.AI.Models.predict_element_ai import estimate_distance_to_center, estimate_neighborhood_safety



def scrap_houses(db: Session, max_pages, base_url="https://immovlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&noindex=1&page", start_page=1):
        """
        Scrap propertiedata van Immovlan over meerdere pagina's.
        
        Args:
            base_url (str): Basis URL zonder paginanummer
            start_page (int): Pagina om mee te beginnen
            max_pages (int): Maximum aantal pagina's om te scrapen
            
        Returns:
            pd.DataFrame: DataFrame met propertiegegevens
        """
        print(f"Bezig met scrapen van Immovlan, pagina's {start_page} t/m {start_page + max_pages - 1}...")
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
        
        # Zorg ervoor dat de base_url eindigt met '='
        if not base_url.endswith('='):
            base_url += '='
        
        for current_page in range(start_page, start_page + max_pages):
            # Bereken voortgangspercentage
            progress = ((current_page - start_page + 1) / max_pages) * 100
            print(f"📊 Voortgang: {progress:.2f}% - Bezig met scrapen van pagina {current_page}")
        
            current_url = f"{base_url}{current_page}"
            print(f"Bezig met scrapen van pagina {current_page}: {current_url}")
            
            try:
                # Wacht even tussen verzoeken om de server niet te overbelasten
                time.sleep(2)
                response = requests.get(current_url, headers=headers)
                response.raise_for_status()  # Raise exception voor HTTP errors
                soup = BeautifulSoup(response.text, "html.parser")
                
                # Controleer of we op de juiste pagina zijn
                page_verified = False
                pagination = soup.find("ul", class_="pagination")
                if pagination:
                    active_page = pagination.find("li", class_="page-item active")
                    if active_page:
                        active_link = active_page.find("a", class_="page-link")
                        if active_link and active_link.text.strip():
                            page_verified = True
                            print(f"Bevestigd: we zijn op pagina {active_link.text.strip()}")
                
                properties = soup.find_all("article", class_="list-view-item")
                
                if not properties:
                    print(f"Geen properties gevonden op pagina {current_page} met class 'list-view-item'")
                    # Probeer alternatieve klassen te vinden
                    alternative_classes = ["grid-view-item", "property-item", "result-item"]
                    for alt_class in alternative_classes:
                        properties = soup.find_all("article", class_=alt_class)
                        if properties:
                            print(f"propertieen gevonden met alternatieve class '{alt_class}'")
                            break
                
                if not properties:
                    print(f"Geen properties gevonden op pagina {current_page}. Proberen door te gaan naar volgende pagina.")
                    continue  # Probeer door te gaan naar de volgende pagina in plaats van te stoppen
                    
                print(f"Gevonden: {len(properties)} properties op pagina {current_page}")
                
                for propertie in properties:
                    try:
                        titel = propertie.find("h2").text.strip()
                        prijs_tekst = propertie.find("strong", class_="list-item-price").text.strip()
                        locatie = propertie.find("p", class_="mb-1").text.strip()
                        
                        # # Controleer of de woning al bestaat in de database
                        # existing_house = db.query(House).filter_by(title=titel, location=locatie).first()
                        # if existing_house:
                        #     print(f"⏩ Woning '{titel}' op locatie '{locatie}' bestaat al. Overslaan.")
                        #     continue
                        
                        # Vind alle property-highlight spans
                        property_spans = propertie.find_all("span", class_="property-highlight")
                        

                     # 🏠 Extra details ophalen van de detailpagina
                        # basisinfo
                        staat_pand = "Null"
                        bouwjaar = 0

                        # interieur
                        slaapkamers = 0
                        oppervlakte_slaapkamer_1 = 0
                        oppervlakte_slaapkamer_2 = 0
                        oppervlakte_slaapkamer_3 = 0
                        oppervlakte_slaapkamer_4 = 0
                        oppervlakte_slaapkamer_5 = 0
                        oppervlakte_slaapkamer_6 = 0
                        oppervlakte = 0
                        bewoonbare_opp = 0
                        oppervlakte_woonruimte = 0
                        zolder = False
                        oppervlakte_zolder = 0
                        kelder = False
                        oppervlakte_kelder = 0
                        garage = False
                        oppervlakte_garage = 0
                        aantal_garages = 0
                        aantal_parkeerplaatsen = 0
                        bemeubeld = False


                        # keuken en sanitair
                        oppervlakte_keuken = 0
                        keukenuitrusting = "Null"
                        badkamers = 0
                        aantal_douchecabines = 0
                        aantal_baden = 0
                        aantal_toiletten = 0

                        # energie en milieu
                        epc = "Null"
                        type_verwarming = "Null"
                        type_glas = "Null"
                        zonnepanelen = False
                        oppervlakte_zonnepanelen = 0

                        # uitrusting
                        lift = False
                        toegang_mindervaliden = False

                        # buitenruimte
                        aantal_gevels = 0
                        breedte_voorgevel = 0
                        verdieping = 0
                        aantal_verdiepingen = 0
                        terras = False
                        oppervlakte_terras = 0
                        diepte_perceel = 0
                        breedte_voorkant_terras = 0
                        aansluiting_riolering = True
                        aansluiting_waterleiding = True
                        aansluiting_gasleiding = True
                        zwembad = False
                        oppervlakte_zwembad = 0
                        tuin = False
                        oppervlakte_tuin = 0

                        source = "immovlan"
                        
                        for span in property_spans:
                            span_text = span.text.strip()
                            if "Slaapkamer" in span_text:
                                slaapkamers = span_text
                            elif "m²" in span_text:
                                oppervlakte = span_text
                            elif "Badkamer" in span_text:
                                badkamers = span_text
                        
                        # Extract extra kenmerken uit titel en beschrijving
                        heeft_tuin = 1 if "tuin" in titel.lower() else 0
                        heeft_terras = 1 if "terras" in titel.lower() else 0
                        heeft_zonnepanelen = 1 if "zonnepanelen" in titel.lower() else 0
                        
                        # Geschatte waarden voor niet-zichtbare kenmerken
                        afstand_centrum = estimate_distance_to_center(locatie)
                        buurtveiligheid = estimate_neighborhood_safety(locatie)
                        
                        # Voeg optioneel de URL van de propertie details toe
                        detail_article = propertie.find("div", class_="media-pic")
                        detail_link = detail_article.find("a") if detail_article else Null
                        detail_url = ""
                        if detail_link and "href" in detail_link.attrs:
                            detail_url = detail_link["href"]
                            if not detail_url.startswith("http"):
                                detail_url = f"https://immovlan.be{detail_url}"

                        if detail_url:
                            try:
                                response = requests.get(detail_url, headers={"User-Agent": "Mozilla/5.0"})
                                if response.status_code == 200:
                                    soup_detail = BeautifulSoup(response.text, 'html.parser')

                                # Basisinfo
                                    bouwjaar_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Bouwjaar")
                                    if bouwjaar_element:
                                        bouwjaar = bouwjaar_element.find_next("p").text.strip()

                                    staat_pand_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Staat van het zoekertje")
                                    if staat_pand_element:
                                        staat_pand = staat_pand_element.find_next("p").text.strip()

                                # Interieur
                                    bewoonbare_opp_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Bewoonbare opp.")
                                    if bewoonbare_opp_element:
                                        bewoonbare_opp = bewoonbare_opp_element.find_next("p").text.strip()

                                    oppervlakte_slaapkamer_1_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte slaapkamer 1")
                                    if oppervlakte_slaapkamer_1_element:
                                        oppervlakte_slaapkamer_1 = oppervlakte_slaapkamer_1_element.find_next("p").text.strip()

                                    oppervlakte_slaapkamer_2_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte slaapkamer 2")
                                    if oppervlakte_slaapkamer_2_element:
                                        oppervlakte_slaapkamer_2 = oppervlakte_slaapkamer_2_element.find_next("p").text.strip()

                                    oppervlakte_slaapkamer_3_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte slaapkamer 3")
                                    if oppervlakte_slaapkamer_3_element:
                                        oppervlakte_slaapkamer_3 = oppervlakte_slaapkamer_3_element.find_next("p").text.strip()

                                    oppervlakte_slaapkamer_4_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte slaapkamer 4")
                                    if oppervlakte_slaapkamer_4_element:
                                        oppervlakte_slaapkamer_4 = oppervlakte_slaapkamer_4_element.find_next("p").text.strip()

                                    oppervlakte_slaapkamer_5_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte slaapkamer 5")
                                    if oppervlakte_slaapkamer_5_element:
                                        oppervlakte_slaapkamer_5 = oppervlakte_slaapkamer_5_element.find_next("p").text.strip()

                                    oppervlakte_slaapkamer_6_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte slaapkamer 6")
                                    if oppervlakte_slaapkamer_6_element:
                                        oppervlakte_slaapkamer_6 = oppervlakte_slaapkamer_6_element.find_next("p").text.strip()

                                    oppervlakte_woonruimte_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte woonruimte")
                                    if oppervlakte_woonruimte_element:
                                        oppervlakte_woonruimte = oppervlakte_woonruimte_element.find_next("p").text.strip()

                                    zolder_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Zolder")
                                    if zolder_element:
                                        zolder = zolder_element.find_next("p").text.strip()

                                    kelder_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Kelder")
                                    if kelder_element:
                                        kelder = kelder_element.find_next("p").text.strip()

                                    garage_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Garage")
                                    if garage_element:
                                        garage = garage_element.find_next("p").text.strip()

                                    aantal_garages_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal garages")
                                    if aantal_garages_element:
                                        aantal_garages = aantal_garages_element.find_next("p").text.strip()

                                    aantal_parkeerplaatsen_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal parkeerplaatsen")
                                    if aantal_parkeerplaatsen_element:
                                        aantal_parkeerplaatsen = aantal_parkeerplaatsen_element.find_next("p").text.strip()

                                    bemeubeld_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Bemeubeld")
                                    if bemeubeld_element:
                                        bemeubeld = bemeubeld_element.find_next("p").text.strip()

                                # Keuken en sanitair
                                    oppervlakte_keuken_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte keuken")
                                    if oppervlakte_keuken_element:
                                        oppervlakte_keuken = oppervlakte_keuken_element.find_next("p").text.strip()

                                    keukenuitrusting_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Keukenuitrusting")
                                    if keukenuitrusting_element:
                                        keukenuitrusting = keukenuitrusting_element.find_next("p").text.strip()

                                    aantal_toiletten_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal toiletten")
                                    if aantal_toiletten_element:
                                        aantal_toiletten = aantal_toiletten_element.find_next("p").text.strip()

                                    aantal_douchecabines_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal douchecabines")
                                    if aantal_douchecabines_element:
                                        aantal_douchecabines = aantal_douchecabines_element.find_next("p").text.strip()

                                    aantal_baden_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal baden")
                                    if aantal_baden_element:
                                        aantal_baden = aantal_baden_element.find_next("p").text.strip()

                                # Energie en milieu
                                    type_verwarming_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Type verwarming")
                                    if type_verwarming_element:
                                        type_verwarming = type_verwarming_element.find_next("p").text.strip()

                                    type_glas_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Type glas")
                                    if type_glas_element:
                                        type_glas = type_glas_element.find_next("p").text.strip()

                                # Uitrusting
                                    lift_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Lift")
                                    if lift_element:
                                        lift = lift_element.find_next("p").text.strip()

                                    toegang_mindervaliden_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Toegang mindervaliden")
                                    if toegang_mindervaliden_element:
                                        toegang_mindervaliden = toegang_mindervaliden_element.find_next("p").text.strip()

                                # Buitenruimte
                                    aantal_gevels_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal gevels")
                                    if aantal_gevels_element:
                                        aantal_gevels = aantal_gevels_element.find_next("p").text.strip()

                                    breedte_voorgevel_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Breedte voorgevel")
                                    if breedte_voorgevel_element:
                                        breedte_voorgevel = breedte_voorgevel_element.find_next("p").text.strip()

                                    aantal_verdiepingen_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aantal verdiepingen")
                                    if aantal_verdiepingen_element:
                                        aantal_verdiepingen = aantal_verdiepingen_element.find_next("p").text.strip()

                                    terras_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Terras")
                                    if terras_element:
                                        terras = terras_element.find_next("p").text.strip()

                                    oppervlakte_terras_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte terras")
                                    if oppervlakte_terras_element:
                                        oppervlakte_terras = oppervlakte_terras_element.find_next("p").text.strip()

                                    tuin_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Tuin")
                                    if tuin_element:
                                        tuin = tuin_element.find_next("p").text.strip()

                                    zwembad_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Zwembad")
                                    if zwembad_element:
                                        zwembad = zwembad_element.find_next("p").text.strip()

                                    oppervlakte_zwembad_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Oppervlakte zwembad")
                                    if oppervlakte_zwembad_element:
                                        oppervlakte_zwembad = oppervlakte_zwembad_element.find_next("p").text.strip()

                                    aansluiting_riolering_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aansluiting riolering")
                                    if aansluiting_riolering_element:
                                        aansluiting_riolering = aansluiting_riolering_element.find_next("p").text.strip()

                                    aansluiting_waterleiding_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aansluiting waterleiding")
                                    if aansluiting_waterleiding_element:
                                        aansluiting_waterleiding = aansluiting_waterleiding_element.find_next("p").text.strip()

                                    aansluiting_gasleiding_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Aansluiting gasleiding")
                                    if aansluiting_gasleiding_element:
                                        aansluiting_gasleiding = aansluiting_gasleiding_element.find_next("p").text.strip()


                                # Voorkomen dat we te snel requests sturen (tegen blokkades)
                                time.sleep(1)

                            except Exception as e:
                                print(f"Fout bij scrapen van detailpagina {detail_url}: {e}")

                        # Voeg propertie toe aan de database
                        house = ScrapeHouse(
                            # General
                            title=titel,
                            price=clean_price(prijs_tekst),
                            property_condition=staat_pand,
                            construction_year=bouwjaar,

                            # Location
                            country="België",
                            province="Vlaanderen",
                            city="Brussel",
                            postal_code="1000",
                            street=locatie,
                            street_number="1",
                            distance_to_center=afstand_centrum,
                            neighborhood_safety=buurtveiligheid,

                            # Interior
                            bedrooms=clean_rooms(slaapkamers),
                            bedroom_1_area=clean_area(oppervlakte_slaapkamer_1),
                            bedroom_2_area=clean_area(oppervlakte_slaapkamer_2),
                            bedroom_3_area=clean_area(oppervlakte_slaapkamer_3),
                            bedroom_4_area=clean_area(oppervlakte_slaapkamer_4),
                            bedroom_5_area=clean_area(oppervlakte_slaapkamer_5),
                            bedroom_6_area=clean_area(oppervlakte_slaapkamer_6),
                            area=clean_area(oppervlakte),
                            livable_area=clean_area(bewoonbare_opp),
                            living_room_area=clean_area(oppervlakte_woonruimte),
                            attic=zolder,
                            attic_area=clean_area(oppervlakte_zolder),
                            basement=kelder,
                            basement_area=clean_area(oppervlakte_kelder),
                            garage=garage,
                            garage_area=clean_area(oppervlakte_garage),  # Assuming this is the garage area
                            number_of_garages=clean_rooms(aantal_garages),
                            number_of_parking_spaces=clean_rooms(aantal_parkeerplaatsen),
                            furnished=bemeubeld,

                            # Kitchen and sanitary
                            kitchen_area=clean_area(oppervlakte_keuken),
                            kitchen_equipment=keukenuitrusting,
                            bathrooms=clean_rooms(badkamers),
                            number_of_shower_cabins=clean_rooms(aantal_douchecabines),
                            number_of_baths=clean_rooms(aantal_baden),
                            number_of_toilets=clean_rooms(aantal_toiletten),

                            # Energy and environment
                            epc=epc,
                            heating_type=type_verwarming,
                            glass_type=type_glas,
                            solar_panels=zonnepanelen,  
                            solar_panel_area=clean_area(oppervlakte_zonnepanelen),  

                            # Equipment
                            elevator=lift,
                            wheelchair_accessible=toegang_mindervaliden,

                            # Outdoor space
                            number_of_facades=clean_rooms(aantal_gevels),
                            facade_width=clean_area(breedte_voorgevel),
                            floor=verdieping,
                            number_of_floors=clean_rooms(aantal_verdiepingen),
                            terrace=terras,
                            terrace_area=clean_area(oppervlakte_terras),
                            plot_depth=clean_area(diepte_perceel),
                            terrace_front_width=clean_area(breedte_voorkant_terras),
                            sewer_connection=aansluiting_riolering,
                            water_connection=aansluiting_waterleiding,
                            gas_connection=aansluiting_gasleiding,
                            swimming_pool=zwembad,
                            swimming_pool_area=clean_area(oppervlakte_zwembad),  
                            garden=tuin,
                            garden_area=clean_area(oppervlakte_tuin),

                            # Source
                            source=source,
                        )
                        db.add(house)

                    except Exception as e:
                        print(f"Fout bij verwerken van propertie: {e}")
                        # db.rollback()  # Rol de transactie terug
                        continue
                    
                db.commit()
                print(f"✅ Data van pagina {current_page} succesvol opgeslagen in de database.")
            
            except Exception as e:
                print(f"❌ Fout bij scrapen van pagina {current_page}: {e}")
                continue
    
    