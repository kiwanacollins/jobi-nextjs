import React from "react";
import CounterUp from "../common/counter-up";

// counter data
const counter_data: {
  id: number;
  number: number;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 1,
    number: 1,
    title: "million",
    subtitle: "People Helped",
  },
  {
    id: 2,
    number: 180,
    title: "k+",
    subtitle: "Businesses in Partnership",
  },
  {
    id: 3,
    number: 100,
    title: "Million",
    subtitle: "UGX Payout",
  },
];

const CounterOne = ({
  style_2 = false,
  style_3 = false,
}: {
  style_2?: boolean;
  style_3?: boolean;
}) => {
  return (
    <>
      {counter_data.map((c) => (
        <div key={c.id} className="col-sm-4">
          <div
            className={`${
              style_2 ? "counter-block-two mt-15" : "counter-block-one mt-25"
            } text-center wow fadeInUp`}
          >
            {!style_3 && (
              <div className={`main-count fw-500 ${style_2 ? "text-white" : "text-dark"}`}>
                <span className="counter">
                  <CounterUp
                    number={c.number}
                    text={c.title}
                    add_style={true}
                  />
                </span>
              </div>
            )}
            {style_3 && (
              <h2 className={`main-count fw-500`}>
                <span className="counter">
                  <CounterUp
                    number={c.number}
                    text={c.title}
                    add_style={true}
                  />
                </span>
              </h2>
            )}
            <p className={`${style_2 ? "text-white" : ""}`}>{c.subtitle}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default CounterOne;
