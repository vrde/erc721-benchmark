import React, { Component } from "react";

export default class Query extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      fetching: false,
      startTime: 0,
      stopTime: 0,
      tokens: []
    };
  }
  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  async fetchTokens() {
    const { strategy, contract, owner } = this.props;
    this.setState({
      fetching: true,
      startTime: new Date(),
      stopTime: new Date(),
      tokens: []
    });

    this.intervalId = setInterval(
      () => this.setState({ stopTime: new Date() }),
      1000
    );

    let tokens = [];
    let iterator = strategy(contract, owner);
    while (true) {
      try {
        let { value, done } = await iterator.next();
        if (done) break;
        tokens.push(value);
      } catch (error) {
        tokens = [error.toString().split("\n")[0]];
        break;
      }
      this.setState({ tokens });
    }
    clearInterval(this.intervalId);
    this.setState({
      tokens,
      fetching: false,
      stopTime: new Date()
    });
  }

  render() {
    const { tokens, startTime, stopTime, fetching } = this.state;
    const { strategy } = this.props;
    return (
      <div className="Query">
        <h2>
          Fetch strategy: <code>{strategy.name}</code>
        </h2>
        <div>
          Found {tokens.length} tokens: {tokens.join(", ")}
        </div>
        <div>Elapsed Time (s): {(stopTime - startTime) / 1000}</div>
        <button onClick={this.fetchTokens.bind(this)} disabled={fetching}>
          Fetch
        </button>
      </div>
    );
  }
}
