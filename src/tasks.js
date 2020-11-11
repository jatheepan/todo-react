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
import { StoreConsumer } from "./store";

export default function Tasks() {
  const [visible, setVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
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
                {context.filteredTasks.map((item, index) => {
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
                            <IconButton><EditIcon /></IconButton>
                            <IconButton onClick={() => {
                              setSelectedTaskId(item.get('id'));
                              setVisible(true);
                            }}><DeleteIcon /></IconButton>
                          </ListItemSecondaryAction>
                        </div>
                      </ListItem>
                    </div>
                  );
                })}
              </List>
              <Dialog
                open={visible}
                onClose={() => setVisible(false)}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Do you want to delete this task?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={() => setVisible(false)} color="primary">
                    No
                  </Button>
                  <Button onClick={() => {
                    setVisible(false);
                    context.removeTask(selectedTaskId);
                  }} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Fragment>
          );
        }}
      </StoreConsumer>
    </div>
  );
}

function SearchForm(props) {
  const classes = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%'
      }
    }
  }))();
  return (
      <StoreConsumer>
        {context => {
          return (
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                select
                label="Status"
                value={context.filters.get('status')}
                onChange={e => context.updateFilter('status', e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
              </TextField>
              <TextField
                select
                label="Category"
                value={context.filters.get('category')}
                onChange={e => context.updateFilter('category', e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  {context.categories.map((item, index) => {
                    return(
                      <MenuItem value={item.get('id')} key={item.get('id')}>{item.get('name')}</MenuItem>
                    );
                  })}
              </TextField>
              <TextField
                id="standard-basic"
                label="Title or Description"
                onChange={e => context.updateFilter('query', e.target.value)} />
            </form>
          );
        }}
      </StoreConsumer>
  );
}
