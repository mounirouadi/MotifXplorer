import argparse
import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import xgboost as xgb
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_curve, auc, confusion_matrix
)
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer

# Function to generate k-mers
def get_kmers(sequence, size):
    return [sequence[x:x+size].lower() for x in range(len(sequence) - size + 1)]

# Function to evaluate the model and compute metrics
def evaluate_model(X_train, X_test, y_train, y_test, output_dir):
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]  # For ROC Curve

    # Compute metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    # Save metrics
    metrics = f"Accuracy: {accuracy:.3f}\nPrecision: {precision:.3f}\nRecall: {recall:.3f}\nF1 Score: {f1:.3f}\n"
    with open(os.path.join(output_dir, "metrics.txt"), "w") as f:
        f.write(metrics)

    print(metrics)

    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=np.unique(y_test), yticklabels=np.unique(y_test))
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Confusion Matrix")
    plt.savefig(os.path.join(output_dir, "confusion_matrix.png"))
    plt.close()

    # ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    roc_auc = auc(fpr, tpr)

    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic')
    plt.legend(loc="lower right")
    plt.savefig(os.path.join(output_dir, "roc_curve.png"))
    plt.close()

    print(f"Plots saved in {output_dir}")

# Main function to handle argument parsing and execution
def main():
    parser = argparse.ArgumentParser(description="Evaluate XGBoost model using k-mers features.")
    parser.add_argument("--input", type=str, required=True, help="Path to the input CSV file.")
    parser.add_argument("--kmer_size", type=int, default=6, help="Size of k-mers (default: 6).")
    parser.add_argument("--test_size", type=float, default=0.3, help="Test split ratio (default: 0.3).")
    parser.add_argument("--output_dir", type=str, default="output", help="Directory to save results (default: output).")

    args = parser.parse_args()

    # Ensure output directory exists
    os.makedirs(args.output_dir, exist_ok=True)

    # Load dataset
    try:
        data = pd.read_csv(args.input)
    except FileNotFoundError:
        print(f"Error: File {args.input_csv} not found.")
        return
    except pd.errors.EmptyDataError:
        print("Error: CSV file is empty.")
        return

    # Ensure the sequence column exists
    if "sequence" not in data.columns:
        print("Error: The input CSV must contain a 'sequence' column.")
        return

    # Convert sequences to k-mers
    data['kmers'] = data['sequence'].apply(lambda seq: get_kmers(seq, args.kmer_size))
    data.drop(columns=['sequence'], inplace=True)

    # Convert k-mers to text format
    kmers_text = [' '.join(kmer) for kmer in data['kmers']]

    # Extract labels
    y = data.iloc[:, 0].values

    # Vectorize k-mers using CountVectorizer
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(kmers_text)

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=args.test_size, random_state=7)

    # Evaluate model
    evaluate_model(X_train, X_test, y_train, y_test, args.output_dir)

if __name__ == "__main__":
    main()
