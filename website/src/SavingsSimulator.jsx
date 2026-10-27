import { useState } from "react";
import "./SavingsSimulator.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const SIMPLE_ASSUMPTIONS = {
  coolingCapacityPerFridge: 2.5, // kW per cabinet/freezer
  heatingDemandPerArea: 120,     // kWh/m²/year
  refrigerationHours: 8760,
};

const PRESETS = {
  gas: [
    { label: "Low", value: 0.04 },
    { label: "Medium", value: 0.07 },
    { label: "High", value: 0.10 },
  ],

  equipment: [
    {
      label: "Low",
      value: 25000,
      maintenance: 60,
    },
    {
      label: "Medium",
      value: 45000,
      maintenance: 110,
    },
    {
      label: "High",
      value: 70000,
      maintenance: 175,
    },
  ],

  finance: [
    { label: "Low", value: 5 },
    { label: "Medium", value: 8 },
    { label: "High", value: 12 },
  ],
};

function PresetButtons({
  label,
  options,
  selectedValue,
  onChange,
  formatValue,
}) {
  return (
    <div className="preset-field">
      <label>{label}</label>

      <div className="preset-buttons">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            className={
              selectedValue === option.value
                ? "preset-button selected"
                : "preset-button"
            }
            onClick={() => onChange(option)}
          >
            <strong>{option.label}</strong>

            <small>
              {formatValue(option.value)}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}


const formatMoney = (number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(number);


const formatNumber = (number) =>
  new Intl.NumberFormat("en-IE", {
    maximumFractionDigits: 3,
  }).format(number);

const formatNumber_v2 = (number) =>
  new Intl.NumberFormat("en-IE", {
    maximumFractionDigits: 0,
  }).format(number);


const defaultValues = {
  numberOfFridges: 32,
  supermarketArea: 1300,
  daysOpen: 7,
  hoursPerDay: 12,
  capacity: 80,
  hours: 8760,
  rejection: 1.15,
  capture: 65,
  overlap: 55,
  heatingDemand: 160000,
  gas: 0.09,
  boiler: 90,
  aux: 2,
  auxHours: 3500,
  elec: 0.22,
  penalty: 0,
  price: 45000,
  years: 5,
  rate: 8,
  maintenance: 110,
};


function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  hint,
}) {
  return (
    <div className="slider-field">
      <div className="slider-head">
        <label>{label}</label>
        <strong>
          {formatNumber(value)} {unit}
        </strong>
      </div>

      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />

      {hint && <small>{hint}</small>}
    </div>
  );
}


function Stat({ label, value, sub, accent = false }) {
  return (
    <div className={`stat${accent ? " accent" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}


export default function SavingsSimulator() {
  const [mode, setMode] = useState("simple");
  const [values, setValues] = useState(defaultValues);

  const setValue = (key) => (value) => {
    setValues((previousValues) => ({
      ...previousValues,
      [key]: value,
    }));
  };

  const resetValues = () => {
    setValues(defaultValues);
  };

  const selectEquipmentPreset = (preset) => {
    setValues((previousValues) => ({
      ...previousValues,
      price: preset.value,
      maintenance: preset.maintenance,
    }));
  };

  const openingHours =
    values.daysOpen *
    values.hoursPerDay *
    52;

  const openingFraction =
    openingHours /
    SIMPLE_ASSUMPTIONS.refrigerationHours;

  const estimatedCoolingCapacity =
    values.numberOfFridges *
    SIMPLE_ASSUMPTIONS.coolingCapacityPerFridge;

  const estimatedHeatingDemand =
    values.supermarketArea *
    SIMPLE_ASSUMPTIONS.heatingDemandPerArea;

  const estimatedOverlap = Math.min(
    85,
    35 + 60 * openingFraction,
  );

  const coolingCapacity =
    mode === "simple"
      ? estimatedCoolingCapacity
      : values.capacity;

  const refrigerationHours =
    mode === "simple"
      ? SIMPLE_ASSUMPTIONS.refrigerationHours
      : values.hours;

  const heatingDemand =
    mode === "simple"
      ? estimatedHeatingDemand
      : values.heatingDemand;

  const demandOverlap =
    mode === "simple"
      ? estimatedOverlap
      : values.overlap;

  /*
   * Average heat rejection is estimated from the input cooling capacity,
   * not from the compressor electrical input.
   */
  const availableHeat =
    coolingCapacity *
    values.rejection *
    refrigerationHours;

  const capturedHeat =
    availableHeat *
    values.capture /
    100;

  const overlappingHeat =
    capturedHeat *
    demandOverlap /
    100;

  const usefulHeat = Math.min(
    overlappingHeat,
    heatingDemand,
  );

  const displacedFuel =
    usefulHeat /
    (values.boiler / 100);

  const grossHeatingSavings =
    displacedFuel *
    values.gas;

  const auxiliaryElectricity =
    values.aux *
    values.auxHours;

  // Illustrative extra refrigeration electricity per kWh of available
  // rejected heat.
  const refrigerationPenalty =
    availableHeat *
    values.penalty /
    100;

  const additionalElectricityCost =
    (auxiliaryElectricity + refrigerationPenalty) *
    values.elec;

  const annualMaintenance =
    values.maintenance *
    12;

  const annualNetSavings =
    grossHeatingSavings -
    additionalElectricityCost -
    annualMaintenance;

  const paybackPeriod =
    annualNetSavings > 0
      ? values.price / annualNetSavings
      : null;

  const numberOfLeasePayments =
    values.years *
    12;

  const monthlyInterestRate =
    values.rate /
    1200;

  const monthlyLeasePayment =
    monthlyInterestRate === 0
      ? values.price / numberOfLeasePayments
      : (
          values.price *
          monthlyInterestRate /
          (
            1 -
            Math.pow(
              1 + monthlyInterestRate,
              -numberOfLeasePayments,
            )
          )
        );

  const monthlyBenefit =
    (
      grossHeatingSavings -
      additionalElectricityCost
    ) /
    12 -
    values.maintenance -
    monthlyLeasePayment;

  const chartEndYear = values.years + 3;

  const chartData = Array.from(
    { length: chartEndYear + 1 },
    (_, year) => ({
      year,

      Purchase:
        -values.price +
        annualNetSavings *
        year,

      Leasing:
        annualNetSavings *
        year -
        monthlyLeasePayment *
        12 *
        Math.min(year, values.years),
    }),
  );

  return (
    <section
      className="section simulator"
      id="simulator"
    >
      <div className="section-head">
        <span className="eyebrow">
          INTERACTIVE CALCULATOR
        </span>

        <h2>Could waste heat pay for itself?</h2>

        <p>
          Explore a preliminary estimate for a supermarket central
          refrigeration system. Enter a few site details to compare an outright
          purchase with financing through a leasing partner.
        </p>
      </div>

      <div
        className="mode-switch"
        role="group"
        aria-label="Simulator mode"
      >
        <button
          type="button"
          aria-pressed={mode === "simple"}
          className={mode === "simple" ? "selected" : ""}
          onClick={() => setMode("simple")}
        >
          Simple estimate
        </button>

        <button
          type="button"
          aria-pressed={mode === "advanced"}
          className={mode === "advanced" ? "selected" : ""}
          onClick={() => setMode("advanced")}
        >
          Engineering assumptions
        </button>

        <button
          type="button"
          className="reset-btn"
          onClick={resetValues}
        >
          Reset values
        </button>
      </div>

      <div className="sim-layout">
        <div className="sim-inputs">
          <h3>Supermarket and heating</h3>

          {mode === "simple" ? (
            <>
              <Slider
                label="Number of refrigerated cabinets and freezers"
                value={values.numberOfFridges}
                onChange={setValue("numberOfFridges")}
                min={1}
                max={75}
                unit="units"
                hint="Count refrigerated display cabinets and standalone commercial freezers."
              />

              <Slider
                label="Supermarket floor area"
                value={values.supermarketArea}
                onChange={setValue("supermarketArea")}
                min={100}
                max={5000}
                step={50}
                unit="m²"
                hint="Used to estimate annual space-heating and hot-water demand."
              />

              <Slider
                label="Days open per week"
                value={values.daysOpen}
                onChange={setValue("daysOpen")}
                min={1}
                max={7}
                unit="days"
              />

              <Slider
                label="Hours open per day"
                value={values.hoursPerDay}
                onChange={setValue("hoursPerDay")}
                min={1}
                max={24}
                unit="h"
                hint="Opening hours estimate when recovered heat is most likely to match demand. Refrigeration is assumed to operate all year."
              />

              <div className="simple-estimates" aria-live="polite">
                <strong>Estimated site values</strong>
                <span>{formatNumber(estimatedCoolingCapacity)} kW cooling capacity</span>
                <span>{formatNumber(estimatedHeatingDemand / 1000)} MWh/year heating demand</span>
                <span>{formatNumber(estimatedOverlap)}% demand overlap</span>
              </div>

              <PresetButtons
                label="Gas price scenario"
                options={PRESETS.gas}
                selectedValue={values.gas}
                onChange={(option) => setValue("gas")(option.value)}
                formatValue={(value) => `£${value.toFixed(2)}/kWh`}
              />
            </>
          ) : (
            <>
              <Slider
                label="Average refrigeration cooling capacity"
                value={values.capacity}
                onChange={setValue("capacity")}
                min={10}
                max={300}
                step={5}
                unit="kW"
                hint="Estimated average cooling duty while operating—not electrical consumption or equipment nameplate capacity."
              />

              <Slider
                label="Equivalent annual operating hours"
                value={values.hours}
                onChange={setValue("hours")}
                min={1000}
                max={8760}
                step={100}
                unit="h"
              />

              <Slider
                label="Annual usable heating demand"
                value={values.heatingDemand / 1000}
                onChange={(value) => setValue("heatingDemand")(value * 1000)}
                min={10}
                max={1000}
                step={10}
                unit="MWh"
                hint="Annual hot-water and space-heating demand that could be supplied by the recovery system."
              />

              <Slider
                label="Gas price"
                value={values.gas}
                onChange={setValue("gas")}
                min={0}
                max={0.25}
                step={0.005}
                unit="£/kWh"
              />

              <h3>Engineering assumptions</h3>

              <Slider
                label="Heat rejection / cooling ratio"
                value={values.rejection}
                onChange={setValue("rejection")}
                min={1.05}
                max={1.8}
                step={0.05}
                hint="Rejected heat divided by refrigeration cooling duty; indicative, depends on COP and system conditions."
              />

              <Slider
                label="Technically recoverable fraction"
                value={values.capture}
                onChange={setValue("capture")}
                min={10}
                max={90}
                step={5}
                unit="%"
                hint="Fraction of rejected heat transferable at a useful temperature."
              />

              <Slider
                label="Demand overlap and temperature suitability"
                value={values.overlap}
                onChange={setValue("overlap")}
                min={5}
                max={100}
                step={5}
                unit="%"
                hint="Fraction of captured heat that matches demand in time and temperature; an annual approximation."
              />

              <Slider
                label="Existing boiler efficiency"
                value={values.boiler}
                onChange={setValue("boiler")}
                min={70}
                max={98}
                unit="%"
              />

              <Slider
                label="Auxiliary electrical power"
                value={values.aux}
                onChange={setValue("aux")}
                min={0}
                max={10}
                step={0.5}
                unit="kW"
              />

              <Slider
                label="Auxiliary annual operating hours"
                value={values.auxHours}
                onChange={setValue("auxHours")}
                min={0}
                max={8760}
                step={100}
                unit="h"
              />

              <Slider
                label="Refrigeration electricity penalty"
                value={values.penalty}
                onChange={setValue("penalty")}
                min={0}
                max={15}
                step={0.5}
                unit="%"
                hint="Extra kWh of compressor electricity per 100 kWh of total rejected heat. Set from engineering assessment."
              />

              <Slider
                label="Electricity price"
                value={values.elec}
                onChange={setValue("elec")}
                min={0.05}
                max={0.5}
                step={0.01}
                unit="£/kWh"
              />
            </>
          )}

          <h3>Equipment and financing</h3>

          {mode === "simple" ? (
            <>
              <PresetButtons
                label="Installed equipment package"
                options={PRESETS.equipment}
                selectedValue={values.price}
                onChange={selectEquipmentPreset}
                formatValue={formatMoney}
              />

              <p className="preset-note">
                Estimated maintenance: {formatMoney(values.maintenance)} per month
              </p>

              <Slider
                label="Lease term"
                value={values.years}
                onChange={setValue("years")}
                min={1}
                max={20}
                unit="years"
              />

              <PresetButtons
                label="Financing rate scenario"
                options={PRESETS.finance}
                selectedValue={values.rate}
                onChange={(option) => setValue("rate")(option.value)}
                formatValue={(value) => `${value}%`}
              />
            </>
          ) : (
            <>
              <Slider
                label="Installed equipment price"
                value={values.price}
                onChange={setValue("price")}
                min={10000}
                max={150000}
                step={1000}
                unit="£"
              />

              <Slider
                label="Lease term"
                value={values.years}
                onChange={setValue("years")}
                min={3}
                max={10}
                unit="years"
              />

              <Slider
                label="Illustrative financing rate"
                value={values.rate}
                onChange={setValue("rate")}
                min={0}
                max={16}
                step={0.5}
                unit="%"
              />

              <Slider
                label="Monthly maintenance"
                value={values.maintenance}
                onChange={setValue("maintenance")}
                min={0}
                max={600}
                step={10}
                unit="£"
              />
            </>
          )}
        </div>

        <div className="sim-results">
          <h3>Estimated annual performance</h3>

          <div className="stat-grid">
            <Stat
              label="Available waste heat"
              value={`${formatNumber_v2(availableHeat / 1000)} MWh`}
              sub="Before technical and demand limits"
            />

            <Stat
              label="Useful delivered heat"
              value={`${formatNumber(usefulHeat / 1000)} MWh`}
              sub="Limited by heating demand"
            />

            <Stat
              label="Gross heating savings"
              value={formatMoney(grossHeatingSavings)}
              sub="Avoided boiler fuel"
            />

            <Stat
              label="Additional electricity cost"
              value={formatMoney(additionalElectricityCost)}
              sub="Pumps and refrigeration penalty"
            />

            <Stat
              label="Outright purchase payback"
              value={
                paybackPeriod === null
                  ? "Not achieved"
                  : `${Math.floor(paybackPeriod + 1 / 24)} years ${Math.ceil((paybackPeriod % 1) * 12) % 12} months`
              }
              sub="Net savings after electricity and maintenance"
            />

            <Stat
              label="Monthly lease payment"
              value={formatMoney(monthlyLeasePayment)}
              sub="Illustrative amortizing finance"
            />

            <Stat
              label="Monthly benefit during lease"
              value={formatMoney(monthlyBenefit)}
              sub="After lease, maintenance and electricity"
              accent
            />

            <Stat
              label={`${chartEndYear}-year leasing cash flow`}
              value={formatMoney(chartData[chartEndYear].Leasing)}
              sub="Cumulative undiscounted cash flow"
            />
          </div>

          {monthlyBenefit < 0 && (
            <p className="sim-warning">
              Under these assumptions, monthly lease and running costs exceed
              the estimated energy savings. This installation would not meet a
              cash-positive leasing proposition.
            </p>
          )}

          <div className="chart-wrap">
            <h3>Cumulative cash flow (£)</h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 8,
                  right: 14,
                  left: 2,
                  bottom: 8,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="year"
                  label={{
                    value: "Years",
                    position: "insideBottom",
                    offset: -3,
                  }}
                />

                <YAxis
                  width={58}
                  tickFormatter={(value) =>
                    `${Math.round(value / 1000)}k`
                  }
                />

                <Tooltip
                  formatter={(value) => formatMoney(value)}
                  labelFormatter={(value) => `Year ${value}`}
                />

                <Legend verticalAlign="top" />

                <ReferenceLine
                  y={0}
                  stroke="#64797d"
                />

                <Line
                  type="linear"
                  name="Purchase"
                  dataKey="Purchase"
                  stroke="#dc8c43"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  type="linear"
                  name="Leasing"
                  dataKey="Leasing"
                  stroke="#159c83"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="assumptions">
            <h3>Model notes</h3>

            <p>
              Available heat = cooling capacity × heat-rejection ratio ×
              equivalent operating hours. Useful heat = the smaller of annual
              heating demand and captured heat × demand-overlap factor. This is
              a simplified annual model: hourly measurements are needed to
              establish actual temperature and demand matching.
            </p>

            <p>
              {mode === "simple"
                ? "Simple-mode assumptions: 2.5 kW average cooling duty per refrigerated cabinet, 120 kWh/m² annual heating demand and year-round refrigeration operation. Demand overlap is estimated from opening hours. Heat rejection/cooling ratio is 1.15, recoverable fraction 65%, boiler efficiency 90%, auxiliary pumps 2 kW for 3,500 hours, electricity £0.22/kWh and no compressor penalty."
                : "Engineering assumptions are illustrative and should be replaced by measured values from a site diagnosis."}
            </p>

            <p>
              Finance uses a fully amortizing loan-payment approximation, not
              an actual lease quote. Assumes no deposit, taxes, residual value,
              grants, degradation, tariff escalation or replacement costs.
              Annual net savings include maintenance and modeled electricity.
              The model assumes no heat pump; sites requiring temperature
              uplift need a separate heat-pump calculation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
