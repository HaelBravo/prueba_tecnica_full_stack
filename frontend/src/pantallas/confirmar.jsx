import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, Typography, Tooltip} from "@mui/material";

import React, { useState } from "react";

//  Aqui preguntamos al usuario si quiere quitar algún dicumento de los que ha subido

const Confirmar_eliminacion = (props) => {
    // ** State
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [data] = useState(props.data)
  
  
  
    const handleDelete = () => {
        //Eliminamos el elemento de la lista
        let newList = props.files.filter((item)=> item.name != data.name)
        props.setFilesList(newList)
        setOpen(false)

    
    }
  
    return (
      <>
        <Tooltip title='Eliminar asignación'>
          <IconButton size='small' sx={{ mr: 0.5 }} color='error' onClick={handleClickOpen}>
          <i class="bi bi-trash" fontSize='1.5rem'></i>
          </IconButton>
        </Tooltip>
        <Dialog
          open={open}
          keepMounted
          maxWidth='md'
          fullWidth={true}
          onClose={handleClose}
          //TransitionComponent={Transition}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle id='alert-dialog-slide-title'>
            <Typography variant='h6' component='span'> Cancelación de envío del archivo
            </Typography>
            <IconButton
              aria-label='close'
              onClick={handleClose}
              sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              <table className='table' style={{ width: "100%" }}>
                <caption style={{ textAlign: 'justify' }}>¿Desea cancelar el envío del archivo {data.name}? Podría afectar operaciones futuras</caption>
                <thead>
                  <tr>
                    <th style={{ height: 14 }}></th>
                  </tr>
                </thead>
  
              </table>
            </DialogContentText>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button variant='outlined' onClick={handleClose}>Cancelar</Button>
            <Button variant='outlined' onClick={handleDelete}>Aceptar</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
  export default Confirmar_eliminacion