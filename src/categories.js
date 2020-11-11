import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Popper,
  ClickAwayListener
} from '@material-ui/core';
import { TwitterPicker as ColorOptions } from 'react-color';
import { StoreConsumer } from "./store";

export default function Categories() {
  const [errors, setErrors] = useState([]);
  const [color, setColor] = useState('#ffffff');
  const [name, setName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    }
  }))();
  const formSubmit = (context) => {
    const formErrors = [];
    if(!name.length) {
      formErrors.push('name');
    }
    if(!color.length) {
      formErrors.push('color');
    }
    setErrors(formErrors);
    if(!formErrors.length) {
      context.addCategory({name, color});
      setColor('#ffffff');
      setName('');
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  return (
    <div className={classes.root}>
      <StoreConsumer>
        {context => {
          return (
            <Fragment>
              <TextField
                fullWidth
                autoFocus
                error={errors.includes('name')}
                value={name}
                onChange={(e) => {setName(e.target.value)}}
                margin="dense"
                id="name"
                label="Name"
                type="text"
              />
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <div style={{position: 'relative'}}>
                  <Button aria-describedby={id} onClick={(e) => {
                    setAnchorEl(anchorEl ? null : e.currentTarget);
                  }} style={{backgroundColor: color}}>Color</Button>
                  <Popper open={open} anchorEl={anchorEl} style={{zIndex: 9999}} placement="bottom-start">
                    <ColorOptions onChangeComplete={ ({hex}) => {
                      setColor(hex);
                      setAnchorEl(null);
                    } } />
                  </Popper>
                </div>
              </ClickAwayListener>
              <Button id={id} color="primary" onClick={() => formSubmit(context)}>Add</Button>

              <List component="nav">
                {context.categories.map((item, index) => {
                  return(
                    <div style={{borderLeft: `10px solid ${item.get('color')}`}} key={item.get('id')}>
                      <ListItem button onClick={() => {
                      }}>
                        <ListItemText primary={item.get('name')} />
                      </ListItem>
                    </div>
                  );
                })}
              </List>
            </Fragment>
          );
        }}
      </StoreConsumer>
    </div>
  );
}

// export function CategoryDialog() {
//   const [open, setOpen] = useState(false);
//   const [errors, setErrors] = useState([]);
//   const handleClickOpen = () => setOpen(true);
//   const handleClose = () => {
//     setErrors([]);
//     setOpen(false);
//   };
//   const classes = makeStyles((theme) => ({
//   }))();
//   const formSubmit = (context) => {
//     const name = nameRef.value ? nameRef.value.trim() : '';
//     const color = colorRef.value ? colorRef.value.trim() : '';
//     const formErrors = [];
//     if(!name.length) {
//       formErrors.push('name');
//     }
//     if(!color.length) {
//       formErrors.push('color');
//     }
//     setErrors(formErrors);
//     if(!formErrors.length) {
//       context.addCategory({name, color});
//       setOpen(false);
//     }
//   };
//
//   return (
//     <StoreConsumer>
//       {context => {
//         return(
//           <div>
//             <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
//               Add Category
//             </Button>
//             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 formSubmit(context);
//               }}>
//                 <DialogTitle id="form-dialog-title">Add New Category</DialogTitle>
//                 <DialogContent>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={handleClose} color="primary">Cancel</Button>
//                   <Button color="primary" type="submit">Add</Button>
//                 </DialogActions>
//               </form>
//             </Dialog>
//           </div>
//         );
//       }}
//     </StoreConsumer>
//   );
// }
