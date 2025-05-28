import React, { useEffect } from 'react';
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

    // Add scroll effect to header
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(255, 255, 255, 0.95)';
          header.style.backdropFilter = 'blur(10px)';
        } else {
          header.style.background = 'white';
          header.style.backdropFilter = 'none';
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

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    const card = e.currentTarget;
    if (isEntering) {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    } else {
      card.style.transform = 'translateY(0) scale(1)';
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <p style={{ color: '#6366f1', fontWeight: '600', marginBottom: '1rem' }}>
                Start Learning Today
              </p>
              <h1>
                The Best Platform Enroll in Your <span className="highlight">Special Course</span>
              </h1>
              <p>
                "Our mission is to help people to find the best course online and learn with expert instructor"
              </p>
              <div>
                <a href="#" className="btn-secondary">Get Start Now</a>
                <a href="#" className="btn-primary">Learn More</a>
              </div>
            </div>
            <div className="hero-image">
              <div style={{
                width: '400px',
                height: '400px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ec4899 100%)',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '300px',
                  height: '300px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '4rem' }}>👩‍🎓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </section>

      {/* Companies Section */}
      <section className="companies">
        <div className="container">
          <h3>Trusted by 4,000+ companies</h3>
          <div className="company-logos">
            <div className="company-logo">Layers</div>
            <div className="company-logo">Sisyphus</div>
            <div className="company-logo">Circooles</div>
            <div className="company-logo">Catalog</div>
            <div className="company-logo">Quotient</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <p style={{ color: '#6366f1', fontWeight: '600' }}>Course Details</p>
          <h2>Explore Our Categories</h2>
          <p>
            Join millions of people from around the world learning together. 
            Online learning is as easy and natural as chatting with a group of friends
          </p>
          <a href="#" className="btn-primary">All Online Categories</a>
          
          <div className="category-grid">
            <div 
              className="category-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="category-icon graphic-design">🎨</div>
              <h3>Graphic Design</h3>
            </div>
            <div 
              className="category-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="category-icon business">💼</div>
              <h3>Business</h3>
            </div>
            <div 
              className="category-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="category-icon web-design">💻</div>
              <h3>Web Design</h3>
            </div>
            <div 
              className="category-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="category-icon content-writing">✍️</div>
              <h3>Content Writing</h3>
            </div>
            <div 
              className="category-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="category-icon digital-marketing">📱</div>
              <h3>Digital Marketing</h3>
            </div>
            <div 
              className="category-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="category-icon finance">💰</div>
              <h3>Finance</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;