# Use an official Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y wget gzip graphviz && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt ./
RUN python3 -m pip install --upgrade pip && \
    pip3 install -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/reference_genomes /app/sessions

# Copy any pre-existing genome files (from the build context)
COPY reference_genomes/ /app/reference_genomes/

# Conditionally download and unzip genomes only if they don't exist
RUN [ ! -f /app/reference_genomes/hg19.fa ] && \
       wget -P /app/reference_genomes https://hgdownload.cse.ucsc.edu/goldenpath/hg19/bigZips/hg19.fa.gz && \
       gunzip /app/reference_genomes/hg19.fa.gz || true 

# Download hg38 reference genome if it doesn't exist
RUN [ ! -f /app/reference_genomes/hg38.fa ] && \
       wget -P /app/reference_genomes https://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && \
       gunzip /app/reference_genomes/hg38.fa.gz || true

# Download mm9 reference genome if it doesn't exist
RUN [ ! -f /app/reference_genomes/MM9.fa ] && \
       wget -P /app/reference_genomes https://hgdownload.soe.ucsc.edu/goldenPath/mm9/bigZips/mm9.fa.gz && \
       gunzip /app/reference_genomes/mm9.fa.gz -c > /app/reference_genomes/MM9.fa || true

# Copy the rest of the backend code
COPY . .

# Create a volume for sessions
VOLUME ["/app/sessions"]

# Expose backend port
EXPOSE 4000

# Run Flask app
CMD ["python", "server.py"]
