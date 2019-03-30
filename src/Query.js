import React, { Component } from "react";

export default class Query extends Component {
  constructor(props) {
    super(props);
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

    const tokens = await strategy(contract, owner);
    clearInterval(this.intervalId);
    this.setState({
      tokens,
      fetching: false,
      stopTime: new Date()
    });
  }

  render() {
    const { tokens, startTime, stopTime } = this.state;
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
        <button onClick={this.fetchTokens.bind(this)}>Fetch</button>
      </div>
    );
  }
}
