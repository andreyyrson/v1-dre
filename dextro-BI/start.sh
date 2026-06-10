#!/bin/bash
cd backend
pip install -e . > /dev/null 2>&1
uvicorn app.main:app --host 0.0.0.0 --port $PORT
