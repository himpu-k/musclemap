import * as React from 'react';
import Button from '@mui/material/Button';
import { Tooltip, IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import InfoIcon from '@mui/icons-material/Info';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MoreInfoPopUp = ({ exercise }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    
    <React.Fragment>
        <Tooltip title="More info">
          <IconButton onClick={handleClickOpen}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{exercise.exercises[0].name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          <span>Equipment: {exercise.equipment.map((equip) => equip.name).join(', ')}</span>
          </DialogContentText>

          {/* Display images if available */}
          {exercise.images.length > 0 && (
              <div>
                <h5>Images:</h5>
                <img
                  src={exercise.images[0].image}
                  alt={`Exercise ${exercise.exercises[0].name}`}
                  width="150"
                  style={{ marginRight: '10px' }}
                />
              </div>
            )}
          
          {/* Display only the first video if available*/}
          {exercise.videos.length > 0 && (
              <div>
                <h5>Video:</h5>
                <video width="320" height="240" controls>
                  <source src={exercise.videos[0].video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default MoreInfoPopUp