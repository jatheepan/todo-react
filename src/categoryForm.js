import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button
} from '@material-ui/core';
import { CirclePicker as ColorOptions } from 'react-color';

export default function CategoryForm({onFormSubmit}) {
  const [errors, setErrors] = useState([]);
  const [color, setColor] = useState('#ffffff');
  const [name, setName] = useState('');
  const classes = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    submitButton: {
      color: '#fff',
      marginTop: 30,
      backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }
  }))();
  const formSubmit = () => {
    const formErrors = [];
    if(!name.length) {
      formErrors.push('name');
    }
    if(!color.length) {
      formErrors.push('color');
    }
    setErrors(formErrors);
    if(!formErrors.length) {
      onFormSubmit({name, color});
      setColor('#ffffff');
      setName('');
    }
  };

  return (
    <div className={classes.root}>
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
      }} />

      <Button className={classes.submitButton} size="large" color="primary" onClick={() => formSubmit()}>Submit</Button>
    </div>
  );
}
