import pandas as pd

class BookDB:
    def __init__(self):
        bookswall = pd.read_csv("./tagScanner/data/bookswall.csv", dtype={"OCLC Number": str, "LHR Item Barcode": str})
        recommendations = pd.read_csv("./tagScanner/data/recommendationArea.csv", dtype={"OCLC Number": str, "LHR Item Barcode": str})
        db = pd.concat([bookswall, recommendations], ignore_index=True)
        db = db.rename(columns={'LHR Item Barcode': 'barcode','OCLC Number': 'oclc'})
        db = db[['barcode', 'oclc']]
        self.db = dict(zip(db['barcode'], db['oclc']))
        del bookswall, recommendations, db
        print(f"Succesfully loaded {len(self.db)} barcode/OCLC pairs")

    def get_book_oclc(self, barcode):
        return self.db[barcode]

    @staticmethod
    def transform_hex_to_barcode(hex_string):
        chars = [
            part[-2:] for part in hex_string.strip().split()
        ]
        return ''.join(c for c in ''.join(chars) if c.isdigit())