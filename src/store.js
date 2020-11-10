import React, { Component } from "react";
import { fromJS } from 'immutable';
import categories from "./data/categories.json";

const { Provider, Consumer } = React.createContext();

class StoreProvider extends Component {
  state = {
    categories: fromJS(categories)
  };

  render() {
    return <Provider value={{
      categories: this.state.categories
    }}>{this.props.children}</Provider>;
  }
}

export {
  StoreProvider,
  Consumer as StoreConsumer
};
