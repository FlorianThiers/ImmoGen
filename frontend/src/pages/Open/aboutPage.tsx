// AboutPage.tsx
import Navbar from '../../components/Navbar';
import './landingPage.css';

const AboutPage = () => {
  return (
    <div className="landingpage">
      <Navbar />
      <section className="hero">
        <div className="container">
          <h1>Over <span className="highlight">ImmoGen</span></h1>
          <p>
            ImmoGen is ontstaan vanuit de behoefte aan een betrouwbaar, transparant en toegankelijk platform
            voor woningschattingen. Gebouwd met behulp van AI, data scraping en actuele vastgoedinzichten,
            helpt ImmoGen eigenaars, kopers, en verkopers bij het inschatten van vastgoedwaarde.
          </p>
          <p>
            Oprichter <strong>Florian Thiers</strong> combineert zijn passie voor technologie, data-analyse en menselijke dynamiek
            in dit innovatieve project. Naast ontwikkelaar is hij ook muzikant en natuurliefhebber.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
