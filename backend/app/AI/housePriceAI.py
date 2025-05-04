import pandas as pd
import numpy as np
import requests
import pickle
import time
import re


from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from bs4 import BeautifulSoup


class HousePriceAI:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.features = ['oppervlakte', 'slaapkamers', 'badkamers', 'afstand_centrum', 
                         'buurtveiligheid', 'heeft_tuin', 'heeft_terras', 'heeft_zonnepanelen']
        self.gemiddelde_gewichten = {
            'prijs_per_m2': 3500,
            'ws': 10000,  # weging slaapkamer
            'wb': 7500,   # weging badkamer
            'wv': 5000,   # weging verdieping
            'wc': -1000,  # weging centrum afstand
            'wsch': 5000, # weging scholen
            'wbv': 2000,  # weging buurtveiligheid
            'wlq': 1000,  # weging luchtkwaliteit
            'wt': 100,    # weging tuin
            'wtb': 7000,  # weging terras/balkon
            'wz': 10000,  # weging zonnepanelen
            'wsh': 5000   # weging smart home
        }
    
    def schoon_prijs(self, prijs_tekst):
        """Zet een prijstekst om naar een integer, inclusief gemiddelde bij prijsschaling."""
        if isinstance(prijs_tekst, str):
            # Verwijder smalle spaties, gewone spaties en andere niet-numerieke tekens behalve cijfers en '-'
            prijs_tekst = re.sub(r'[\s\u202f\u00a0]', '', prijs_tekst)  

            # Zoek naar alle getallen in de tekst
            prijzen = list(map(int, re.findall(r'\d+', prijs_tekst)))

            if not prijzen:
                return 0  # Geen prijs gevonden
            
            if len(prijzen) == 1:
                return prijzen[0]  # Enkelvoudige prijs
            
            # Neem het gemiddelde als er een bereik is
            return sum(prijzen) // len(prijzen)  

        return 0  # Ongeldige invoer
        
    def schoon_oppervlakte(self, oppervlakte_tekst):
        """Zet een oppervlakte tekst om naar een float."""
        if isinstance(oppervlakte_tekst, str):
            # Vind het getal in de tekst
            match = re.search(r'(\d+(?:[\.,]\d+)?)', oppervlakte_tekst)
            if match:
                return float(match.group(1).replace(',', '.'))
        return 80.0  # Gemiddelde waarde als standaard
        
    def schoon_kamers(self, kamers_tekst):
        """Zet een kamertekst om naar een integer."""
        if isinstance(kamers_tekst, str):
            # Vind het getal in de tekst
            match = re.search(r'(\d+)', kamers_tekst)
            if match:
                return int(match.group(1))
        return 2  # Gemiddelde waarde als standaard

    def scrap_woningen(self, base_url="https://immovlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&noindex=1&page", start_page=1, max_pages=1):
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
                            print(f"Bevestigd: we zijn op pagina {active_link.text.strip()}")
                
                woningen = soup.find_all("article", class_="list-view-item")
                
                if not woningen:
                    print(f"Geen woningen gevonden op pagina {current_page} met class 'list-view-item'")
                    # Probeer alternatieve klassen te vinden
                    alternative_classes = ["grid-view-item", "property-item", "result-item"]
                    for alt_class in alternative_classes:
                        woningen = soup.find_all("article", class_=alt_class)
                        if woningen:
                            print(f"Woningen gevonden met alternatieve class '{alt_class}'")
                            break
                
                if not woningen:
                    print(f"Geen woningen gevonden op pagina {current_page}. Proberen door te gaan naar volgende pagina.")
                    continue  # Probeer door te gaan naar de volgende pagina in plaats van te stoppen
                    
                print(f"Gevonden: {len(woningen)} woningen op pagina {current_page}")
                
                for woning in woningen:
                    try:
                        titel = woning.find("h2").text.strip()
                        prijs_tekst = woning.find("strong", class_="list-item-price").text.strip()
                        locatie = woning.find("p", class_="mb-1").text.strip()
                        
                        # Vind alle property-highlight spans
                        property_spans = woning.find_all("span", class_="property-highlight")
                        
                        # Standaardwaardes instellen
                        slaapkamers = "Onbekend"
                        oppervlakte = "Onbekend"
                        badkamers = "Onbekend"
                        
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
                        afstand_centrum = self.schat_afstand_centrum(locatie)
                        buurtveiligheid = self.schat_buurtveiligheid(locatie)
                        
                        # Voeg optioneel de URL van de woning details toe
                        detail_article = woning.find("div", class_="media-pic")
                        detail_link = detail_article.find("a") if detail_article else None
                        detail_url = ""
                        if detail_link and "href" in detail_link.attrs:
                            detail_url = detail_link["href"]
                            if not detail_url.startswith("http"):
                                detail_url = f"https://immovlan.be{detail_url}"

                        # 🏠 Extra details ophalen van de detailpagina
                        bouwjaar, bewoonbareOpp, kelder = "Onbekend", "Onbekend", "Onbekend"

                        if detail_url:
                            try:
                                response = requests.get(detail_url, headers={"User-Agent": "Mozilla/5.0"})
                                if response.status_code == 200:
                                    soup_detail = BeautifulSoup(response.text, 'html.parser')

                                    bouwjaar_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Bouwjaar")
                                    if bouwjaar_element:
                                        bouwjaar = bouwjaar_element.find_next("p").text.strip()

                                    bewoonbare_opp_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Bewoonbare opp.")
                                    if bewoonbare_opp_element:
                                        bewoonbareOpp = bewoonbare_opp_element.find_next("p").text.strip()
                                    
                                    kelder_element = soup_detail.find("div", class_="data-row-wrapper").find("h4", string="Kelder")
                                    if kelder_element:
                                        kelder = kelder_element.find_next("p").text.strip()

                                # Voorkomen dat we te snel requests sturen (tegen blokkades)
                                time.sleep(1)

                            except Exception as e:
                                print(f"Fout bij scrapen van detailpagina {detail_url}: {e}")
                        
                        all_data.append({
                            'titel': titel,
                            'prijs': self.schoon_prijs(prijs_tekst),
                            'locatie': locatie,
                            'slaapkamers': self.schoon_kamers(slaapkamers),
                            'oppervlakte': self.schoon_oppervlakte(oppervlakte),
                            'badkamers': self.schoon_kamers(badkamers),
                            'heeft_tuin': heeft_tuin,
                            'heeft_terras': heeft_terras,
                            'heeft_zonnepanelen': heeft_zonnepanelen,
                            'afstand_centrum': afstand_centrum,
                            'buurtveiligheid': buurtveiligheid,
                            'bouwjaar': bouwjaar,
                            'bewoonbareOpp': bewoonbareOpp,
                            'kelder': kelder,
                        })
                    except Exception as e:
                        print(f"Fout bij verwerken van woning: {e}")
                        continue
                    
            except Exception as e:
                print(f"❌ Fout bij scrapen van pagina {current_page}: {e}")
                import traceback
                traceback.print_exc()
                continue  # Probeer door te gaan met de volgende pagina
        
        # Alle verzamelde data opslaan en teruggeven
        if all_data:
            df = pd.DataFrame(all_data)
            df.to_csv("app/AI/Models/houseList/woningprijzen.csv", index=False)
            print(f"✅ {len(all_data)} woningen opgeslagen in woningprijzen.csv")
            return df
        else:
            print("❌ Geen woningdata gevonden")
            return None
    
    def scrap_woningdetails(self, df):
        """
        Scrape aanvullende details van individuele woningpagina's.
        
        Args:
            df (pd.DataFrame): DataFrame met woninggegevens inclusief detail_url
            
        Returns:
            pd.DataFrame: Uitgebreide DataFrame met extra details
        """
        if 'detail_url' not in df.columns or df.empty:
            print("Geen detail URLs gevonden om te scrapen")
            return df
            
        headers = {"User-Agent": "Mozilla/5.0"}
        
        for index, row in df.iterrows():
            if not row['detail_url']:
                continue
                
            try:
                print(f"Scraping details van: {row['titel']}")
                # Wacht tussen verzoeken
                time.sleep(3)
                
                response = requests.get(row['detail_url'], headers=headers)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, "html.parser")
                
                # Zoek naar extra details op de pagina
                # Bijvoorbeeld: EPC-waarde, bouwjaar, staat van het pand, etc.
                
                # Voorbeeld: EPC-waarde zoeken
                epc_value = "Onbekend"
                epc_element = soup.find("div", string=lambda text: text and "EPC" in text)
                if epc_element:
                    epc_value_elem = epc_element.find_next("div")
                    if epc_value_elem:
                        epc_value = epc_value_elem.text.strip()
                
                # Voorbeeld: Bouwjaar zoeken
                bouwjaar = "Onbekend"
                bouwjaar_element = soup.find("div", string=lambda text: text and "Bouwjaar" in text)
                if bouwjaar_element:
                    bouwjaar_value_elem = bouwjaar_element.find_next("div")
                    if bouwjaar_value_elem:
                        bouwjaar = bouwjaar_value_elem.text.strip()
                
                # Extra informatie toevoegen aan het DataFrame
                df.at[index, 'epc'] = epc_value
                df.at[index, 'bouwjaar'] = bouwjaar
                
            except Exception as e:
                print(f"Fout bij scrapen van details voor {row['titel']}: {e}")
        
        # Bijgewerkte DataFrame opslaan
        df.to_csv("woningprijzen_met_details.csv", index=False)
        print(f"✅ Details toegevoegd en opgeslagen in woningprijzen_met_details.csv")
    
    def schat_afstand_centrum(self, locatie):
        """Schat de afstand tot het centrum van Gent."""
        # Simpele heuristiek - in de praktijk zou je geocoding gebruiken
        if isinstance(locatie, str):
            if "Gent" not in locatie:
                return 5.0  # Buiten Gent
            elif "centrum" in locatie.lower():
                return 0.5  # Centrum
            else:
                return 2.5  # Ergens in Gent
        return 3.0  # Standaardwaarde
    
    def schat_buurtveiligheid(self, locatie):
        """Schat de buurtveiligheid (score op 10)."""
        # Simpele heuristiek - in de praktijk zou je echte data gebruiken
        if isinstance(locatie, str):
            locatie_lower = locatie.lower()
            # Voorbeelden (dit zou vervangen worden door echte data)
            if "centrum" in locatie_lower:
                return 7
            elif "gentbrugge" in locatie_lower:
                return 8
            elif "sint-amandsberg" in locatie_lower:
                return 7
            elif "zwijnaarde" in locatie_lower:
                return 9
            elif "ledeberg" in locatie_lower:
                return 6
        return 7  # Standaardwaarde

    def train_model(self, df=None, model_path="app/AI/Models/prijs_model.pkl"):
        """Train een RandomForest model op basis van woningdata."""
        if df is None:
            # Probeer eerst lokaal bestand te laden
            try:
                df = pd.read_csv("app/AI/Models/houseList/woningprijzen.csv")
            except FileNotFoundError:
                # Anders scrape nieuwe data
                df = self.scrap_woningen()
                
            if df is None or df.empty:
                print("❌ Geen data beschikbaar voor training")
                return False
        
        # Filter ongeldige data
        df = df.dropna(subset=['prijs', 'oppervlakte'])
        df = df[df['prijs'] > 0]
        
        # Controleer of er voldoende data is
        if len(df) < 10:
            print(f"❌ Onvoldoende data voor training: {len(df)} rijen")
            # Vul aan met synthetische data
            df = self.add_synthetic_data(df)
        
        print(f"Training model op {len(df)} woningen...")
        
        # Features en target voorbereiden
        X = df[self.features].fillna(0)
        y = df['prijs']
        
        # Normaliseer features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evalueer model
        score = self.model.score(X_test, y_test)
        print(f"Model R² score: {score:.4f}")
        
        # Sla model op
        with open(model_path, 'wb') as f:
            pickle.dump((self.model, self.scaler, self.features), f)
        print(f"✅ Model opgeslagen in {model_path}")
        
        return True
    
    def add_synthetic_data(self, df, aantal=500):
        """Vul de dataset aan met synthetische data voor training."""
        print("Aanvullen met synthetische data...")
        
        synth_data = {
            'titel': ['Synthethisch huis'] * aantal,
            'locatie': ['Gent'] * aantal,
            'oppervlakte': np.random.normal(120, 40, aantal).clip(30, 300),
            'slaapkamers': np.random.randint(1, 6, aantal),
            'badkamers': np.random.randint(1, 4, aantal),
            'afstand_centrum': np.random.normal(3, 2, aantal).clip(0.5, 15),
            'buurtveiligheid': np.random.normal(7, 1, aantal).clip(3, 10),
            'heeft_tuin': np.random.randint(0, 2, aantal),
            'heeft_terras': np.random.randint(0, 2, aantal),
            'heeft_zonnepanelen': np.random.randint(0, 2, aantal)
        }
        
        # Bereken synthetische prijzen met de formule
        prijzen = []
        for i in range(aantal):
            # Bouwfactoren
            BF = (synth_data['oppervlakte'][i] * self.gemiddelde_gewichten['prijs_per_m2']) + \
                 (synth_data['slaapkamers'][i] * self.gemiddelde_gewichten['ws']) + \
                 (synth_data['badkamers'][i] * self.gemiddelde_gewichten['wb']) + \
                 (np.random.randint(1, 3) * self.gemiddelde_gewichten['wv'])
            
            # Locatiefactoren
            LF = (synth_data['afstand_centrum'][i] * self.gemiddelde_gewichten['wc']) + \
                 (np.random.randint(0, 2) * self.gemiddelde_gewichten['wsch']) + \
                 (synth_data['buurtveiligheid'][i] * self.gemiddelde_gewichten['wbv']) + \
                 (np.random.randint(5, 10) * self.gemiddelde_gewichten['wlq'])
            
            # Voorzieningen
            VF = (np.random.randint(0, 150) * self.gemiddelde_gewichten['wt'] * synth_data['heeft_tuin'][i]) + \
                 (synth_data['heeft_terras'][i] * self.gemiddelde_gewichten['wtb']) + \
                 (synth_data['heeft_zonnepanelen'][i] * self.gemiddelde_gewichten['wz']) + \
                 (np.random.randint(0, 2) * self.gemiddelde_gewichten['wsh'])
            
            # Marktcorrecties
            basis_prijs = BF + LF + VF
            MC = (np.random.normal(1.05, 0.1) * 5000) + \
                 (0.03 * basis_prijs) + \
                 (0.02 * basis_prijs)
            
            # Kosten en aftrekken
            KA = np.random.normal(15000, 10000) + np.random.normal(3000, 2000) + np.random.normal(5000, 3000)
            
            # Totale prijs
            prijs = (BF + LF + VF + MC) - KA
            # Voeg wat ruis toe
            prijs *= np.random.normal(1, 0.1)
            
            prijzen.append(max(100000, int(prijs)))
        
        synth_data['prijs'] = prijzen
        synth_df = pd.DataFrame(synth_data)
        
        # Combineer met originele data
        return pd.concat([df, synth_df], ignore_index=True)
    
    def load_model(self, model_path="app/AI/Models/houseList/woningprijs_model.pkl"):
        """Laad een bestaand model."""
        try:
            with open(model_path, 'rb') as f:
                self.model, self.scaler, self.features = pickle.load(f)
            print(f"✅ Model geladen uit {model_path}")
            return True
        except FileNotFoundError:
            print(f"❌ Model niet gevonden: {model_path}")
            return False
        except Exception as e:
            print(f"❌ Fout bij laden model: {e}")
            return False
        
    def ai_price(self, data):

        """Bereken woningprijs met AI model."""
        if self.model is None:
            model_geladen = self.load_model()
            if not model_geladen:
                model_getraind = self.train_model()
                if not model_getraind:
                    return None
        
        # Zorg ervoor dat alle benodigde features aanwezig zijn
        for feature in self.features:
            if feature not in data:
                # Gebruik standaardwaarde als feature ontbreekt
                if feature == 'oppervlakte':
                    data[feature] = 80.0
                elif feature in ['slaapkamers']:
                    data[feature] = 2
                elif feature in ['badkamers']:
                    data[feature] = 1
                elif feature == 'afstand_centrum':
                    data[feature] = 3.0
                elif feature == 'buurtveiligheid':
                    data[feature] = 7
                elif feature.startswith('heeft_'):
                    data[feature] = 0
        
        # Maak een DataFrame van de input data
        input_df = pd.DataFrame([data])
        
        # Selecteer alleen de features die het model gebruikt
        input_features = input_df[self.features].fillna(0)
        
        # Normaliseer de features
        input_scaled = self.scaler.transform(input_features)
        
        # Voorspel de prijs
        voorspelde_prijs = self.model.predict(input_scaled)[0]
        
        return round(voorspelde_prijs, 2)
    
    def analyse_spesifics(self, df=None):
        """Analyseer welke eigenschappen de meeste invloed hebben op de prijs."""
        if df is None:
            try:
                df = pd.read_csv("app/AI/Models/houseList/woningprijzen.csv")
            except FileNotFoundError:
                df = self.scrap_woningen()
                
            if df is None or df.empty:
                print("❌ Geen data beschikbaar voor analyse")
                return None
        
        if self.model is None:
            model_geladen = self.load_model()
            if not model_geladen:
                model_getraind = self.train_model(df)
                if not model_getraind:
                    return None
        
        # Gebruik model feature importance
        feature_importance = pd.DataFrame({
            'feature': self.features,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        # Bereken correlatie met prijs
        numerieke_kolommen = [col for col in df.columns if col != 'prijs' and df[col].dtype in ['int64', 'float64']]
        correlaties = df[numerieke_kolommen + ['prijs']].corr()['prijs'].drop('prijs').sort_values(ascending=False)
        
        # Vervang NaN-waarden door 0
        correlaties = correlaties.fillna(0)

        return {
            'feature_importance': feature_importance,
            'correlaties': correlaties
        }