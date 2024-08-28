from fastapi import FastAPI, File, UploadFile, HTTPException
import boto3
import io
from PyPDF2 import PdfReader, PdfWriter
import os
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 

from PIL import Image
import fitz  # de PyMuPDF


app = FastAPI()

handler = Mangum(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde este origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

class FileName(BaseModel):
    name_file: str

# Inicializa el cliente de S3
s3 = boto3.client(
    's3',
    # aws_access_key_id=os.getenv('AKIAR7HWXWENJSZRO6AW'),
    # aws_secret_access_key=os.getenv('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'),
    # region_name='us-east-1'  # Reemplaza con tu región
)

# Nombre del bucket de S3
BUCKET_NAME = 'bucket-prueba-tecnica-hache'

# Inicializa una variable global para almacenar los fragmentos
pdf_writer = PdfWriter()
combined_pdf = True
pdf_list = []

#Aqui pondremos los pdfs reeensamblados:
OUTPUT_DIR = "output_pdfs"

@app.post("/upload_fragment/")
async def upload_fragment(file: UploadFile = File(...),  # Para recibir el archivo
    ):

    global pdf_list
    try:
        file_chunk = await file.read()
        pdf_list.append(file_chunk)
        
        return {"type": 'success', 'status': '200', 'message': 'Se ha subido correctamente el fragmento del archivo pdf.' }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
@app.post("/finalize_combination/")
async def finalize_combination(data: FileName):
    global pdf_list

    if not pdf_list:
        raise HTTPException(status_code=400, detail="No chunks received")

    try:
        # Reensamblar los fragmentos en un solo archivo en memoria
        full_file = b''.join(pdf_list)
        pdf_list = []  # Limpiar los fragmentos
        # Crear un archivo PDF en memoria
        pdf_document = fitz.open(stream=io.BytesIO(full_file), filetype="pdf")
        #   Creamos un directorio si es que aún no existe
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
        # Guardarlo en un directorio
        combined_pdf_path = os.path.join(OUTPUT_DIR, data.name_file)
        pdf_document.save(combined_pdf_path)
        pdf_document.close()


        return {'type': 'success', 'status': '200', 'message': 'Se ha subido correctamente el archivo pdf.' }
    except Exception as e:
        print(e)

@app.get("/")
async def hello():

    return {"message": "Hello Worldd!-------------SI CARGA????-"}


#app = FastAPI()
