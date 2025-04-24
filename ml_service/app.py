from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)

@app.route('/suggest-connections', methods=['POST'])
def suggest_connections():
    data = request.json
    all_users = data['allUsers']
    current_user = data['currentUser']
    
    current_vector = np.array(current_user['vector']).reshape(1, -1)
    user_vectors = [np.array(u['vector']) for u in all_users]
    user_ids = [u['_id'] for u in all_users]

    similarities = cosine_similarity(current_vector, user_vectors)[0]
    scored_users = sorted(zip(user_ids, similarities), key=lambda x: -x[1])

    top_suggestions = [uid for uid, score in scored_users if uid not in current_user['exclude']][:5]
    return jsonify(top_suggestions)

if __name__ == '__main__':
    app.run(port=5000)
