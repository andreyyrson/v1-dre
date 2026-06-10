#!/bin/bash
# Script de inicialização para o Render
export PYTHONPATH=$(pwd)/backend:$PYTHONPATH
cd backend
uvicorn app.main:app --host 0.0.0.0 --port $PORT
