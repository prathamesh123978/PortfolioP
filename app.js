document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('input-box');
    const addButton = document.getElementById('add-button');
    const listContainer = document.getElementById('list-container');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearAllButton = document.getElementById('clear-all');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            listContainer.innerHTML = savedTasks;
            attachDeleteListeners();
        }
        updateTaskCounter();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', listContainer.innerHTML);
    }
    
    // Add task when Add button is clicked
    addButton.addEventListener('click', addTask);
    
    // Add task when Enter key is pressed
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Function to add a new task
    function addTask() {
        if (inputBox.value === '') {
            alert('You must write something!');
            return;
        }
        
        const taskText = inputBox.value;
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <span class="delete"><i class="fas fa-trash"></i></span>
        `;
        
        listContainer.appendChild(li);
        inputBox.value = '';
        
        attachDeleteListeners();
        applyCurrentFilter();
        saveTasks();
        updateTaskCounter();
    }
    
    // Attach event listeners to task items
    function attachDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.removeEventListener('click', deleteTask);
            button.addEventListener('click', deleteTask);
        });
        
        const taskItems = document.querySelectorAll('#list-container li');
        taskItems.forEach(item => {
            item.removeEventListener('click', toggleTask);
            item.addEventListener('click', toggleTask);
        });
    }
    
    // Toggle task completion status
    function toggleTask(e) {
        if (e.target.tagName === 'LI' || e.target.className === 'task-text') {
            const li = e.target.tagName === 'LI' ? e.target : e.target.parentElement;
            li.classList.toggle('checked');
            saveTasks();
            updateTaskCounter();
            applyCurrentFilter();
        }
    }
    
    // Delete task
    function deleteTask(e) {
        e.stopPropagation();
        const li = e.target.closest('li');
        li.classList.add('deleted');
        
        // Add fade-out animation
        li.style.opacity = '0';
        li.style.transform = 'translateX(30px)';
        li.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            li.remove();
            saveTasks();
            updateTaskCounter();
        }, 300); // Match this with CSS transition time
    }
    
    // Update task counter
    function updateTaskCounter() {
        const pendingTasks = document.querySelectorAll('#list-container li:not(.checked)').length;
        tasksCounter.textContent = `${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} left`;
    }
    
    // Clear all tasks
    clearAllButton.addEventListener('click', function() {
        if (listContainer.children.length === 0) {
            alert('No tasks to clear!');
            return;
        }
        
        if (confirm('Are you sure you want to delete all tasks?')) {
            listContainer.innerHTML = '';
            saveTasks();
            updateTaskCounter();
        }
    });
    
    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyCurrentFilter();
        });
    });
    
    function applyCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const tasks = document.querySelectorAll('#list-container li');
        
        tasks.forEach(task => {
            switch (activeFilter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'pending':
                    task.style.display = task.classList.contains('checked') ? 'none' : 'flex';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('checked') ? 'flex' : 'none';
                    break;
            }
        });
    }
    
    // Load tasks on page load
    loadTasks();
    applyCurrentFilter();
});