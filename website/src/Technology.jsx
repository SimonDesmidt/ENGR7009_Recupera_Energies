import HeatRecoveryDiagram from "./HeatRecoveryDiagram";

export default function Technology() {
  return (
    <section className="section technology" id="technology">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="section-head">
        <span className="eyebrow">THE TECHNOLOGY</span>

        <h2>
          Recover the heat your refrigeration system rejects.
        </h2>

        <p>
          Central supermarket refrigeration moves heat from chilled
          cabinets and cold rooms to the outside.

          RECUPERA diverts suitable heat through an engineered
          heat exchanger to a separate water circuit, while
          protecting normal refrigeration operation.
        </p>
      </div>


      {/* =====================================================
          HEAT RECOVERY DIAGRAM
      ===================================================== */}

      <div className="diagram-card">

        <h3>How the system works</h3>

        <HeatRecoveryDiagram />

        <p className="diagram-note">
          Conceptual schematic, not a piping and instrumentation
          diagram. The heat pump is optional and is only required
          when the recovered heat needs to be upgraded to a higher
          temperature.

          Actual refrigerant connections, valves, controls and
          potable-water separation require site-specific engineering.
        </p>

      </div>


      {/* =====================================================
          THREE STEPS
      ===================================================== */}

      <div className="tech-grid">

        {/* STEP 1 — DIAGNOSIS */}

        <article>
          <span className="tech-number"><b>01</b></span>

          <h3>Diagnose</h3>

          <p>
            Log refrigerant temperatures, compressor operation,
            heating loads and the existing condenser arrangement.

            Check whether usable heat and heating demand coincide.
          </p>
        </article>


        {/* STEP 2 — INSTALLATION */}

        <article>
          <span className="tech-number"><b>02</b></span>

          <h3>Retrofit safely</h3>

          <p>
            Specify heat exchangers, pumps, valves, protection
            and controls.

            Keep the existing condenser available and give
            refrigeration operation priority.
          </p>
        </article>


        {/* STEP 3 — MONITORING */}

        <article>
          <span className="tech-number"><b>03</b></span>

          <h3>Measure savings</h3>

          <p>
            Meter water flow and temperatures to estimate
            delivered thermal energy.

            Account for auxiliary electricity and changes
            in refrigeration efficiency.
          </p>
        </article>

      </div>


      {/* =====================================================
          WHY RECUPERA?
      ===================================================== */}

      <div className="tech-bottom">

        <div>
          <h3>Why RECUPERA?</h3>

          <p>
            Our proposed differentiation is a repeatable,
            financed retrofit service for smaller multi-site
            supermarkets—not a claim to have invented heat recovery.

            We combine diagnosis, standardized engineering,
            financing partners, installation and monitored maintenance.
          </p>
        </div>


        {/* WHEN IS HEAT RECOVERY VIABLE? */}

        <div>
          <h3>When does it make sense?</h3>

          <p>
            Only when heat is available at a suitable temperature,
            a compatible heating load exists, and net savings
            justify the installed cost.

            Some stores will not be good candidates.
          </p>
        </div>

      </div>
  </section>

  );
}