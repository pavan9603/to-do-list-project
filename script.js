

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const taskInput = document.getElementById('taskInput');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const taskList = document.getElementById('taskList');
            const emptyState = document.getElementById('emptyState');
            const totalCount = document.getElementById('totalCount');
            const completedCount = document.getElementById('completedCount');

            // Load tasks from localStorage
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Render tasks
            renderTasks();
            updateStats();

            // Add task event listener
            addTaskBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTask();
            });

            function addTask() {
                const taskText = taskInput.value.trim();
                if (!taskText) return;

                // Create new task
                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };

                tasks.push(newTask);
                saveTasks();
                renderTasks();
                updateStats();

                // Clear input
                taskInput.value = '';
                taskInput.focus();
            }

            function renderTasks() {
                if (tasks.length === 0) {
                    emptyState.style.display = 'block';
                    taskList.innerHTML = '';
                    taskList.appendChild(emptyState);
                    return;
                }

                emptyState.style.display = 'none';
                taskList.innerHTML = '';

                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `task ${task.completed ? 'completed' : ''}`;
                    taskElement.innerHTML = `
                        <div class="task-content">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} class="checkbox" 
                                   aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}" 
                                   data-id="${task.id}">
                            <span class="task-text">${task.text}</span>
                        </div>
                        <div class="task-actions">
                            <button class="action-btn delete" data-id="${task.id}" 
                                    aria-label="Delete task">✕</button>
                        </div>
                    `;
                    taskList.appendChild(taskElement);
                });

                // Add event listeners to new elements
                document.querySelectorAll('.checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', toggleTask);
                });

                document.querySelectorAll('.delete').forEach(btn => {
                    btn.addEventListener('click', deleteTask);
                });
            }

            function toggleTask(e) {
                const taskId = parseInt(e.target.dataset.id);
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                
                if (taskIndex !== -1) {
                    tasks[taskIndex].completed = e.target.checked;
                    saveTasks();
                    renderTasks();
                    updateStats();
                }
            }

            function deleteTask(e) {
                const taskId = parseInt(e.currentTarget.dataset.id);
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
                updateStats();
            }

            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            function updateStats() {
                const total = tasks.length;
                const completed = tasks.filter(task => task.completed).length;
                totalCount.textContent = total;
                completedCount.textContent = completed;
            }
        });
    </script>
</body>
</html>

