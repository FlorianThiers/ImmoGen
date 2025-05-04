import re
import pandas as pd

def filter_and_sort_houses(csv_path, house_types):
    """Filter and sort houses by specific types."""
    # Load the CSV file
    df = pd.read_csv(csv_path)
    
    # Filter rows where 'titel' contains specific house types
    filtered_df = df[df['titel'].str.contains("|".join(house_types), na=False)]
    
    # Sort the filtered DataFrame by 'titel'
    sorted_df = filtered_df.sort_values(by='titel')
    
    return sorted_df

def get_unique_titles(csv_path):
    """Retrieve all unique titles from the dataset and clean them."""
    # Load the CSV file
    df = pd.read_csv(csv_path)
    
    # Get unique titles from the 'titel' column
    unique_titles = df['titel'].dropna().unique()
    
    # Remove "te koop" (with or without spaces) and strip any extra whitespace
    cleaned_titles = [re.sub(r"\s*te koop\s*", "", title, flags=re.IGNORECASE).strip() for title in unique_titles]
    
    return cleaned_titles