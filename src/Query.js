import React, { Component } from "react";

import ERC721 from "./ERC721";

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

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.contract !== prevProps.contract ||
      this.props.owner !== prevProps.owner
    ) {
      console.log("clear interval");
      this.setState({
        fetching: false,
        startTime: 0,
        stopTime: 0,
        tokens: []
      });
      clearInterval(this.intervalId);
    }
  }

  async fetchTokens() {
    const { strategy, contract, owner, disabled } = this.props;

    const erc721 = new ERC721(contract);
    if (!(await erc721.isEnumerable())) {
      this.setState({
        error: "Error: contract does't implement ERC721Enumerable"
      });
      return;
    }

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
    let iterator = erc721[strategy](owner);
    while (true) {
      try {
        let { value, done } = await iterator.next();
        if (done) break;
        tokens.push(value);
      } catch (error) {
        this.setState({ error: error.toString().split("\n")[0] });
        return;
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
    const { error, tokens, startTime, stopTime, fetching } = this.state;
    const { strategy, disabled } = this.props;
    return (
      <div className="Query">
        <h3>
          Fetch strategy: <code>{strategy}</code>
        </h3>
        <div>
          Found {tokens.length} tokens: {tokens.join(", ")}
        </div>
        {error ? (
          <div>{error}</div>
        ) : (
          <div>
            <div>Elapsed Time (s): {(stopTime - startTime) / 1000}</div>
            <button onClick={this.fetchTokens.bind(this)} disabled={disabled}>
              Fetch
            </button>
          </div>
        )}
      </div>
    );
  }
}
