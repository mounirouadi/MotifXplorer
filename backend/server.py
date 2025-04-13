from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import base64
import subprocess
import uuid
import shutil
from datetime import datetime
import threading
import time

app = Flask(__name__)

MEGABYTE = (2 ** 10) ** 2
app.config['MAX_CONTENT_LENGTH'] = None
# Max number of fields in a multi part form (I don't send more than one file)
# app.config['MAX_FORM_PARTS'] = ...
app.config['MAX_FORM_MEMORY_SIZE'] = 50 * MEGABYTE

# Get the absolute path of the backend directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

# Define absolute paths for reference genomes
REFERENCE_DIR = os.path.join(BACKEND_DIR, 'reference_genomes')
chr_dict = {
    '1': os.path.join(REFERENCE_DIR, "hg19.fa"),
    '2': os.path.join(REFERENCE_DIR, "hg38.fa"),
    '3': os.path.join(REFERENCE_DIR, "MM9.fa")
}

# Create a directory for storing all session data
SESSIONS_DIR = os.path.join(BACKEND_DIR, 'sessions')
if not os.path.exists(SESSIONS_DIR):
    os.makedirs(SESSIONS_DIR)

# Dictionary to track active sessions and their last access time
active_sessions = {}

CORS(app)

def create_session_directory():
    """Create a unique directory for a session and return its path"""
    session_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    session_dir = os.path.join(SESSIONS_DIR, f"{session_id}_{timestamp}")
    os.makedirs(session_dir)
    active_sessions[session_dir] = time.time()
    return session_dir

def save_base64_file(base64_data, filename, session_dir):
    """Save a base64 encoded file in the session directory"""
    data_parts = base64_data.split(',')
    file_data_base64 = data_parts[1]
    file_data_bytes = base64.b64decode(file_data_base64 + '==')
    
    file_path = os.path.join(session_dir, filename)
    with open(file_path, 'wb') as file:
        file.write(file_data_bytes)
    return file_path

def cleanup_session(session_dir):
    """Clean up session directory after processing"""
    try:
        if session_dir in active_sessions:
            del active_sessions[session_dir]
        shutil.rmtree(session_dir)
    except Exception as e:
        print(f"Error cleaning up session directory: {e}")

def cleanup_old_sessions():
    """Background thread to clean up old sessions"""
    while True:
        current_time = time.time()
        # Clean up sessions older than 30 minutes
        for session_dir in list(active_sessions.keys()):
            if current_time - active_sessions[session_dir] > 1800:  # 30 minutes
                cleanup_session(session_dir)
        time.sleep(300)  # Check every 5 minutes

# Start the cleanup thread
cleanup_thread = threading.Thread(target=cleanup_old_sessions, daemon=True)
cleanup_thread.start()

@app.route('/process', methods=['POST'])
def process():
    try:
        # Create a unique session directory
        session_dir = create_session_directory()
        
        bed = request.form.get('bedFile', '')
        chr_ref = request.form.get('referenceGenome', '')
        files_data = request.form.getlist('files')
        
        if not files_data:
            return jsonify({"error": "No files provided"}), 400

        # Verify reference genome exists
        reference_genome = chr_dict.get(chr_ref)
        if not reference_genome or not os.path.exists(reference_genome):
            return jsonify({"error": f"Reference genome not found: {chr_ref}"}), 400

        # Save the first file (positive)
        positive_file = save_base64_file(files_data[0], 'positive.bed', session_dir)
        
        # Get absolute paths for the Python scripts
        bed_seq_extractor = os.path.join(BACKEND_DIR, 'bedSeqExtractor.py')
        dual_bed_seq_extractor = os.path.join(BACKEND_DIR, 'DualBedSeqExtractor.py')
        data_labeling = os.path.join(BACKEND_DIR, 'data_labeling.py')
        
        # If we have a second file (negative) and bedFile is 2 (positive and negative)
        if bed == '2' and len(files_data) > 1:
            negative_file = save_base64_file(files_data[1], 'negative.bed', session_dir)
            # Use bedSeqExtractor.py for dual file processing
            print("Processing with both positive and negative files")
            subprocess.run(['python', bed_seq_extractor, positive_file, negative_file, reference_genome], 
                         cwd=session_dir, check=True)
        else:
            # Use DualBedSeqExtractor.py for single file processing
            print("Processing with positive file only, generating negative samples")
            subprocess.run(['python', dual_bed_seq_extractor, positive_file, reference_genome], 
                         cwd=session_dir, check=True)

        # Run data_labeling.py
        output_path = os.path.join(session_dir, 'data_final.csv')
        subprocess.run(['python', data_labeling, f'{positive_file}.new', output_path], 
                     cwd=session_dir, check=True)
      
        # Create response with the processed data
        with open(output_path, 'rb') as file:
            file_data = file.read()

        file_data_base64 = base64.b64encode(file_data).decode('utf-8')
        response = jsonify({
            "name": "data_final.csv",
            "file": f"data:text/csv;charset=utf-8;base64,{file_data_base64}",
            "session_dir": session_dir  # Include session directory in response
        })
        
        # Update last access time
        active_sessions[session_dir] = time.time()
        return response
        
    except Exception as e:
        # Clean up the session directory in case of error
        if 'session_dir' in locals():
            cleanup_session(session_dir)
        return jsonify({"error": str(e)}), 500

@app.route('/kmer', methods=['POST'])
def kmer():
    try:
        session_dir = request.form.get('session_dir')
        kmer_size = request.form.get('kmer', '6')  # Default to 6 if not provided
        
        if not session_dir or not os.path.exists(session_dir):
            return jsonify({"error": "Session directory not found"}), 400
            
        # Update last access time
        active_sessions[session_dir] = time.time()
        
        print(f"Running model training and evaluation with k-mer size: {kmer_size}")
        
        # Train the XGBoost model
        xgb_classifier = os.path.join(BACKEND_DIR, 'xgb_kmer_classifier.py')
        model_output = os.path.join(session_dir, 'xgb_model.json')
        
        # Run the XGBoost classifier
        subprocess.run([
            'python', xgb_classifier, 
            '--data', os.path.join(session_dir, 'data_final.csv'),
            '--kmer', kmer_size,
            '--model_out', model_output
        ], cwd=session_dir, check=True)
        
        # Run the evaluation script to generate confusion matrix and ROC curve
        evaluate_script = os.path.join(BACKEND_DIR, 'evaluate_model.py')
        output_dir = os.path.join(session_dir, 'results')
        os.makedirs(output_dir, exist_ok=True)
        
        subprocess.run([
            'python', evaluate_script,
            '--input', os.path.join(session_dir, 'data_final.csv'),
            '--kmer_size', kmer_size,
            '--output_dir', output_dir
        ], cwd=session_dir, check=True)

        # Rename output files to match what frontend expects
        if os.path.exists(os.path.join(output_dir, 'confusion_matrix.png')):
            shutil.copy(
                os.path.join(output_dir, 'confusion_matrix.png'),
                os.path.join(session_dir, 'Figure_1.png')
            )
        
        if os.path.exists(os.path.join(output_dir, 'roc_curve.png')):
            shutil.copy(
                os.path.join(output_dir, 'roc_curve.png'),
                os.path.join(session_dir, 'Figure_2.png')
            )

        # Read the generated image files
        with open(os.path.join(session_dir, 'Figure_1.png'), 'rb') as file:
            file_data1 = file.read()
        with open(os.path.join(session_dir, 'Figure_2.png'), 'rb') as file:
            file_data2 = file.read()

        file_data_base641 = base64.b64encode(file_data1).decode('utf-8')
        file_data_base642 = base64.b64encode(file_data2).decode('utf-8')
        
        response = jsonify({
            "image1": "data:image/png;base64," + file_data_base641,
            "image2": "data:image/png;base64," + file_data_base642 
        })
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis', methods=['POST'])
def analysis():
    try:
        session_dir = request.form.get('session_dir')
        features = request.form.get('features', '10')  # Default to 10 if not provided
        types = request.form.get('types', ['weight', 'gain', 'cover', 'total_gain', 'total_cover'])
        
        if not session_dir or not os.path.exists(session_dir):
            return jsonify({"error": "Session directory not found"}), 400
            
        # Update last access time
        active_sessions[session_dir] = time.time()
        
        print(f"Generating Post Analysis Report with top {features} features")
        
        # Run feature importance analysis
        feature_importance_script = os.path.join(BACKEND_DIR, 'feature_importance.py')
        output_dir = os.path.join(session_dir, 'feature_plots')
        os.makedirs(output_dir, exist_ok=True)
        
        subprocess.run([
            'python', feature_importance_script,
            '--input', os.path.join(session_dir, 'data_final.csv'),
            '--top', features,
            '--kmer', '6',  # Use default kmer size
            '--output_dir', output_dir
        ], cwd=session_dir, check=True)
        
        # Generate importance tree visualization
        importance_tree_script = os.path.join(BACKEND_DIR, 'importance_tree.py')
        subprocess.run([
            'python', importance_tree_script,
            os.path.join(session_dir, 'data_final.csv'),
            '--kmer_size', '6'  # Use default kmer size
        ], cwd=session_dir, check=True)

        # Copy files to names expected by frontend
        importance_types = ['weight', 'cover', 'gain', 'total_gain', 'total_cover']
        for imp_type in importance_types:
            src = os.path.join(output_dir, f'top_{features}_{imp_type}_importance.png')
            dst = os.path.join(session_dir, f'top_10_feature_{imp_type}_importance.png')
            if os.path.exists(src):
                shutil.copy(src, dst)

        # Read all generated images
        images = {}
        image_files = [
            'top_10_feature_cover_importance.png',
            'top_10_feature_gain_importance.png',
            'top_10_feature_total_cover_importance.png',
            'top_10_feature_total_gain_importance.png',
            'top_10_feature_weight_importance.png',
            'importance_tree.png'
        ]
        
        for img_file in image_files:
            try:
                with open(os.path.join(session_dir, img_file), 'rb') as file:
                    images[img_file] = base64.b64encode(file.read()).decode('utf-8')
            except FileNotFoundError:
                print(f"Warning: File {img_file} not found in session directory")
                continue

        response = jsonify({
            "image1": "data:image/png;base64," + images.get('top_10_feature_cover_importance.png', ''),
            "image2": "data:image/png;base64," + images.get('top_10_feature_gain_importance.png', ''),
            "image3": "data:image/png;base64," + images.get('top_10_feature_total_cover_importance.png', ''),
            "image4": "data:image/png;base64," + images.get('top_10_feature_total_gain_importance.png', ''),
            "image5": "data:image/png;base64," + images.get('top_10_feature_weight_importance.png', ''),
            "tree": "data:image/png;base64," + images.get('importance_tree.png', '')
        })
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=4000, host='0.0.0.0')
