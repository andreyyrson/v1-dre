#!/bin/bash
cd backend
pip install openpyxl>=3.1.2
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
