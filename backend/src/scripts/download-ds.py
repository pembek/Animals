import os
from kaggle.api.kaggle_api_extended import KaggleApi

dataset = 'sharansmenon/animals141'
out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../assets/animals141'))

os.makedirs(out_dir, exist_ok=True)

api = KaggleApi()
api.authenticate()
api.dataset_download_files(dataset, path=out_dir, unzip=True)
print(f"Dataset indirildi ve açıldı: {out_dir}")