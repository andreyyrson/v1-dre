#!/bin/bash
pip install setuptools
cd backend
pip install -e .
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
