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

const getFilteredTasks = (tasks, filters) => {
  return tasks.filter((task) => {
    const status = filters.get('status');
    const category = filters.get('category');
    const searchQuery = filters.get('query').toLowerCase();
    const dueDate = filters.get('dueDate');
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
    if(dueDate && moment(dueDate).isBefore(moment(task.get('dueDate')))) {
      return false;
    }
    return true;
  });
};

const { Provider, Consumer } = React.createContext();

function StoreProvider(props) {
  let [categories, setCategories] = useState(fromJS(categoriesJson));
  let [tasks, setTasks] = useState(fromJS(sortedTasks));
  let [filters, setFilters] = useState(Map({status: 'pending', category: 'all', query: ''}));
  let [filteredTasks, setFilteredTasks] = useState(getFilteredTasks(tasks, filters));

  const addCategory = (category) => {
    setCategories(categories.push(Map({id: uuidv4(), ...category})));
  };
  const addTask = (task) => {
    let index = 0;
    for(let i = 0; i < tasks.size; i += 1) {
      if(moment(task.dueDate).isBefore(moment(tasks.getIn([i, 'dueDate'])))) {
        break;
      }
      index = i + 1;
    }
    tasks = tasks.insert(index, Map({id: uuidv4(), ...task}));
    setTasks(tasks);
    setFilteredTasks(getFilteredTasks(tasks, filters));
  };
  const editTask = (id, task) => {
    let index = tasks.findIndex(t => t.get('id') === id);
    tasks = tasks.delete(index);
    addTask(task);
  };
  const getCategoryById = (id) => {
    return categories.find(c => c.get('id') === id);
  };
  const toggleStatus = (id, status) => {
    const index = tasks.findIndex(t => t.get('id') === id);
    tasks = tasks.setIn([index, 'status'], status);
    setTasks(tasks);
    setFilteredTasks(getFilteredTasks(tasks, filters));
  };
  const removeTask = (id) => {
    const index = tasks.findIndex(t => t.get('id') === id);
    tasks = tasks.delete(index);
    setTasks(tasks);
    setFilteredTasks(getFilteredTasks(tasks, filters));
  };
  const updateFilters = (f) => {
    filters = fromJS(f);
    setFilters(filters);
    setFilteredTasks(getFilteredTasks(tasks, filters));
  };

  return (
    <Provider value={{
      categories,
      filteredTasks,
      filters,
      addCategory,
      addTask,
      editTask,
      toggleStatus,
      removeTask,
      getCategoryById,
      updateFilters
    }}>{props.children}</Provider>
  );
}

export {
  StoreProvider,
  Consumer as StoreConsumer
};
