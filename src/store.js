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
  let [filteredTasks, setFilteredTasks] = useState(tasks);
  let [filters, setFilters] = useState(Map({status: 'all', category: 'all', query: ''}));
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
    const index = tasks.findIndex(t => t.get('id') === id);
    tasks = tasks.setIn([index, 'status'], status);
    setTasks(tasks);
    refreshTaskList();
  };
  const removeTask = (id) => {
    const index = tasks.findIndex(t => t.get('id') === id);
    tasks = tasks.delete(index);
    setTasks(tasks);
    refreshTaskList();
  };
  const refreshTaskList = () => {
    filteredTasks = tasks.filter((task) => {
      const status = filters.get('status');
      const category = filters.get('category');
      const searchQuery = filters.get('query').toLowerCase();
      if(status !== 'all' && status !== task.get('status')) {
        return false;
      }
      if(category !== 'all' && category !== task.get('categoryId')) {
        return false;
      }
      if(searchQuery !== '' &&
        !(task.get('title').toLowerCase().search(searchQuery) > -1 || task.get('description').toLowerCase().search(searchQuery) > -1)) {
        return false;
      }
      return true;
    });
    setFilteredTasks(filteredTasks);
  };
  const updateFilter = (field, value) => {
    filters = filters.set(field, value);
    setFilters(filters);
    refreshTaskList();
  };

  return (
    <Provider value={{
      categories,
      filteredTasks,
      filters,
      addCategory,
      addTask,
      toggleStatus,
      removeTask,
      getCategoryById,
      updateFilter
    }}>{props.children}</Provider>
  );
}

export {
  StoreProvider,
  Consumer as StoreConsumer
};
