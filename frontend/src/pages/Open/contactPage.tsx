// ContactPage.tsx
import Navbar from '../../components/Navbar';
import './landingPage.css';

const ContactPage = () => {
  return (
    <div className="landingpage">
      <Navbar />
      <section className="hero">
        <div className="container">
          <h1><span className="highlight">Contact</span> opnemen</h1>
          <p>Heb je vragen over ImmoGen, feedback of wil je samenwerken? Aarzel niet om contact op te nemen.</p>
          <p>Mail: <a href="mailto:florian@immogen.ai">florian@immogen.ai</a></p>
          <p>Twitter: <a href="https://twitter.com/florianthiers" target="_blank" rel="noopener">@florianthiers</a></p>
          <p>LinkedIn: <a href="https://linkedin.com/in/florianthiers" target="_blank" rel="noopener">linkedin.com/in/florianthiers</a></p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;