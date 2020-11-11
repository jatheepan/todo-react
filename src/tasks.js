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
  IconButton
} from '@material-ui/core';
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  AvTimerOutlined as ClockIcon
} from '@material-ui/icons';
import moment from 'moment';
import { StoreConsumer } from "./store";

export default function Tasks() {
  const [visible, setVisible] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const classes = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 400,
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
              <List>
                {context.tasks.map((item, index) => {
                  const category = context.getCategoryById(item.get('categoryId'));
                  return(
                    <div key={item.get('id')}>
                      <ListItem style={{marginTop: 1, borderLeft: `3px solid ${category.get('color')}`}}>
                        <ListItemText
                          primary={
                            <FormControlLabel
                              control={<Checkbox color="primary" checked={item.get('status') === 'done'} onChange={() => {
                                let status = item.get('status');
                                context.toggleStatus(index, status === 'done' ? 'pending' : 'done');
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
                              {(() => {
                                const dueDate = moment(item.get('dueDate'));
                                if(dueDate.isBefore(moment())) {
                                  return (<span className={classes.metaData}><ClockIcon />Overdue</span>);
                                }
                                return (<span className={classes.metaData}><ClockIcon />Due in {dueDate.fromNow()}</span>);
                              })()}
                            </Fragment>
                          }
                        />
                        <div>
                          <ListItemSecondaryAction>
                            <IconButton><EditIcon /></IconButton>
                            <IconButton onClick={() => {
                              setSelectedTaskIndex(index);
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
                    context.removeTask(selectedTaskIndex);
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
