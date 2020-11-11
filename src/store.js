import React from "react";
import { useState } from "react";
import { fromJS, Map } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import categoriesJson from "./data/categories.json";
import tasksJson from './data/tasks.json';

const sortedTasks = tasksJson.sort((a, b) => {
  a = moment(a.dueDate);
  b = moment(b.dueDate);
  if(a.isBefore(b)) return -1;
  if(a.isAfter(b)) return 1;
  return 0;
});

const { Provider, Consumer } = React.createContext();

function StoreProvider(props) {
  let [categories, setCategories] = useState(fromJS(categoriesJson));
  let [tasks, setTasks] = useState(fromJS(sortedTasks));
  const addCategory = (category) => {
    setCategories(categories.push(Map({id: uuidv4(), ...category})));
  };
  const addTask = (task) => {
    setTasks(tasks.push(Map({id: uuidv4(), ...task})));
  };
  const getCategoryById = (id) => {
    return categories.find(c => c.get('id') === id);
  };
  const toggleStatus = (id, status) => {
    tasks = tasks.setIn([id, 'status'], status);
    setTasks(tasks);
  }
  const removeTask = (index) => {
    tasks = tasks.delete(index);
    setTasks(tasks);
  }

  return (
    <Provider value={{
      categories, addCategory, tasks, addTask, toggleStatus, removeTask, getCategoryById
    }}>{props.children}</Provider>
  );
}

export {
  StoreProvider,
  Consumer as StoreConsumer
};
