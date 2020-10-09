import React from "react";
import { ALGORITHMS } from "./game/Algorithms";

export class AlgorithmSelector extends React.Component {
  render() {
    return (
      <select
        value={this.props.value}
        onChange={(event) =>
          this.props.onAlgorithmChange(
            ALGORITHMS.find(
              (algorithm) => algorithm.name === event.target.value
            )
          )
        }
      >
        {ALGORITHMS.map((algorithm) => (
          <option key={algorithm.name} value={algorithm.name}>
            {algorithm.name}
          </option>
        ))}
      </select>
    );
  }
}
