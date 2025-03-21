from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# 用于存储标记日期和任务的文件
MARKED_DATES_FILE = 'marked_dates.json'
TASKS_FILE = 'tasks.json'

def load_data(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_data(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/api/marked-dates', methods=['GET'])
def get_marked_dates():
    return jsonify(load_data(MARKED_DATES_FILE))

@app.route('/api/marked-dates', methods=['POST'])
def add_marked_date():
    data = request.json
    date = data.get('date')
    color = data.get('color', '#007bff')
    
    if not date:
        return jsonify({'error': 'Date is required'}), 400
    
    marked_dates = load_data(MARKED_DATES_FILE)
    marked_dates[date] = color
    save_data(marked_dates, MARKED_DATES_FILE)
    
    return jsonify({'success': True})

@app.route('/api/marked-dates/<date>', methods=['DELETE'])
def remove_marked_date(date):
    marked_dates = load_data(MARKED_DATES_FILE)
    if date in marked_dates:
        del marked_dates[date]
        save_data(marked_dates, MARKED_DATES_FILE)
        return jsonify({'success': True})
    return jsonify({'error': 'Date not found'}), 404

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(load_data(TASKS_FILE))

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    date = data.get('date')
    title = data.get('title')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    location = data.get('location')
    
    if not date or not title:
        return jsonify({'error': 'Date and title are required'}), 400
    
    tasks = load_data(TASKS_FILE)
    if date not in tasks:
        tasks[date] = []
    tasks[date].append({
        'id': len(tasks[date]),
        'title': title,
        'start_time': start_time,
        'end_time': end_time,
        'location': location,
        'created_at': datetime.now().isoformat()
    })
    
    save_data(tasks, TASKS_FILE)
    return jsonify({'success': True})

@app.route('/api/tasks/<date>/<int:task_id>', methods=['DELETE'])
def delete_task(date, task_id):
    tasks = load_data(TASKS_FILE)
    if date in tasks:
        tasks[date] = [task for task in tasks[date] if task['id'] != task_id]
        if not tasks[date]:
            del tasks[date]
        save_data(tasks, TASKS_FILE)
        return jsonify({'success': True})
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/check-time-slot', methods=['POST'])
def check_time_slot():
    data = request.json
    date = data.get('date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if not date or not start_time or not end_time:
        return jsonify({'error': 'Date, start time, and end time are required'}), 400

    tasks = load_data(TASKS_FILE)
    date_tasks = tasks.get(date, [])

    for task in date_tasks:
        task_start = datetime.strptime(task['start_time'], '%H:%M')
        task_end = datetime.strptime(task['end_time'], '%H:%M')
        new_start = datetime.strptime(start_time, '%H:%M')
        new_end = datetime.strptime(end_time, '%H:%M')

        if (new_start < task_end and new_end > task_start):
            return jsonify({'occupied': True})

    return jsonify({'occupied': False})

if __name__ == '__main__':
    app.run(debug=True)