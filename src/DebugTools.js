import React from "react";
import "./DebugTools.css";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { ALGORITHMS, DEFAULT_ALGORITHM } from "./game/Heuristics";
import { Bot } from "./game/Bot";

const truncateFloat = (x) => parseInt(x * 100) / 100;

export class DebugTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: DEFAULT_ALGORITHM,
      numIterations: 10,
      scores: [],
      times: [],
    };
  }

  render() {
    return (
      <div className="debug-tools">
        <div className="inputs">
          <p>
            Algorithm:
            <AlgorithmSelector
              value={this.state.algorithm}
              onAlgorithmChange={(algorithm) =>
                this.setState({ algorithm: algorithm })
              }
            />
          </p>

          <p>
            Number of iterations:
            <input
              type="number"
              min="1"
              value={this.state.numIterations}
              onChange={(event) =>
                this.setState({ numIterations: event.target.value })
              }
            />
          </p>

          <button onClick={() => this.run()}>Run</button>
        </div>
        <div className="output">
          {this.state.scores.length > 0
            ? this.nonEmptyOutput()
            : this.emptyOutput()}
        </div>
      </div>
    );
  }

  emptyOutput() {
    return (
      <div>
        <p>Selected algorithm: {this.state.algorithm}</p>
        <p>Number of iterations: {this.state.numIterations}</p>
      </div>
    );
  }

  nonEmptyOutput() {
    const scoresStats = this.computeStats(this.state.scores);
    const timeStats = this.computeStats(this.state.times);

    return (
      <div className="non-empty-output">
        {this.statsTable(timeStats, "Time stats")}

        {this.statsTable(scoresStats, "Scores stats")}

        <table>
          <caption>Scores histogram</caption>
          <thead>
            <tr>
              <th>Score</th>
              <th>Frequency</th>
              <th>Bar plot</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(scoresStats.histogram.entries()).map((entry) => (
              <tr key={entry[0]}>
                <td>{entry[0]}</td>
                <td>{entry[1]}</td>
                <td className="histogram-bar">{"*".repeat(entry[1])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  statsTable(stats, caption) {
    return (
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Min</td>
            <td>{truncateFloat(stats.min)}</td>
          </tr>
          <tr>
            <td>Max</td>
            <td>{truncateFloat(stats.max)}</td>
          </tr>
          <tr>
            <td>Mean</td>
            <td>{truncateFloat(stats.mean)}</td>
          </tr>
          <tr>
            <td>Std. dev.</td>
            <td>{truncateFloat(stats.stdDev)}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  run() {
    const heuristicFn = ALGORITHMS.get(this.state.algorithm);
    const bot = new Bot(heuristicFn);
    bot.runMany(this.state.numIterations);
    this.setState({
      scores: bot.scores,
      times: bot.times,
    });
  }

  computeStats(values) {
    const mean = values.reduce((x, y) => x + y, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((prev, x) => prev + Math.pow(x - mean, 2), 0) /
        values.length
    );

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: mean,
      stdDev: stdDev,
      histogram: this.computeHistogram(values),
    };
  }

  computeHistogram(scores) {
    scores.sort((a, b) => a - b);
    const histogram = new Map();
    scores.forEach((score) => {
      if (!histogram.has(score)) histogram.set(score, 0);
      histogram.set(score, histogram.get(score) + 1);
    });
    return histogram;
  }
}
