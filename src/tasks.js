import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemSecondaryAction,
  IconButton,
  MenuItem,
  TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  AvTimerOutlined as ClockIcon
} from '@material-ui/icons';
import moment from 'moment';
import { Map } from 'immutable';
import { StoreConsumer } from "./store";
import TaskForm from "./taskForm";

export default function Tasks() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editTaskVisible, setEditTaskVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(Map());
  const classes = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
    },
    metaData: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 3
    }
  }))();

  return (
    <div className={classes.root}>
      <StoreConsumer>
        {context => {
          return (
            <Fragment>
              <SearchForm />
              {!context.filteredTasks.size ? <Alert severity="info">No items found</Alert>: ''}
              <List>
                {context.filteredTasks.map((item) => {
                  const category = context.getCategoryById(item.get('categoryId'));
                  return(
                    <div key={item.get('id')}>
                      <ListItem style={{marginTop: 1, borderLeft: `3px solid ${category ? category.get('color') : '#fff'}`}}>
                        <ListItemText
                          primary={
                            <FormControlLabel
                              control={<Checkbox color="primary" checked={item.get('status') === 'done'} onChange={() => {
                                let status = item.get('status');
                                context.toggleStatus(item.get('id'), status === 'done' ? 'pending' : 'done');
                              }} />}
                              label={item.get('title')}
                            />
                          }
                          secondary={
                            <Fragment>
                              <span>
                                {item.get('description')}
                              </span>
                              <br />
                              <span className={classes.metaData}><ClockIcon />{moment(item.get('dueDate')).format('DD/MM/YYYY')}</span>
                            </Fragment>
                          }
                        />
                        <div>
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => {
                              setSelectedTask(item);
                              setEditTaskVisible(true);
                            }}><EditIcon /></IconButton>
                            <IconButton onClick={() => {
                              setSelectedTask(item);
                              setConfirmVisible(true);
                            }}><DeleteIcon /></IconButton>
                          </ListItemSecondaryAction>
                        </div>
                      </ListItem>
                    </div>
                  );
                })}
              </List>
              <Dialog
                open={confirmVisible}
                onClose={() => setConfirmVisible(false)}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Do you want to delete this task?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={() => setConfirmVisible(false)} color="primary">
                    No
                  </Button>
                  <Button onClick={() => {
                    setConfirmVisible(false);
                    context.removeTask(selectedTask.get('id'));
                  }} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog fullWidth={true} open={editTaskVisible} onClose={() => setEditTaskVisible(false)}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                  <TaskForm categories={context.categories} initialValues={selectedTask} onFormSubmit={(formData) => {
                    context.editTask(selectedTask.get('id'), formData);
                    setEditTaskVisible(false);
                  }} />
                </DialogContent>
              </Dialog>

            </Fragment>
          );
        }}
      </StoreConsumer>
    </div>
  );
}

function SearchForm() {
  const classes = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%'
      }
    },
    submitButton: {
      color: '#fff',
      backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      marginBottom: 20
    }
  }))();
  return (
      <StoreConsumer>
        {context => {
          return (
            <Fragment>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  select
                  label="Status"
                  value={context.filters.get('status')}
                  onChange={e => context.updateFilters({
                    ...context.filters.toJS(),
                    status: e.target.value,
                    dueDate: null
                  })}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Category"
                  value={context.filters.get('category')}
                  onChange={e => context.updateFilters({...context.filters.toJS(), dueDate: null, category: e.target.value})}>
                    <MenuItem value="all">All</MenuItem>
                    {context.categories.map(item => (
                      <MenuItem value={item.get('id')} key={item.get('id')}>{item.get('name')}</MenuItem>
                    ))}
                </TextField>
                <TextField
                  value={context.filters.get('query')}
                  label="Title or Description"
                  onChange={e => context.updateFilters({...context.filters.toJS(), dueDate: null, query: e.target.value})} />
              </form>
              <Button className={classes.submitButton} onClick={() => {
                context.updateFilters({query: '', status: 'pending', category: 'all', dueDate: new Date()});
              }}>Show Overdue Tasks</Button>
            </Fragment>
          );
        }}
      </StoreConsumer>
  );
}
