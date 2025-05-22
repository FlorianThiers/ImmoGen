import time
import requests
import pandas as pd
from bs4 import BeautifulSoup
from sqlalchemy import Null
from sqlalchemy.orm import Session

from app.models.house import ScrapeHouse

from app.AI.Models.data_cleaning_ai import clean_price, clean_area, clean_rooms, clean_title, clean_none, clean_surface_area_m2, clean_street_name, clean_city, clean_house_number, clean_postal_code, clean_boolean
from app.AI.Models.predict_element_ai import estimate_distance_to_center, estimate_neighborhood_safety
from app.AI.Models.immoVlanDetailScraper import scrape_property_details
from app.AI.Models.geoLocation import geocode_address



def scrap_houses(db: Session, max_pages, base_url="https://immovlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&noindex=1&page", start_page=1):
        """
        Scrap woningdata van Immovlan over meerdere pagina's.
        
        Args:
            base_url (str): Basis URL zonder paginanummer
            start_page (int): Pagina om mee te beginnen
            max_pages (int): Maximum aantal pagina's om te scrapen
            
        Returns:
            pd.DataFrame: DataFrame met woninggegevens
        """
        print(f"Bezig met scrapen van Immovlan, pagina's {start_page} t/m {start_page + max_pages - 1}...")
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
        all_data = []
        
        # Zorg ervoor dat de base_url eindigt met '='
        if not base_url.endswith('='):
            base_url += '='
        
        for current_page in range(start_page, start_page + max_pages):
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
                            # print(f"Bevestigd: we zijn op pagina {active_link.text.strip()}")
                
                woningen = soup.find_all("article", class_="list-view-item")
                
                if not woningen:
                    # print(f"Geen woningen gevonden op pagina {current_page} met class 'list-view-item'")
                    # Probeer alternatieve klassen te vinden
                    alternative_classes = ["grid-view-item", "property-item", "result-item"]
                    for alt_class in alternative_classes:
                        woningen = soup.find_all("article", class_=alt_class)
                        if woningen:
                            print(f"Woningen gevonden met alternatieve class '{alt_class}'")
                            break
                
                if not woningen:
                    # print(f"Geen woningen gevonden op pagina {current_page}. Proberen door te gaan naar volgende pagina.")
                    continue  # Probeer door te gaan naar de volgende pagina in plaats van te stoppen
                    
                # print(f"Gevonden: {len(woningen)} woningen op pagina {current_page}")
                
                for woning in woningen:
                    try:
                        # Vind alle property-highlight spans
                        property_spans = woning.find_all("span", class_="property-highlight")
                        
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
                        veranda = False
                        oppervlakte_veranda = 0
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
                        
                        # for span in property_spans:
                        #     span_text = span.text.strip()
                        #     if "Slaapkamer" in span_text:
                        #         slaapkamers = span_text
                        #     elif "m²" in span_text:
                        #         oppervlakte = span_text
                        #     elif "Badkamer" in span_text:
                        #         badkamers = span_text
                        #     elif "terras" in span_text:
                        #         terras = True
                        #         oppervlakte_terras = span_text
                            
                        
                        # Voeg optioneel de URL van de woning details toe
                        detail_article = woning.find("div", class_="media-pic")
                        detail_link = detail_article.find("a") if detail_article else None
                        detail_url = ""
                        if detail_link and "href" in detail_link.attrs:
                            detail_url = detail_link["href"]
                            if not detail_url.startswith("http"):
                                detail_url = f"https://immovlan.be{detail_url}"

                        if detail_url:
                            try:
                                property_details = scrape_property_details(detail_url, headers=headers)
                                
                                # header
                                titel = property_details["header"]["title"]
                                straat_nr = property_details["header"]["straat_nr"]
                                dorp_postcode = property_details["header"]["dorp_postcode"]
                                
                                full_address = f"{straat_nr}, {dorp_postcode}, België"
                                geo = geocode_address(full_address)
                                if geo:
                                    latitude = geo["lat"]
                                    longitude = geo["lon"]
                                else:
                                    latitude = None
                                    longitude = None

                                prijs_tekst = property_details["header"]["prijs"]
                                staat_pand = property_details["basisinfo"]["staat_pand"]
                                bouwjaar = property_details["basisinfo"]["bouwjaar"]
                                # afstand_centrum = self.schat_afstand_centrum(locatie)
                                # buurtveiligheid = self.schat_buurtveiligheid(locatie)

                                # Interieur values
                                bewoonbare_opp = property_details["interieur"]["bewoonbare_opp"]
                                slaapkamers = property_details["interieur"]["slaapkamers"]
                                oppervlakte_slaapkamer_1 = property_details["interieur"]["oppervlakte_slaapkamer_1"]
                                oppervlakte_slaapkamer_2 = property_details["interieur"]["oppervlakte_slaapkamer_2"]
                                oppervlakte_slaapkamer_3 = property_details["interieur"]["oppervlakte_slaapkamer_3"]
                                oppervlakte_slaapkamer_4 = property_details["interieur"]["oppervlakte_slaapkamer_4"]
                                oppervlakte_slaapkamer_5 = property_details["interieur"]["oppervlakte_slaapkamer_5"]
                                oppervlakte_slaapkamer_6 = property_details["interieur"]["oppervlakte_slaapkamer_6"]
                                oppervlakte_woonruimte = property_details["interieur"]["oppervlakte_woonruimte"]
                                veranda = property_details["interieur"]["veranda"]
                                oppervlakte_veranda = property_details["interieur"]["oppervlakte_veranda"]
                                zolder = property_details["interieur"]["zolder"]
                                oppervlakte_zolder = property_details["interieur"]["oppervlakte_zolder"]
                                kelder = property_details["interieur"]["kelder"]
                                oppervlakte_kelder = property_details["interieur"]["oppervlakte_kelder"]
                                garage = property_details["interieur"]["garage"]
                                oppervlakte_garage = property_details["interieur"]["oppervlakte_garage"]
                                aantal_garages = property_details["interieur"]["aantal_garages"]
                                aantal_parkeerplaatsen = property_details["interieur"]["aantal_parkeerplaatsen"]
                                bemeubeld = property_details["interieur"]["bemeubeld"]

                                # # Keuken en sanitair
                                oppervlakte_keuken = property_details["keuken_sanitair"]["oppervlakte_keuken"]
                                keukenuitrusting = property_details["keuken_sanitair"]["keukenuitrusting"]
                                aantal_toiletten = property_details["keuken_sanitair"]["aantal_toiletten"]
                                aantal_douchecabines = property_details["keuken_sanitair"]["aantal_douchecabines"]
                                aantal_baden = property_details["keuken_sanitair"]["aantal_baden"]

                                # # Energie en milieu
                                epc = property_details["energie_milieu"]["epc"]
                                type_verwarming = property_details["energie_milieu"]["type_verwarming"]
                                type_glas = property_details["energie_milieu"]["type_glas"]
                                zonnepanelen = property_details["energie_milieu"]["zonnepaneler"]
                                oppervlakte_zonnepanelen = property_details["energie_milieu"]["oppervlakte_zonnepanelen"]

                                # # Uitrusting
                                lift = property_details["uitrusting"]["lift"]
                                toegang_mindervaliden = property_details["uitrusting"]["toegang_mindervaliden"]

                                # # buitenruimte
                                aantal_gevels = property_details["buitenruimte"]["aantal_gevels"]
                                breedte_voorgevel = property_details["buitenruimte"]["breedte_voorgevel"]
                                verdieping = property_details["buitenruimte"]["verdieping"]
                                aantal_verdiepingen = property_details["buitenruimte"]["aantal_verdiepingen"]
                                terras = property_details["buitenruimte"]["terras"]
                                oppervlakte_terras = property_details["buitenruimte"]["oppervlakte_terras"]
                                oppervlakte = property_details["buitenruimte"]["totale_opp"]
                                aansluiting_riolering = property_details["buitenruimte"]["aansluiting_riolering"]
                                aansluiting_waterleiding = property_details["buitenruimte"]["aansluiting_waterleiding"]
                                aansluiting_gasleiding = property_details["buitenruimte"]["aansluiting_gasleiding"]
                                zwembad = property_details["buitenruimte"]["zwembad"]
                                oppervlakte_zwembad = property_details["buitenruimte"]["oppervlakte_zwembad"]
                                tuin = property_details["buitenruimte"]["tuin"]
                                oppervlakte_tuin = property_details["buitenruimte"]["oppervlakte_tuin"]
                                # Voorkomen dat we te snel requests sturen (tegen blokkades)
                                time.sleep(1)

                            except Exception as e:
                                print(f"Fout bij scrapen van detailpagina {detail_url}: {e}")

                        # Voeg propertie toe aan de database
                        house = ScrapeHouse(
                            # General
                            title=clean_title(titel),
                            price=clean_price(prijs_tekst),
                            property_condition=clean_none(staat_pand),
                            construction_year=clean_none(bouwjaar),

                            # Location
                            country="België",
                            province="Vlaanderen",
                            city=clean_city(dorp_postcode),
                            postal_code=clean_postal_code(dorp_postcode),
                            street=clean_street_name(straat_nr),
                            street_number=clean_house_number(straat_nr),
                            latitude=latitude,
                            longitude=longitude,
                            distance_to_center=7,
                            neighborhood_safety=7,

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
                            veranda=clean_boolean(veranda),
                            veranda_area=clean_area(oppervlakte_veranda),
                            attic=clean_boolean(zolder),
                            attic_area=clean_area(oppervlakte_zolder),
                            basement=clean_boolean(kelder),
                            basement_area=clean_area(oppervlakte_kelder),
                            garage=clean_boolean(garage),
                            garage_area=clean_area(oppervlakte_garage),
                            number_of_garages=clean_rooms(aantal_garages),
                            number_of_parking_spaces=clean_rooms(aantal_parkeerplaatsen),
                            furnished=clean_boolean(bemeubeld),

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
                            solar_panels=clean_boolean(zonnepanelen),  
                            solar_panel_area=clean_area(oppervlakte_zonnepanelen),  

                            # Equipment
                            elevator=clean_boolean(lift),
                            wheelchair_accessible=clean_boolean(toegang_mindervaliden),

                            # Outdoor space
                            number_of_facades=clean_none(aantal_gevels),
                            facade_width=clean_area(breedte_voorgevel),
                            floor=verdieping,
                            number_of_floors=clean_rooms(aantal_verdiepingen),
                            terrace=clean_boolean(terras),
                            terrace_area=clean_area(oppervlakte_terras),
                            plot_depth=clean_area(diepte_perceel),
                            terrace_front_width=clean_area(breedte_voorkant_terras),
                            sewer_connection=clean_boolean(aansluiting_riolering),
                            water_connection=clean_boolean(aansluiting_waterleiding),
                            gas_connection=clean_boolean(aansluiting_gasleiding),
                            swimming_pool=clean_boolean(zwembad),
                            swimming_pool_area=clean_area(oppervlakte_zwembad),  
                            garden=clean_boolean(tuin),
                            garden_area=clean_area(oppervlakte_tuin),

                            # Source
                            source="ImmoVlan",
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
    
    