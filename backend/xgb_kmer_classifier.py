import pickle
import xgboost as xgb
import pandas as pd
import argparse
import logging
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split, cross_val_score

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def get_kmers(sequence, size):
    """Extract k-mers from a sequence."""
    return [sequence[x:x + size].lower() for x in range(len(sequence) - size + 1)]


def load_and_preprocess_data(data_file, kmer_size):
    """Load the CSV data and replace sequence column with space-separated k-mers."""
    try:
        data = pd.read_csv(data_file)
    except Exception as e:
        logging.error(f"Error reading {data_file}: {e}")
        raise

    # Create kmers column
    data['kmers'] = data['sequence'].apply(lambda x: ' '.join(get_kmers(x, kmer_size)))
    data = data.drop('sequence', axis=1)

    logging.info("Data loaded and preprocessed.")
    return data


def vectorize_texts(kmer_texts, vectorizer_path='vectorizer.pickle'):
    """Convert k-mer texts to a Bag-of-Words matrix and save the vectorizer."""
    cv = CountVectorizer()
    X = cv.fit_transform(kmer_texts)
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(cv, f)
    logging.info(f"Vectorizer saved to {vectorizer_path}")
    return X


def train_and_evaluate_model(X, y, seed=7, test_size=0.3):
    """Train an XGBoost classifier and evaluate using cross-validation."""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=seed)

    # Create an XGBoost classifier with eval_metric set in the constructor
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='aucpr')

    # Train the model with early stopping; this should work with current XGBoost versions
    model.fit(X_train, y_train, verbose=True, eval_set=[(X_test, y_test)])

    # 10-fold cross validation
    scores = cross_val_score(model, X, y, cv=10)
    logging.info("Cross-validation scores over 10 folds:")
    logging.info(scores)
    logging.info("Mean CV score: %.4f", scores.mean())

    return model


def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Train an XGBoost model on k-mer features extracted from sequences.")
    parser.add_argument("--data", type=str, default="data_final.csv", help="Path to the input CSV file.")
    parser.add_argument("--kmer", type=int, default=6, help="Size of the k-mer (4-10).")
    parser.add_argument("--model_out", type=str, default="xgb_model.json", help="Filename to save the trained model.")
    args = parser.parse_args()

    # Load and preprocess data
    data = load_and_preprocess_data(args.data, args.kmer)
    kmer_texts = list(data['kmers'])

    # Vectorize k-mer texts
    X = vectorize_texts(kmer_texts)

    # Prepare labels (assumes label column is the first column)
    # Here, if your CSV has multiple columns, adjust index or use column name 'label'
    y = data['label'].values

    # Train and evaluate model
    model = train_and_evaluate_model(X, y)

    # Save model
    model.save_model(args.model_out)
    logging.info(f"Model saved to {args.model_out}")


if __name__ == "__main__":
    main()
