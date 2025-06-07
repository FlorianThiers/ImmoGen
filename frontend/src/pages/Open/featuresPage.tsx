import React from 'react';
import { Brain, Smartphone, Globe, TrendingUp, BarChart3, History, Monitor } from 'lucide-react';
import Navbar from '../../components/Navbar';

import "./featuresPage.css"

type FeatureCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  example?: string;
  imagePosition?: 'left' | 'right';
  index: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, example, imagePosition = 'left', index }) => (
  <div className={`feature-card ${imagePosition === 'right' ? 'reverse' : ''}`}>
    <div className="feature-content">
      <div className="feature-icon">
        <Icon size={48} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      {/* {example && (
        <div className="feature-example">
          <h4>Voorbeeld:</h4>
          <p>{example}</p>
        </div>
      )} */}
    </div>
    <div className="feature-visual">
      <div className="visual-placeholder">
        <Icon size={80} className="visual-icon" />
        <div className="visual-overlay">
          <span>Feature {index + 1}</span>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-gestuurde waardeschatting',
      description: 'Onze geavanceerde AI-algoritmes analyseren ettelijke datapunten om de meest nauwkeurige waardeschatting van uw eigendom te bieden. Machine Learning modellen worden continu getraind op de nieuwste marktgegevens.',
      example: 'Een woning in Gent wordt geanalyseerd op basis van 50+ factoren zoals ligging, oppervlakte, bouwjaar, energielabel en recente verkopen in de buurt voor een schatting binnen 5% van de werkelijke marktwaarde.'
    },
    {
      icon: Smartphone,
      title: 'Gebruiksvriendelijke interface',
      description: 'Intuïtieve en moderne interface ontworpen voor zowel beginners als ervaren gebruikers. Eenvoudige navigatie en duidelijke visualisaties maken het gebruik van ImmoGen een plezier.',
      example: 'Voer de gevraagde gegevens in en ontvang binnen 30 seconden een gedetailleerde waardeschatting met visuele grafieken en uitleg.'
    },
    {
      icon: Globe,
      title: 'Scraping van Vastgoed',
      description: 'Real-time data verzameling van de grootste vastgoedplatforms in België. Onze scraping technologie zorgt voor actuele marktinformatie en vergelijkbare eigendommen.',
      example: 'Dagelijks worden nieuwe advertenties gescand om de meest recente prijstrends en vergelijkbare woningen in uw gebied te identificeren.'
    },
    {
      icon: TrendingUp,
      title: 'Interne schatter met ML-model',
      description: 'Eigen ontwikkeld machine learning model getraind op historische vastgoeddata uit heel België. Het model leert continu bij en verbetert de nauwkeurigheid van schattingen.',
      example: 'Ons model heeft geleerd dat woningen nabij scholen in Antwerpen gemiddeld 12% meer waard zijn, en past dit automatisch toe in de waardering.'
    },
    {
      icon: BarChart3,
      title: 'Marktvergelijking met real-time data',
      description: 'Vergelijk uw eigendom met soortgelijke woningen die recent verkocht zijn of momenteel te koop staan. Real-time marktanalyse toont trends en prijsontwikkelingen.',
      example: 'Zie hoe uw woning presteert ten opzichte van 15 vergelijkbare eigendommen in een straal van 2km, inclusief gemiddelde verkooptijd en prijsevolutie.'
    },
    {
      icon: History,
      title: 'Historiek & logging van waardes',
      description: 'Volledige geschiedenis van alle uitgevoerde schattingen en waarderontwikkelingen. Bekijk hoe de waarde van uw eigendom evolueert over tijd.',
      example: 'Bekijk hoe de waarde van uw woning is gestegen van €250.000 in januari naar €265.000 in juni, met gedetailleerde uitleg van de factoren die deze stijging veroorzaakten.'
    },
    {
      icon: Monitor,
      title: 'Makkelijk te gebruiken op mobiel en desktop',
      description: 'Volledig responsief ontwerp dat perfect werkt op alle apparaten. Dezelfde krachtige functionaliteiten beschikbaar op smartphone, tablet en desktop.',
      example: 'Maak onderweg een snelle schatting op uw tablet of smartphone tijdens een bezichtiging, of analyseer uitgebreid op uw desktop thuis met alle grafieken en details.'
    }
  ];

  return (
    <div className="landingpage">
      <Navbar />
      
      <section className="hero-features">
        <div className="container">
          <h1>Waarom kiezen voor <span className="highlight">ImmoGen</span>?</h1>
          <p className="hero-subtitle">
            Ontdek de krachtige features die ImmoGen de meest betrouwbare vastgoedschatter van België maken
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              example={feature.example}
              imagePosition={index % 2 === 0 ? 'left' : 'right'}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Klaar om te beginnen?</h2>
            {/* <p>Probeer ImmoGen vandaag nog gratis en ontdek wat uw eigendom werkelijk waard is.</p> */}
            <div className="cta-buttons">
              <button className="btn-primary">Gratis Proberen</button>
              {/* <button className="btn-secondary">Meer Info</button> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;