import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Button
} from '@material-ui/core';
import { CirclePicker as ColorOptions } from 'react-color';
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
    },
    submitButton: {
      color: '#fff',
      marginTop: 10,
      backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
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
                label="Category Name"
                type="text"
              />

              <p>Color</p>
              <ColorOptions width="100%" height={100} onChangeComplete={ ({hex}) => {
                setColor(hex);
                setAnchorEl(null);
              }} />

              <Button className={classes.submitButton} size="large" color="primary" onClick={() => formSubmit(context)}>Add</Button>

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
