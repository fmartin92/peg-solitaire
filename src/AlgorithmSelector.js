import React from "react";
import { ALGORITHMS } from "./game/Heuristics";

export class AlgorithmSelector extends React.Component {
  render() {
    return (
      <select
        value={this.props.value}
        onChange={(event) => this.props.onAlgorithmChange(event.target.value)}
      >
        {Array.from(ALGORITHMS).map((entry) => (
          <option key={entry[0]} value={entry[0]}>
            {entry[0]}
          </option>
        ))}
      </select>
    );
  }
}
