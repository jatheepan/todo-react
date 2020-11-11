import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  MenuItem,
  Grid
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
export default function TaskForm({initialValues = {}, categories = [], onFormSubmit = () => {}}) {
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || '');
  const [status, setStatus] = useState(initialValues.status || 'pending');
  const [dueDate, setDueDate] = useState(initialValues.dueDate ? moment(initialValues.dueDate).toDate() : new Date());
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
    if(!title.trim().length) {
      formErrors.push('title');
    }
    if(!description.trim().length) {
      formErrors.push('description');
    }
    if(!categoryId) {
      formErrors.push('categoryId');
    }
    if(!dueDate) {
      formErrors.push('dueDate');
    }
    setErrors(formErrors);
    if(!formErrors.length) {
      onFormSubmit({title: title.trim(), description: description.trim(), status, categoryId, dueDate});
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs>
            <TextField
              fullWidth
              label="Title"
              value={title}
              error={errors.includes('title')}
              onChange={e => setTitle(e.target.value)} />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              label="Description"
              value={description}
              error={errors.includes('description')}
              onChange={e => setDescription(e.target.value)} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs>
            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              error={errors.includes('status')}
              onChange={e => setStatus(e.target.value)}>
              <MenuItem value="done">Done</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              select
              label="Category"
              value={categoryId}
              error={errors.includes('categoryId')}
              onChange={e => setCategoryId(e.target.value)}>
              {categories.map((item) => {
                return(
                  <MenuItem value={item.get('id')} key={item.get('id')}>{item.get('name')}</MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="time-picker"
                format="MM/dd/yyyy"
                value={dueDate}
                error={errors.includes('dueDate')}
                onChange={date => {
                  setDueDate(date);
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Button className={classes.submitButton} size="large" color="primary" onClick={() => formSubmit()}>Submit</Button>
      </form>
    </div>
  );
}
