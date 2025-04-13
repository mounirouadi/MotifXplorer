import sys
import csv
import os

def create_csv(bed_file, output_csv):
    """Reads a BED file and converts it into a labeled CSV file for ML processing."""
    if not os.path.exists(bed_file):
        print(f"Error: File {bed_file} not found.")
        sys.exit(1)

    data = []  # (sequence, label) pairs

    with open(bed_file, 'r') as file:
        for line in file:
            line = line.strip()
            if line.startswith('#') or not line:
                continue

            fields = line.split('\t')
            #fields: chrom, start, end, name, sequence, label
            if len(fields) < 6:
                print(f"Skipping malformed line: {line}")
                continue

            sequence = fields[4]
            label = fields[5]

            if sequence and label in {"0", "1"}:
                data.append((sequence, label))

    if not data:
        print("Warning: No valid sequences found in the BED file.")
        sys.exit(1)

    with open(output_csv, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['sequence', 'label'])
        writer.writerows(data)

    print(f"CSV file created: {output_csv}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python data_labeling.py <bed_file> <output_csv>")
        sys.exit(1)

    bed_file = sys.argv[1]
    output_csv = sys.argv[2]

    create_csv(bed_file, output_csv)
