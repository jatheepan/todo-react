import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button
} from '@material-ui/core';
import Categories from './categories';
import './App.css';

function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="App">
      <div>
        <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
          Categories
        </Button>
        <Dialog fullWidth={true} open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Categories</DialogTitle>
            <DialogContent>
              <Categories />
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
