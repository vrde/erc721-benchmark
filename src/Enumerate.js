import React, { Component } from "react";
import config from "./config.js";

export default class Enumerate extends Component {
  handleSubmit(event) {
    console.log(event.target.contract.value, event.target.owner.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="Enumerate">
        <form onSubmit={this.handleSubmit}>
          <input name="contract" />
          <input name="owner" />
          <input type="submit" />
        </form>
        <ul className="tokens" />
      </div>
    );
  }
}
