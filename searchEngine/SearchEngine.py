import pandas as pd
import openai
import numpy as np
import pickle
import faiss
import json
import os


def load_env_secret(filepath="./searchEngine/key.env"):
    if os.path.exists(filepath):  # Check if the file exists
        with open(filepath) as f:
            for line in f:
                if line.strip() and not line.startswith("#"):  # Skip blank lines and comments
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

# Load the secret
load_env_secret()
SECRET = os.getenv("SECRET") 


class SearchEngine:
    def __init__(self):
        self.key = SECRET
        self._titles = self.load_from_pickle("titles")
        self._oclc = self.load_from_pickle("oclc")
        self._covers = self.load_from_pickle("covers")
        self._index = self.load_from_pickle("index")
        # self._openai_client = openai.OpenAI(api_key=key)
        #openai.api_key(key)

    def load_from_pickle(self,obj):
        filename = f"./searchEngine/{obj}.pkl"
        with open(filename, "rb") as file:
            obj = pickle.load(file)
        return obj
    
    def generate_embedding(self, query):
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=query,
            api_key = self.key
        )
        embedding = response.data[0].embedding
        np_emb = np.asarray(embedding)
        return np_emb
    
    def search(self, query, k=20, d=None):
        query_embedding = self.generate_embedding(query)
        reshaped_embedding = query_embedding.reshape(1, 1536)
        if not d is None:
            distances, indices = self.radius_search(reshaped_embedding, d, k)
        elif not k is None:
            distances, indices = self._index.search(reshaped_embedding, k) 

        results = [" | " + self._titles[i]+ " | " + str(self._oclc[i]) + " | " + str(self._covers[i]) for j, i in enumerate(indices[0])]
        json_result = self.jsonify_search_result(indices[0])
        print(json_result)
        return results
    
    def radius_search(self, reshaped_embedding, d, k):
        n = self._index.ntotal  # Get the total number of vectors in the index
        if not k is None:
            n = k
        distances, indices = self._index.search(reshaped_embedding, n)
        filtered_indices = []
        filtered_distances = []
        for i in range(n):
            if distances[0][i] <= d:  # Check if the distance is below the threshold
                filtered_indices.append(indices[0][i])
                filtered_distances.append(distances[0][i])
        filtered_indices = [filtered_indices]
        return filtered_distances, filtered_indices
    
    def jsonify_search_result(self, indices):
        json_structure = [{
            "topic": "search results",
            "topic_id": "search_results",
            "sub_topic": "search results",
            "virtual_shelf_temp": 1,
            "books_in_bookcase": len(indices),
            "books": [{"OCLC": oclc, "cover_file": cover} for oclc, cover in zip(self._oclc[indices], self._covers[indices])]
        }]
        return json_structure
