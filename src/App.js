import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Button
} from '@material-ui/core';
import CategoryForm from './categoryForm';
import Tasks from './tasks';
import './App.css';
import TaskForm from "./taskForm";
import { StoreConsumer } from "./store";

function App() {
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  return (
    <StoreConsumer>
      {context => (
        <div className="App">
          <ButtonGroup color="primary">
            <Button onClick={() => setCategoriesVisible(true)}>New Category</Button>
            <Button onClick={() => setNewTaskVisible(true)}>New Task</Button>
          </ButtonGroup>
          <Dialog fullWidth={true} open={categoriesVisible} onClose={() => setCategoriesVisible(false)}>
            <DialogTitle>New Category</DialogTitle>
            <DialogContent>
              <CategoryForm onFormSubmit={({name, color}) => {
                context.addCategory({name, color});
                setCategoriesVisible(false);
              }}/>
            </DialogContent>
          </Dialog>
          <Dialog fullWidth={true} open={newTaskVisible} onClose={() => setNewTaskVisible(false)}>
            <DialogTitle>New Task</DialogTitle>
            <DialogContent>
              <TaskForm categories={context.categories} onFormSubmit={(formData) => {
                context.addTask(formData);
                setNewTaskVisible(false);
              }} />
            </DialogContent>
          </Dialog>
          <Tasks />
        </div>
      )}
    </StoreConsumer>
  );
}

export default App;
