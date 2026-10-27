import { useState } from "react";

import SavingsSimulator from "./SavingsSimulator.jsx";
import Technology from "./Technology.jsx";
import "./App.css";


const processSteps = [
  [
    "01",
    "Diagnosis",
    "Measure refrigeration conditions and usable heating demand.",
  ],
  [
    "02",
    "Engineering",
    "Size and specify a safe, site-compatible retrofit.",
  ],
  [
    "03",
    "Financing (optional)",
    "Seek approval from a third-party leasing provider.",
  ],
  [
    "04",
    "Installation",
    "Install and commission with qualified refrigeration contractors.",
  ],
  [
    "05",
    "Monitoring",
    "Track performance, service the equipment and verify results.",
  ],
];


export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <a
          href="#home"
          className="brand"
        >
          <span className="brand-icon">R</span>
          RECUPERA <strong>Energies</strong>
        </a>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <nav
          className={open ? "nav-links open" : "nav-links"}
          onClick={() => setOpen(false)}
        >
          <a href="#home">Home</a>
          <a href="#solution">Our Solution</a>
          <a href="#technology">Technology</a>
          <a href="#process">How It Works</a>
          <a href="#simulator">Savings Simulator</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section
          id="home"
          className="hero"
        >
          <div>
            <span className="eyebrow">
              REFRIGERATION HEAT RECOVERY
            </span>

            <h1>
              Your waste heat is
              <br />
              <em>your next saving.</em>
            </h1>

            <p>
              Recover energy rejected by central refrigeration systems and put
              it to work heating your store. We handle diagnosis,
              engineering and installation, and offer third-party financing
              options.
            </p>

            <div className="hero-actions">
              <a
                className="button primary"
                href="#simulator"
              >
                Estimate your savings →
              </a>

              <a
                className="button secondary"
                href="#technology"
              >
                See the technology
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div>REFRIGERATION</div>

            <span className="rejected-heat">
              ↓ rejected heat
            </span>

            <div className="hero-core">
              RECUPERA
              <small>HEAT RECOVERY</small>
            </div>

            <span className="useful-energy">
              ↓ useful energy
            </span>

            <div>HOT WATER &amp; HEATING</div>
          </div>
        </section>

        <section
          id="solution"
          className="section"
        >
          <div className="section-head">
            <span className="eyebrow">
              OUR SOLUTION
            </span>

            <h2>
              Stop throwing away energy you've already paid for.
            </h2>

            <p>
              Supermarkets run refrigeration year-round while also paying for
              building heat and hot water. RECUPERA assesses for you whether those two
              systems can be connected economically.
            </p>
          </div>

          <div className="three-grid">
            <article>
              <b>01</b>
              <h3>Recover</h3>

              <p>
                Capture suitable waste heat from central refrigeration
                equipment.
              </p>
            </article>

            <article>
              <b>02</b>
              <h3>Integrate</h3>

              <p>
                Retrofit equipment with refrigeration-priority controls and
                monitored performance.
              </p>
            </article>

            <article>
              <b>03</b>
              <h3>Finance</h3>

              <p>
                Explore third-party equipment leasing to reduce upfront
                customer expenditure.
              </p>
            </article>
          </div>
        </section>

        <Technology />

        <section
          id="process"
          className="section process"
        >
          <div className="section-head">
            <span className="eyebrow">
              OUR PROCESS
            </span>

            <h2>
              From site diagnosis to measured savings.
            </h2>
          </div>

          <div className="steps">
            {processSteps.map(
              ([number, title, description]) => (
                <article key={number}>
                  <b>{number}</b>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ),
            )}
          </div>
        </section>

        <SavingsSimulator />

        <section
          id="contact"
          className="section contact"
        >
          <span className="eyebrow">
            NEXT STEP
          </span>

          <h2>
            Interested in a site diagnosis?
          </h2>

          <p>
            Contact our team to discuss your supermarket's refrigeration
            equipment, heating demand and possible recovery opportunities.
          </p>

          <p className="contact-note">
            You cannot contact us, this is not real.
          </p>
        </section>
      </main>

      <footer>
        <strong>RECUPERA Energies</strong>

        <p>
          Waste heat recovery for commercial refrigeration.
        </p>

        <small>
          © {new Date().getFullYear()} RECUPERA Energies · Concept website
        </small>
      </footer>
    </>
  );
}