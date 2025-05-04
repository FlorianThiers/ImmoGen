# Gebruik een officiële Python-image
FROM python:3.10

# Stel de werkmap in
WORKDIR /app

# Kopieer en installeer dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopieer de rest van de bestanden
COPY . .

# Start de FastAPI server correct
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

ENV PYTHONPATH=/app