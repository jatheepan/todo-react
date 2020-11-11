import React from "react";
import { useState } from "react";
import { fromJS, Map } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import categoriesJson from "./data/categories.json";

const { Provider, Consumer } = React.createContext();

function StoreProvider(props) {
  let [categories, setCategories] = useState(fromJS(categoriesJson));
  const addCategory = (category) => {
    categories = categories.push(Map({id: uuidv4(), ...category}));
    setCategories(categories);
  };

  return (
    <Provider value={{
      categories, addCategory
    }}>{props.children}</Provider>
  );
}

export {
  StoreProvider,
  Consumer as StoreConsumer
};
