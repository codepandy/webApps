import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import "./index.css";
import data from "./data";

function PinGe() {
  const options = {
    size: 140,
    minSize: 20,
    gutter: 16,
    provideProps: true,
    numCols: 5,
    fringeWidth: 160,
    yRadius: 130,
    xRadius: 220,
    cornerRadius: 50,
    showGuides: false,
    compact: true,
    gravitation: 5,
  };
  return (
    <BubbleUI options={options} className="PinGe">
      {data.map((item) => (
        <section
          key={item.symbol}
          style={{
            backgroundColor: item.backgroundColor + "d0",
            color: item.textColor,
          }}
          className="PinGeKuan"
        >
          {item.name}
        </section>
      ))}
    </BubbleUI>
  );
}

export default PinGe;
