import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const pages = [
    // general
  { name: "Home", path: "/" },
  { name: "Log In", path: "/login" },
  { name: "Registreer", path: "/register" },
  { name: "Contact", path: "/contactPage" },
  { name: "Features", path: "/FeaturesPage" },  
  { name: "Over mij", path: "/AboutPage" },
  { name: "Over immogen", path: "/AboutPage" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Prijsberekening", path: "/price-calculator" },
  { name: "Statistieken", path: "/statistics" },
  { name: "Map", path: "/map" },
  { name: "Profiel", path: "/profile" },
  { name: "Admin", path: "/admin-panel" },
  //dashboard
  { name: "Recentste types", path: "/dashboard" },
  { name: "Recente schattingen", path: "/dashboard" },
  { name: "Gemiddelde schatting", path: "/dashboard" },
  { name: "Top 3 populairste gemeenten", path: "/dashboard" },
  //Prijsberekening
  { name: "Invulformulier schatting", path: "/price-calculator" },
  { name: "Berekening", path: "/price-calculator" },
  //statistics
  { name: "Data volume overzicht", path: "/statistics" },
  { name: "Huizen per stad", path: "/statistics" },
  { name: "Huizen per bouwjaar", path: "/statistics" },
  { name: "Data kwaliteit & Compleetheid", path: "/statistics" },
  { name: "Gedetailleerde Kwaliteitsoverzicht", path: "/statistics" },
  { name: "Verdeling prijsstatus", path: "/statistics" },
  { name: "Berekende prijs vs AI-prijs", path: "/statistics" },
  //map
  { name: "Kaart statistieken", path: "/map" },
  { name: "kaart Legenda", path: "/map" },
  //profile
  { name: "Eigen map", path: "/profile" },
  { name: "Recente scahttingen van gebruiker", path: "/profile" },
  { name: "Gebruikers info", path: "/profile" },
  { name: "Gebruikers statistieken", path: "/profile" },


  


  

  
  // ...meer
];

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filtered = pages.filter(page =>
        page.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (page: { name?: string; path: any; }) => {
        setQuery("");
        setShowSuggestions(false);
        navigate(page.path);
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        if (showSuggestions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSuggestions]);

    return (
        <div className="search-bar">
            <input
                ref={inputRef}
                type="text"
                placeholder="Zoek"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={e => {
                    if (e.key === "Enter" && filtered.length > 0) {
                        handleSelect(filtered[0]);
                    }
                }}
            />
            {query && showSuggestions && (
                <ul className="search-suggestions">
                    {filtered.slice(0, 8).map(page => (
                        <li
                        key={page.path}
                        onMouseDown={() => handleSelect(page)} // <-- gebruik onMouseDown
                        >
                        {page.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;