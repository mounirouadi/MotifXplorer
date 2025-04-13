import argparse
import xgboost as xgb
import pandas as pd
import matplotlib.pyplot as plt
import graphviz
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split


def get_kmers(sequence, size):
    return [sequence[x:x + size].lower() for x in range(len(sequence) - size + 1)]


def main(input_csv, kmer_size):
    # Load dataset
    try:
        data = pd.read_csv(input_csv)
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return

    if 'sequence' not in data.columns or 'label' not in data.columns:
        print("Error: CSV must contain 'sequence' and 'label' columns.")
        return

    # Generate k-mers
    data['kmers'] = data['sequence'].apply(lambda x: get_kmers(x, kmer_size))
    data.drop(columns=['sequence'], inplace=True)

    # Convert k-mers to text
    kmer_texts = [" ".join(kmers) for kmers in data['kmers']]

    # Extract labels
    y_data = data['label'].values

    # Bag of Words model
    cv = CountVectorizer()
    X = cv.fit_transform(kmer_texts)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y_data, test_size=0.3, random_state=7)


    classifier =  xgb.XGBClassifier(use_label_encoder=False, eval_metric='aucpr')
    classifier.fit(X_train, y_train, verbose=True, eval_set=[(X_test, y_test)])

    # Get feature importance
    bst = classifier.get_booster()
    for importance_type in ('weight', 'gain', 'cover', 'total_gain', 'total_cover'):
        print(f'{importance_type}:', bst.get_score(importance_type=importance_type))

    # Get feature names
    feature_names = cv.get_feature_names_out()

    # Generate tree graph
    dot_data = xgb.to_graphviz(classifier, num_trees=0, rankdir='UT', yes_color='#0000FF', no_color='#FF0000').source
    for i, feature_name in enumerate(feature_names):
        dot_data = dot_data.replace(f'f{i}', feature_name)

    graph = graphviz.Source(dot_data)
    graph.render(filename='importance_tree', format='png')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate k-mer importance tree from sequence data.")
    parser.add_argument("input", type=str, help="Path to input CSV file.")
    parser.add_argument("--kmer_size", type=int, default=6, help="Size of k-mers (default: 6)")

    args = parser.parse_args()
    main(args.input, args.kmer_size)
