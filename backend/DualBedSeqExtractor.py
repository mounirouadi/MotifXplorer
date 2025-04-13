import sys
import random
from pyfaidx import Fasta

def get_sequence(chrom, start, end, reference):
    """Extracts DNA sequence from a reference genome."""
    try:
        return reference[chrom][start:end].seq
    except KeyError:
        print(f"Warning: Chromosome {chrom} not found in reference genome.")
        return "N" * (end - start)  # Use 'N' as a placeholder

def parse_bed_file(bed_file):
    """Parses a BED file, extracting only the first 4 columns for positive regions."""
    positive_regions = []
    with open(bed_file, 'r') as file:
        for line in file:
            line = line.strip()
            if line.startswith('#') or not line:
                continue  # Ignore comments or empty lines

            fields = line.split('\t')
            if len(fields) < 3:
                continue  # Ignore malformed lines

            chrom = fields[0]
            start = int(fields[1])
            end = int(fields[2])
            name = fields[3] if len(fields) > 3 else "."

            # Ensure start < end
            if start >= end:
                print(f"Skipping malformed BED entry: {line}")
                continue

            positive_regions.append((chrom, start, end, name))
    return positive_regions

def generate_negative_examples(positive_regions, reference):
    """Generates negative BED regions while avoiding overlap with positives."""
    negative_regions = []
    genome_sizes = {chrom: len(reference[chrom]) for chrom in reference.keys()}

    for chrom, start, end, name in positive_regions:
        if chrom not in genome_sizes:
            continue  # Skip if chromosome not found

        length = end - start
        attempts = 0

        while attempts < 100:  # Prevent infinite loops
            new_start = random.randint(0, genome_sizes[chrom] - length)
            new_end = new_start + length

            # Ensure no overlap with any positive region
            if not any(s < new_end and new_start < e for c, s, e, _ in positive_regions):
                negative_regions.append((chrom, new_start, new_end, name + "_neg"))
                break

            attempts += 1

        if attempts >= 100:
            print(f"Warning: Could not find a non-overlapping negative region for {chrom}:{start}-{end}")
    return negative_regions

def write_output(bed_file, positive_regions, negative_regions, reference):
    """
    Writes the output BED file with appended sequences and label column.
    Format per line:
    chrom, start, end, name, sequence, label
    where label is 1 for positive regions and 0 for negative regions.
    """
    output_file = bed_file + '.new'
    with open(output_file, 'w') as file:
        # Write positive regions with label 1
        for chrom, start, end, name in positive_regions:
            sequence = get_sequence(chrom, start, end, reference)
            file.write(f"{chrom}\t{start}\t{end}\t{name}\t{sequence}\t1\n")
        # Write negative regions with label 0
        for chrom, start, end, name in negative_regions:
            sequence = get_sequence(chrom, start, end, reference)
            file.write(f"{chrom}\t{start}\t{end}\t{name}\t{sequence}\t0\n")
    print(f"Output written to {output_file}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python DualBedSeqExtractor.py <bed_file> <reference_genome>")
        sys.exit(1)

    bed_file = sys.argv[1]
    reference_genome = sys.argv[2]

    # Load genome reference
    reference = Fasta(reference_genome)

    # Process BED and generate negatives
    positive_regions = parse_bed_file(bed_file)
    negative_regions = generate_negative_examples(positive_regions, reference)

    # Write final output with label column
    write_output(bed_file, positive_regions, negative_regions, reference)
