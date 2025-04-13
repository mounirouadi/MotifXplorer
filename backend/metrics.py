#Nazim Belabbaci aka NazimBL
#Summer 2022

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
def get_kmers(sequence, size=6):
    return [sequence[x:x+size].lower() for x in range(len(sequence) - size + 1)]

# Set default values
kmer_size = 6
test_size = 0.3
input_file = "data_final.csv"

print("Evaluating model with k-mer size:", kmer_size)

# Load dataset
try:
    data = pd.read_csv(input_file)
    print("Data loaded successfully")
except Exception as e:
    print(f"Error loading data: {e}")
    exit(1)

# Convert sequences to k-mers
print("Converting sequences to k-mers...")
data['kmers'] = data['sequence'].apply(lambda seq: ' '.join(get_kmers(seq, kmer_size)))
data = data.drop('sequence', axis=1)

# Extract labels
y = data['label'].values

# Vectorize k-mers using CountVectorizer
print("Vectorizing k-mers...")
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(data['kmers'])

# Split dataset
print("Splitting dataset...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=7)

# Train and evaluate model
model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train, verbose=True, eval_set=[(X_test, y_test)])

y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]  # For ROC Curve

# Compute metrics
print("Computing evaluation metrics...")
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

# Save metrics
metrics = f"Accuracy: {accuracy:.3f}\nPrecision: {precision:.3f}\nRecall: {recall:.3f}\nF1 Score: {f1:.3f}\n"
print(metrics)

# Confusion Matrix - Save as Figure_1.png to maintain compatibility
print("Generating confusion matrix...")
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=np.unique(y_test), yticklabels=np.unique(y_test))
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.savefig("Figure_1.png")
plt.close()
print("Saved confusion matrix as Figure_1.png")

# ROC Curve - Save as Figure_2.png to maintain compatibility
print("Generating ROC curve...")
fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
roc_auc = auc(fpr, tpr)

plt.figure()
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic')
plt.legend(loc="lower right")
plt.savefig("Figure_2.png")
plt.close()
print("Saved ROC curve as Figure_2.png")

print("Evaluation complete")

