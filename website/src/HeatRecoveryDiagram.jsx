import "./HeatRecoveryDiagram.css";
import refrigerationImage from "./assets/refrigeration-cycle.png";
import heatExchanger from "./assets/heat-exchanger.png";
import hotWater from "./assets/hot-water-storage.jpeg";
import heatPump from "./assets/heat-pump-cycle.png";



export default function HeatRecoveryDiagram() {
  return (
    <div className="heat-diagram">

      <div className="heat-component refrigeration">
        <h3>Refrigeration System</h3>
        <img
          className="refrigeration-image"
          src={refrigerationImage}
          alt="Refrigerat system"
        />
        <p className="heat-red">Refrigerator compressors and condensers wastes heat</p>
      </div>

      <div className="heat-arrow">
        <span className="heat-arrow-label">Hot refrigerant</span>
        <div className="heat-arrow-line" />
      </div>

      <div className="heat-component exchanger">
        <h3>Heat Exchanger</h3>
        <img
          className="refrigeration-image"
          src={heatExchanger}
          alt="Refrigeration system"
        />
        <p className="heat-green">Transfers the heat from refrigerant to water</p>
      </div>

        <div className="green-arrow vertical-arrow">
          <span className="green-arrow-label">Hot water</span>
          <div className="green-arrow-line" />
        </div>

      <div className="heat-component heat-pump">
        <span className="optional-label">OPTIONAL</span>
        <h3>Heat Pump</h3>
        <img
          className="refrigeration-image"
          src={heatPump}
          alt="Refrigeration system"
        />
        <p className="heat-green">Raises water temperature when direct recovery is insufficient</p>
      </div>

      <div className="optional-arrow">
        <span className="optional-arrow-label">Hotter water</span>
        <div className="optional-arrow-line" />
      </div>

      <div className="heat-component storage">
        <h3>Hot Water Storage</h3>
        <img
          className="refrigeration-image"
          src={hotWater}
          alt="Refrigeration system"
        />
        <p className="heat-green">Used for domestic use and heating</p>
      </div>

    </div>
  );
}