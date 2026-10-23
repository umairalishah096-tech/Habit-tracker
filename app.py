from flask import Flask, jsonify, request, send_from_directory
import csv
import os

app = Flask(__name__, static_folder='.', static_url_path='')

HABITS_CSV = 'habits.csv'
LOGS_CSV = 'logs.csv'

def ensure_csv_exists():
    if not os.path.exists(HABITS_CSV):
        with open(HABITS_CSV, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'title', 'time', 'goal', 'category', 'color', 'icon'])
    if not os.path.exists(LOGS_CSV):
        with open(LOGS_CSV, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['habit_id', 'date', 'status'])

def read_data():
    ensure_csv_exists()
    habits_dict = {}
    
    with open(HABITS_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            habits_dict[row['id']] = {
                'id': row['id'],
                'title': row['title'],
                'time': row.get('time', ''),
                'goal': int(row['goal']) if row['goal'] else 0,
                'category': row['category'],
                'color': row['color'],
                'icon': row['icon'],
                'logs': {}
            }
            
    with open(LOGS_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['habit_id'] in habits_dict:
                habits_dict[row['habit_id']]['logs'][row['date']] = row['status']
                
    return list(habits_dict.values())

def write_data(habits):
    with open(HABITS_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'title', 'time', 'goal', 'category', 'color', 'icon'])
        for h in habits:
            writer.writerow([h.get('id'), h.get('title'), h.get('time', ''), h.get('goal'), h.get('category'), h.get('color'), h.get('icon')])
            
    with open(LOGS_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['habit_id', 'date', 'status'])
        for h in habits:
            for date, status in h.get('logs', {}).items():
                writer.writerow([h.get('id'), date, status])

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(read_data())

@app.route('/api/data', methods=['POST'])
def save_data():
    data = request.json
    if not isinstance(data, list):
        return jsonify({"error": "Expected a list of habits"}), 400
    write_data(data)
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
