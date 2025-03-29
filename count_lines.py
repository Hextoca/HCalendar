import os

# Define the file paths
file_paths = [
    r'd:\前\calendar-app\frontend\src\components\Sidebar.jsx',
    r'd:\前\calendar-app\frontend\src\components\Sidebar.css',
    r'd:\前\calendar-app\frontend\src\setupTests.js',
    r'd:\前\calendar-app\frontend\src\reportWebVitals.js',
    r'd:\前\calendar-app\frontend\src\main.jsx',
    r'd:\前\calendar-app\frontend\src\index.js',
    r'd:\前\calendar-app\frontend\src\components\CalendarViews.jsx',
    r'd:\前\calendar-app\frontend\src\components\CalendarViews.css',
    r'd:\前\calendar-app\frontend\src\components\Calendar.jsx',
    r'd:\前\calendar-app\frontend\src\components\PomodoroClock.jsx',
    r'd:\前\calendar-app\frontend\src\components\PomodoroClock.css',
    r'd:\前\calendar-app\frontend\src\components\TodoList.jsx',
    r'd:\前\calendar-app\frontend\src\components\BackgroundCanvas.jsx',
    r'd:\前\calendar-app\frontend\src\components\TodoList.css',
    r'd:\前\calendar-app\frontend\src\App.jsx',
    r'd:\前\calendar-app\frontend\src\App.js',
    r'd:\前\calendar-app\backend\app.py',
    r'd:\前\calendar-app\frontend\src\Wonder.js'
]

def count_lines(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        code_lines = 0
        for line in lines:
            stripped_line = line.strip()
            if stripped_line and not stripped_line.startswith('//') and not stripped_line.startswith('#') and not stripped_line.startswith('import') and not stripped_line.startswith('from'):
                code_lines += 1
        return code_lines

total_lines = 0
for file_path in file_paths:
    total_lines += count_lines(file_path)

print(f'Total lines of code: {total_lines}')
import os

def count_lines(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        code_lines = 0
        for line in lines:
            stripped_line = line.strip()
            if stripped_line and not stripped_line.startswith('//') and not stripped_line.startswith('#') and not stripped_line.startswith('import') and not stripped_line.startswith('from'):
                code_lines += 1
        return code_lines

def count_lines_in_directory(directory):
    total_lines = 0
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.py', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                total_lines += count_lines(file_path)
    return total_lines

backend_directory = r'd:\前\calendar-app\backend'
frontend_directory = r'd:\前\calendar-app\frontend'

backend_lines = count_lines_in_directory(backend_directory)
frontend_lines = count_lines_in_directory(frontend_directory)

print(f'Total lines of code in backend: {backend_lines}')
print(f'Total lines of code in frontend: {frontend_lines}')
print(f'Total lines of code: {backend_lines + frontend_lines}')
