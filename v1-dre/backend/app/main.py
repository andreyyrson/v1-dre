from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import auth, bom_controle, dre

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dextro DRE API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(bom_controle.router, prefix="/api/bom-controle", tags=["bom-controle"])
app.include_router(dre.router, prefix="/api/dre", tags=["dre"])


@app.get("/")
def root():
    return {"message": "Dextro DRE API"}
