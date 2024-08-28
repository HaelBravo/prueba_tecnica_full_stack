import React, { useEffect, useState } from 'react'
import {signOut, getAuth}from 'firebase/auth';
import appFirebase from '../credenciales.js'
import Confirmar_eliminacion from './confirmar.jsx';

import LinearProgress from '@mui/material/LinearProgress';


const auth = getAuth(appFirebase)


import { Alert, Box, InputAdornment, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
//import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}


const Home = ({email}) => {

  const [namefile, setNamefile] = useState('Seleccione sus archivos .pdf ');
  const [filesList, setFilesList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [open_message, setOpenMessage] = useState(false);
  const [message, setMessage] = useState({});
  useEffect(() => {
    //  Para manejar de una forma más práctica el estado de la lista de los documentos
    if (filesList.length > 0) {
    let numberOfFiles = filesList.length;
    let namefile = `${numberOfFiles} archivos seleccionados`;
    setNamefile(namefile);
    }
    else {
      setNamefile('Seleccione sus archivos .pdf ')
    }
    
  }, [filesList]);

  const handleSelectdocuments = event => {
    //  Aqui vamos guardando en una lista los documentos que va subiendo el usuario
    const newFiles = event.target.files;
    const newFilesArray = Array.from(newFiles);
    setFilesList(prevFilesList => [...prevFilesList, ...newFilesArray]);
    //console.log(filesList.length)

  }
  const fragmentDocuments = async (event) => {
    //  Fragmentamos los documentos 
    const chunkSize = 1 * 1024 * 1024; // 1 MB 
    //  Vamos a dividir la barra de carga
    let bar_length = 100 / filesList.length 
    //   Iteramos la lista de los documentos
    for (const [fileIndex, file] of Array.from(filesList).entries()) {
      const arrayBuffer = await file.arrayBuffer();
      const totalBytes = arrayBuffer.byteLength;

      //  Para ir viendo de donde a donde va cada fragmento
      let start = 0;
      let end = chunkSize;
      let fragmentNumber = 1;
      //  Por cada archivo, llenaremos un segmento de la barra; será de igual medida para todos los archivos
      let fragment_length = Math.ceil(totalBytes / chunkSize)
      let progreso = bar_length / fragment_length
      while (start < totalBytes) {
        end = Math.min(start + chunkSize, totalBytes);

        // Crear un fragmento del PDF
        const fragmentArrayBuffer = arrayBuffer.slice(start, end);
        const fragmentBlob = new Blob([fragmentArrayBuffer], {
          type: "application/pdf",
        });
        //  preparamos el fragmento
        const formData = new FormData();
        formData.append(
          "file",
          fragmentBlob,
          `fragmento_${fragmentNumber}.pdf`
        );
        formData.append("fragmentNumber", fragmentNumber.toString());
        formData.append(
          "totalFragments",
          Math.ceil(totalBytes / chunkSize).toString()
        );
        formData.append("originalFileName", file.name);

        try {
          //  Enviamos el fragmento
          await fetch("http://localhost:8000/upload_fragment/", {
            
            method: "POST",
            body: formData,
            redirect: 'follow',
          }).then(res => {
            //console.log(res.message)
            setProgress(progress + progreso)
          }
          );

        } catch (error) {
          // console.error(
          //   `Error al enviar el fragmento ${fragmentNumber}:`,
          //   error
          // );
        }
        start = end;
        fragmentNumber++;
      }
      //  Modificamos nuestra barra de subida para avisar al usuario que se van subiendo el archivo

      try {
      //  Mandamos a llamar a nuestro ensambkador una vez subidos todos los fragmentos
      await fetch("http://localhost:8000/finalize_combination/", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json"  
      },
        body: JSON.stringify({ name_file: file.name }),
        redirect: 'follow',   
      }).then(res => {

        setProgress((fileIndex+1)*bar_length)
      })
    } catch (error) {

      setMessage({type: 'error', status: 500, message: `Ocurrió un error al enviar el documento ${file.name}` })
    }

    }
    setProgress(100)
    //  La barra de carga debe estar al cien y reseteamos la lista de documentos
    setTimeout(()=> {
      setProgress(0)
      setOpenMessage(true)
      setFilesList([])
    }, 1500)
  };

  return (
    <div className="container">
      <Snackbar
        open={open_message}
        onClose={() => setOpenMessage(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert elevation={3} variant='filled' severity={message.type} onClose={() => setOpenMessage(false)} >
          ¡Tus documentos han sido enviados con éxito!
        </Alert>
      </Snackbar>
      <div className="row align-items-center height 10%">
        <div className="col-md-10">
          <h4 className="text-center">¡BIENVENIDO: {email}!</h4>
        </div>
        <div
          className="col-md-2 d-flex justify-content-center align-items-center"
          style={{ height: "100px" }}
        >
          <button
            className="button-login"
            onClick={() => {
              signOut(auth);
            }}
          >
            Salir
          </button>
        </div>
      </div>
      <div className="card card-body shadow">
        <div className="row align-items-center height 75%">
          <div className="col-md-10 d-flex ">
            <form method="post" encType="multipart/form-data">
              <div>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                    endAdornment: (
                      <div>
                        <Button
                          sx={{
                            marginTop: "35%",
                            marginLeft: "15%",
                            backgroundColor: "rgb(37, 185, 211)",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "20px",
                            fontSize: "16px",
                            cursor: "pointer",
                            marginBottom: "30px",
                            height: "45px",
                            "&:hover": {
                              backgroundColor: "rgb(27, 165, 191)", 
                            },
                          }}
                          component="label"
                          size="md"
                        >
                          <i class="bi bi-arrow-bar-up fs-4"> </i>
                          <input
                            hidden
                            accept=".pdf"
                            type="file"
                            name="pdf"
                            multiple
                            onChange={handleSelectdocuments}
                          />
                        </Button>
                      </div>
                    ),
                  }}
                  midWidth
                  placeholder="Selecciona tus archivos .pdf"
                  size="md"
                  variant="outlined"
                  value={namefile}
                />
              </div>
            </form>
          </div>
          <div className="col-md-2 d-flex justify-content-center align-items-center">
            <Button
              sx={{
                marginTop: "20%",
                backgroundColor: "rgb(37, 185, 211)",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "20px",
                fontSize: "16px",
                cursor: "pointer",
                marginBottom: "30px",
                height: "45px",
                "&:hover": {
                  backgroundColor: "rgb(27, 165, 191)", 
                },
              }}
              component="label"
              size="md"
              disabled={filesList.length == 0}
              onClick={fragmentDocuments}
            >
              <i class="bi bi-send"></i>
              Enviar
            </Button>
          </div>
        </div>
        <div>
          {progress != 0 ?
        <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
    :
    null 
    }
          {filesList.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nombre del documento</TableCell>
                  <TableCell align="center"> Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filesList.map((r, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{r.name}</TableCell>
                    <TableCell align="center">
                      <Confirmar_eliminacion
                        data={r}
                        setFilesList={setFilesList}
                        files={filesList}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Home