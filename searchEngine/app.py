import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
from SearchEngine import SearchEngine

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
searchEngine = SearchEngine() 


@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '')
    #results = searchEngine.search(query, k=20)
    bookshelves, distinct_shelves_nos = searchEngine.search(query, d=0.4)
    return jsonify({
            'bookshelves': bookshelves,
            'distinct_shelves' : distinct_shelves_nos    
        })
    #print(results)
    #return results

if __name__ == '__main__':
    app.run(debug=True)