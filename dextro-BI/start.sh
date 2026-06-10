#!/bin/bash
cd backend
export PYTHONPATH=/opt/render/project/src/backend:$PYTHONPATH
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
