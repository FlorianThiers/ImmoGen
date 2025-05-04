import pandas as pd
import numpy as np

def add_synthetic_data(self, df, aantal=500):
    """Vul de dataset aan met synthetische data voor training."""
    print("Aanvullen met synthetische data...")

    gemiddelde_gewichten = {
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
        BF = (synth_data['oppervlakte'][i] * gemiddelde_gewichten['prijs_per_m2']) + \
                (synth_data['slaapkamers'][i] * gemiddelde_gewichten['ws']) + \
                (synth_data['badkamers'][i] * gemiddelde_gewichten['wb']) + \
                (np.random.randint(1, 3) * gemiddelde_gewichten['wv'])
        
        # Locatiefactoren
        LF = (synth_data['afstand_centrum'][i] * gemiddelde_gewichten['wc']) + \
                (np.random.randint(0, 2) * gemiddelde_gewichten['wsch']) + \
                (synth_data['buurtveiligheid'][i] * gemiddelde_gewichten['wbv']) + \
                (np.random.randint(5, 10) * gemiddelde_gewichten['wlq'])
        
        # Voorzieningen
        VF = (np.random.randint(0, 150) * gemiddelde_gewichten['wt'] * synth_data['heeft_tuin'][i]) + \
                (synth_data['heeft_terras'][i] * gemiddelde_gewichten['wtb']) + \
                (synth_data['heeft_zonnepanelen'][i] * gemiddelde_gewichten['wz']) + \
                (np.random.randint(0, 2) * gemiddelde_gewichten['wsh'])
        
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
