import pandas as pd
import os

def load_delivery_data(csv_path=None):
    """
    Load delivery data from CSV file.
    Args:
        csv_path (str): Path to the CSV file. If None, uses default data folder.
    Returns:
        pd.DataFrame: Loaded data
    """
    if csv_path is None:
        csv_path = os.path.join(os.path.dirname(__file__), '../../data/delivery_five_cities_tanzania.csv')
    return pd.read_csv(csv_path)

if __name__ == "__main__":
    df = load_delivery_data()
    print(df.head())
