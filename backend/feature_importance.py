import os
import argparse
import xgboost as xgb
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split


def getKmers(sequence, size):
    """Generate k-mers from a given sequence."""
    return [sequence[x:x + size].lower() for x in range(len(sequence) - size + 1)]


def main(input_csv, top_features, kmer_size, output_dir):
    """Main function to compute and plot feature importance."""

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Load data
    print(f"Loading data from {input_csv}...")
    try:
        data = pd.read_csv(input_csv)
    except Exception as e:
        print(f"Error reading the file: {e}")
        return

    # Transform sequences into k-mers
    if 'sequence' not in data.columns or 'label' not in data.columns:
        print("Error: The input CSV must contain 'sequence' and 'label' columns.")
        return

    print("Processing k-mers...")
    data['kmers'] = data['sequence'].apply(lambda x: ' '.join(getKmers(x, kmer_size)))
    data = data.drop('sequence', axis=1)

    # Vectorize k-mers
    print("Vectorizing text...")
    cv = CountVectorizer()
    X = cv.fit_transform(data['kmers'])
    y = data['label'].values
    feature_names = cv.get_feature_names_out()

    # Split dataset
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=7)

    # Train XGBoost classifier
    print("Training XGBoost model...")
    # Create an XGBoost classifier with eval_metric set in the constructor
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='aucpr')

    # Train the model with early stopping; this should work with current XGBoost versions
    model.fit(X_train, y_train, verbose=True, eval_set=[(X_test, y_test)])

    # Compute feature importance
    importance_types = ['weight', 'cover', 'gain', 'total_gain', 'total_cover']

    for imp_type in importance_types:
        print(f"Processing feature importance: {imp_type}")

        importance = model.get_booster().get_score(importance_type=imp_type)
        sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)[:top_features]

        # Extract top features and importance values
        top_features_names = []
        top_importance_values = []

        for feature, importance_value in sorted_importance:
            try:
                # Extract index and map to feature names
                feature_idx = int(feature[1:])  # Feature names are in format 'f0', 'f1', etc.
                top_features_names.append(feature_names[feature_idx])
                top_importance_values.append(importance_value)
            except (ValueError, IndexError):
                print(f"Warning: Could not map feature {feature} to a valid index.")

        # Plot feature importance
        if top_features_names:
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.barh(range(len(top_features_names)), top_importance_values, align='center')
            ax.set_yticks(range(len(top_features_names)))
            ax.set_yticklabels(top_features_names)
            plt.xlabel('Importance')
            plt.ylabel('Feature')
            plt.title(f'Top {len(top_features_names)} {imp_type.capitalize()} Importance')

            plt.tight_layout()
            save_path = os.path.join(output_dir, f'top_{len(top_features_names)}_{imp_type}_importance.png')
            plt.savefig(save_path)
            print(f"Saved plot: {save_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate feature importance plots from k-mers.")
    parser.add_argument("--input", type=str, required=True, help="Path to input CSV file")
    parser.add_argument("--top", type=int, default=10, help="Number of top features to visualize")
    parser.add_argument("--kmer", type=int, default=6, help="K-mer size")
    parser.add_argument("--output_dir", type=str, default="feature_importance_plots", help="Directory to save plots")

    args = parser.parse_args()
    main(args.input, args.top, args.kmer, args.output_dir)
