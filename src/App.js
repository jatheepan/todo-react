import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Button
} from '@material-ui/core';
import Categories from './categories';
import Tasks from './tasks';
import './App.css';

function App() {
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  return (
    <div className="App">
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={() => setCategoriesVisible(true)}>Categories</Button>
      </ButtonGroup>
      <Dialog fullWidth={true} open={categoriesVisible} onClose={() => setCategoriesVisible(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Categories</DialogTitle>
        <DialogContent>
          <Categories />
        </DialogContent>
      </Dialog>
      <Tasks />
    </div>
  );
}

export default App;
