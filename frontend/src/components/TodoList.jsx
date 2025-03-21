import React, { useState } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div className="todo-list">
      <h3>清单列表</h3>
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="输入清单项"
        />
        <button onClick={handleAddTodo}>添加</button>
      </div>
      <div className="todo-section">
        <h4>未完成任务</h4>
        <ul>
          {todos.filter(todo => !todo.completed).map((todo, index) => (
            <li key={index} className="incomplete">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}
              />
              <span>{todo.text}</span>
              <button onClick={() => handleDeleteTodo(index)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="todo-section">
        <h4>已完成任务</h4>
        <ul>
          {todos.filter(todo => todo.completed).map((todo, index) => (
            <li key={index} className="completed">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}
              />
              <span>{todo.text}</span>
              <button onClick={() => handleDeleteTodo(index)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
