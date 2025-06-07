import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import './landingPage.css'; // Assuming you have a CSS file for styles

const LandingPage = () => {
  useEffect(() => {
    // Add smooth scrolling
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.getAttribute('href')!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Add parallax effect and header background
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.ai-figure') as HTMLElement;
      const speed = scrolled * 0.2;
      
      if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
      }

      // Header background effect
      const header = document.querySelector('header') as HTMLElement;
      if (header) {
        if (scrolled > 50) {
          header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
          header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLabelHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    const label = e.currentTarget;
    if (isEntering) {
      label.style.transform = 'scale(1.1)';
      label.style.background = 'rgba(255, 107, 53, 0.9)';
      label.style.color = 'white';
    } else {
      label.style.transform = 'scale(1)';
      label.style.background = 'rgba(255, 255, 255, 0.9)';
      label.style.color = '#333';
    }
  };

  return (
    <div className='landingpage'>
      <Navbar />

      <section className="hero">
        <div className="container">
         <h1>
            <span className="highlight">ImmoGen</span> <br />
            Jouw slimme partner voor woningschattingen
          </h1>
          <p>
            ImmoGen is hét AI-platform om snel, eenvoudig en betrouwbaar de waarde van je huis te schatten.<br />
            Ontdek marktinzichten, vergelijk woningen en krijg direct een nauwkeurige prijsindicatie.
          </p>

            {localStorage.getItem('token') ? (
            <a href="/dashboard" className="btn-primary">Start met schatten</a>
            ) : (
            <a href="/login" className="btn-primary">Log in en probeer het nu</a>
            )}

          <div className="hero-image">
            <div className="ai-figure">
              <div className="ai-head">
                <div className="ai-face">
                  <div className="ai-eye left"></div>
                  <div className="ai-eye right"></div>
                </div>
              </div>
              
              {/* Tech Elements */}
              <div className="tech-elements">
                <div className="tech-circle large"></div>
                <div className="tech-circle medium"></div>
                <div className="tech-circle small"></div>
              </div>

              {/* Feature Labels */}
              <div 
                className="feature-label label-crm"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                Snel & Betrouwbaar
              </div>
              <div 
                className="feature-label label-wms"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                AI-gestuurd
              </div>
              <div 
                className="feature-label label-project"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                Marktinzichten
              </div>
              <div 
                className="feature-label label-hris"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                Vergelijk woningen
              </div>
              <div 
                className="feature-label label-workflow"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                Direct resultaat
              </div>
              <div 
                className="feature-label label-custom"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                Gebruiksvriendelijk
              </div>
              <div 
                className="feature-label label-procurement"
                onMouseEnter={(e) => handleLabelHover(e, true)}
                onMouseLeave={(e) => handleLabelHover(e, false)}
              >
                Gratis te proberen
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="companies">
        <div className="container">
          <div className="company-logos">
            <div className="company-logo">ImmoWeb</div>
            <div className="company-logo">Zimmo</div>
            <div className="company-logo">Vastgoed</div>
            <div className="company-logo">AI Vlaanderen</div>
            <div className="company-logo">Bouwunie</div>
            <div className="company-logo">Statbel</div>
          </div>
        </div>
      </section>

      {/* Operations Section */}
      <section className="operations-section">
        <div className="container">
          <h2>
            Ontdek ImmoGen.<br />
            <span className="highlight">Het beste hulpmiddel voor woningschattingen.</span>
          </h2>
          <p>
            Met ImmoGen krijg je direct inzicht in de waarde van je woning, gebaseerd op actuele marktdata en slimme AI-modellen.<br />
            Ideaal voor eigenaars, kopers, verkopers en makelaars!
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;