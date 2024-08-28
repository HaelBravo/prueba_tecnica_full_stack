
-----------     PROYECTO FULL STACK DE LA PRUEBA TÉCNICA ----------------


##  Descripción

En este proyecto se realiza una aplicación full stack (forntend y backend) de una aplicación en la que, por el lado del frontend, hay una página de login y registro en donde el usuario inicia sesión y se identifica. Después, ingresa a una pantalla en la que sube documentos de tipo .pdf (uno o varios) y los sube a la nube. 
Cada uno de estos documentos se suben en fragmentos, y al termino de la carga de todos los fragmentos de un documento, se reensambla en el backend y se envía a un bucket en S3 por medio de API Gateway que dispara una función lambda.

En la función lambda se encuentran las API's que reciben los fragmentos de cada archivo pdf y lo reensamblan, así como la que envía el documento reensamblado al bucket.

### Frontend
- **Ubicación**: `/frontend`
- **Tecnología**: React y Vite

### Backend
- **Ubicación**: `/backend`
- **Tecnología**: FastAPI y Python

## Requisitos

Asegúrese de tener los siguientes requisitos instalados en tu sistema:

- Python 3.12
- Pip (gestor de paquetes de Python)

## Configuración del Frontend

1.- ```bash
    cd frontend (Navegue al directorio de la parte del frontend)
2.- ```bash
    npm install (Instale las dependencias que se usarán en el proyecto)
3.- ```bash
    npm run dev (Arranca el proyecto de forma local)


## Configuración del Backend

1.- ```bash
    cd backend (Navegue al directorio de la parte del backend)
2.- ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    (Se crea y activa un entorno virtual)
3.- ```bash
    pip install -r requirements.txt
4.- ```bash
    uvicorn main:app --reload (Inicia el servidor de desarrollo)
5.- ```bash
    pip install PyMuPDF
    (Opcional, ya que al no aparecer en requirements, puede presentar fallas)


