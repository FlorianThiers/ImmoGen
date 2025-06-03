import React, { useState } from 'react';
import Sidebar from '../../components/SideNavbar';
import Header from '../../components/header';

import './dashboard.css'; // Assuming you have a CSS file for styling

const dashboard = () => {
  const isDarkTheme = useState(
    typeof document !== "undefined" && document.body.classList.contains("dark-theme")
  );
    const showOverlay = useState(false);
    const overlayTheme = useState(isDarkTheme ? "dark" : "light");

  return (
    <div className="dashboard">
        {showOverlay && (
            <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
        )}

        <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
        <Sidebar/>
        <main className="main-content">
            <Header title="Dashboard" />

            <div className="content-wrapper">
                <section className="houses-section">
                    <div className="section-header">
                        <h2>Houses</h2>
                        <div className="welcome-text">
                            <span>Welcome Back, </span>
                            <strong>Ryan Danielson</strong>
                        </div>
                    </div>
                    
                    <div className="houses-grid">
                        <div className="house villa">
                            <div className="house-header">
                                <span className="house-type">Villa</span>
                                <span className="house-menu">⋯</span>
                            </div>
                            <div className="house-price">900.450,00€</div>
                            <div className="house-city">Knokke</div>
                            <div className="house-logo masterhouse"></div>
                        </div>
                        
                        <div className="house appartement">
                            <div className="house-header">
                                <span className="house-type">Appartement</span>
                                <span className="house-menu">⋯</span>
                            </div>
                            <div className="house-price">300.500,00€</div>
                            <div className="house-city">Gent</div>
                            <div className="house-logo visa"></div>
                        </div>
                        
                        <div className="house huis">
                            <div className="house-header">
                                <span className="house-type">Huis</span>
                                <span className="house-menu">⋯</span>
                            </div>
                            <div className="house-price">300.250,00€</div>
                            <div className="house-city">Beveren</div>
                            <div className="house-logo masterhouse"></div>
                        </div>
                    </div>
                </section>

                <div className="bottom-section">
                    <section className="transactions-section">
                        <div className="section-header">
                            <h2>Last transactions</h2>
                            <span className="sort-icon"></span>
                        </div>
                        
                        <div className="transactions-table">
                            <div className="table-header">
                                <span>Name of transactions</span>
                                <span>Category</span>
                                <span>Cashback</span>
                                <span>Amount</span>
                            </div>
                            
                            <div className="transaction-row">
                                <div className="transaction-name">
                                    <span className="transaction-icon amazon"></span>
                                    <div>
                                        <div className="name">Amazon</div>
                                        <div className="date">Today at 16:36 AM</div>
                                    </div>
                                </div>
                                <span className="category">Shopping</span>
                                <span className="cashback">+$20.34</span>
                                <span className="amount">→$169.21</span>
                            </div>
                            
                            <div className="transaction-row">
                                <div className="transaction-name">
                                    <span className="transaction-icon walmart"></span>
                                    <div>
                                        <div className="name">Walmart</div>
                                        <div className="date">Today at 14:32 PM</div>
                                    </div>
                                </div>
                                <span className="category">Food</span>
                                <span className="cashback">+$19.15</span>
                                <span className="amount">$93.96</span>
                            </div>
                        </div>
                    </section>

                    <div className="right-panel">
                        <section className="currency-exchange">
                            <h2>Currency Exchange</h2>
                            
                            <div className="exchange-controls">
                                <div className="currency-input">
                                    <select aria-label="From currency">
                                        <option>USD</option>
                                    </select>
                                    <span className="exchange-arrow">⇄</span>
                                    <select aria-label="To currency">
                                        <option>EUR</option>
                                    </select>
                                </div>
                                
                                <div className="currency-input">
                                    <select aria-label="From currency">
                                        <option>EUR</option>
                                    </select>
                                    <span className="exchange-arrow">⇄</span>
                                    <select aria-label="To currency">
                                        <option>USD</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="exchange-amounts">
                                <div className="amount-row">
                                    <span className="label">Amount</span>
                                    <div className="amount-value">$9,459</div>
                                    <span className="rate">1 USD = 0.91 EUR</span>
                                </div>
                                
                                <div className="amount-row">
                                    <div className="amount-value">$7,250</div>
                                    <span className="rate">1 EUR = 1.10 USD</span>
                                </div>
                            </div>
                            
                            <div className="exchange-footer">
                                <button className="convert-btn">Convert</button>
                                <div className="last-updated">
                                    <span>↻ Updated</span>
                                    <span>May 5, 2024 at 8:20 PM</span>
                                </div>
                            </div>
                        </section>

                        <section className="money-flow">
                            <div className="section-header">
                                <h2>Money flow</h2>
                                <span className="date-range">Apr 21, 2024 - May 7, 2024</span>
                            </div>
                            
                            <div className="chart-container">
                                <svg className="flow-chart" width="100%" height="120">
                                    <path d="M0,60 Q50,40 100,50 T200,45 T300,55 T400,40 T500,50" 
                                          stroke="#4A90E2" stroke-width="2" fill="none"/>
                                    <path d="M0,80 Q50,60 100,70 T200,65 T300,75 T400,60 T500,70" 
                                          stroke="#7B68EE" stroke-width="2" fill="none" opacity="0.7"/>
                                </svg>
                                
                                <div className="chart-labels">
                                    <span>0</span>
                                    <span>27</span>
                                    <span>28</span>
                                    <span>29</span>
                                    <span>30</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                    <span>6</span>
                                    <span>7</span>
                                    <span>8</span>
                                    <span>9</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </div>

  );
};

export default dashboard;