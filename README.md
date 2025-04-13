# 🧬 MotifXplore: Genomic Peak Analysis Web Tool

## 📖 Description
**MotifXplore** is a **user-friendly platform** designed for **non-machine learning professionals** to analyze **ChIP-seq peaks** and gain insights into **DNA sequences** associated with those peaks.  

This web tool provides a **seamless experience** for researchers working with **genomic data**, enabling them to perform **XGBoost-based analysis** and discover significant **DNA sequence patterns** without extensive machine learning expertise.

---

## 🚀 Features:

✅ **Genome Selection**  
   - Choose from a variety of reference genomes, including `hg19`, `hg38`, `mm9`, and more.  

✅ **Positive Case Analysis**  
   - Upload a **BED file** containing **ChIP-seq peaks** as **positive examples** for analysis.  

✅ **Negative Example Generation**  
   - Automatically generate **negative examples** by randomly selecting genomic regions **based on the uploaded positive BED file**.  
   - Alternatively, users can **upload their own** negative BED file.  

✅ **XGBoost Analysis**  
   - Perform **XGBoost-based classification** to identify patterns and classify DNA sequences associated with the peaks.  

✅ **Top Signature DNA Sequences**  
   - Display the **top signature DNA sequences** identified by the **XGBoost model**, providing valuable insights into underlying genomic **regulatory elements**.  

✅ **Comprehensive Visualization**  
   - View **confusion matrix** and **ROC curves** to assess model performance.
   - Explore **feature importance** across multiple metrics to understand the significance of different DNA motifs.
   - Examine the **decision tree** to visualize the model's classification process.

---

## 🔬 Why Use MotifXplore?
By providing an **intuitive interface** and leveraging **machine learning techniques**, MotifXplore empowers **researchers without extensive ML expertise** to:  

🔹 **Explore** and **uncover hidden patterns** in **ChIP-seq peak data**  
🔹 **Simplify** the analysis process and **accelerate discoveries**  
🔹 **Enhance understanding** of **genomic regulatory elements**  

---

## 🛠️ Project Structure

The project consists of two main components:

### Frontend
- React-based web interface for uploading files and visualizing results
- Intuitive workflow with step-by-step analysis process
- Interactive visualizations of model outputs

### Backend
- Flask server for processing genomic data
- Sequence extraction from BED files
- Machine learning analysis with XGBoost
- Feature importance analysis and visualization

---

## 📋 Analysis Workflow

1. **Upload Data**: 
   - Select reference genome
   - Upload positive BED file containing ChIP-seq peaks
   - Optionally upload negative BED file or let the system generate negative samples

2. **Process Sequences**:
   - Sequences are extracted from the reference genome based on BED coordinates
   - Data is labeled with positive and negative classes
   - K-mer representation of sequences is generated

3. **Model Training & Evaluation**:
   - XGBoost classifier is trained on k-mer features
   - Model performance is evaluated with metrics like accuracy, precision, recall, and F1 score
   - Confusion matrix and ROC curve visualizations are provided

4. **Feature Importance Analysis**:
   - Identify the most significant k-mers contributing to classification
   - Visualize importance across different metrics (weight, gain, cover, etc.)
   - Explore the decision tree to understand the classification process

---

## 🖥️ Technical Implementation

### Sequence Processing
- BED files parsing and sequence extraction
- K-mer generation for feature representation
- Data labeling for machine learning

### Machine Learning
- K-mer vectorization with Bag of Words model
- XGBoost classifier training and optimization
- Cross-validation for performance assessment

### Visualization
- Feature importance plots highlighting significant motifs
- Interactive decision tree visualization
- Performance metrics and evaluation curves

---

## 📦 Installation & Setup

### Prerequisites
- Docker and Docker Compose

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MotifXplore.git
   cd MotifXplore
   ```

2. Start the application with Docker Compose:
   ```bash
   docker compose up -d --build
   ```

3. Access the web interface at:
   ```
   http://localhost:3000
   ```

### Development Setup
For local development without Docker:

1. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Run the backend server:
   ```bash
   cd backend
   python server.py
   ```

4. Run the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

---

## 🧪 Reference Genomes

The tool comes with support for the following reference genomes:
- hg19 (Human Genome version 19)
- hg38 (Human Genome version 38)
- mm9 (Mouse Genome version 9)

You can add additional reference genomes by placing them in the `backend/reference_genomes` directory.

