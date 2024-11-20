let selectedBoardId = null;
document.addEventListener('DOMContentLoaded', () => {
    function addBoard() {
        const boardNameInput = prompt('Digite o nome do novo quadro:');
        if (boardNameInput && boardNameInput.trim() !== '') {
            fetch('/taskflow/quadros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: boardNameInput.trim() }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    createBoardInUI(data.quadro.id_quadro, data.quadro.nome);
                    alert('Quadro adicionado com sucesso!');
                } else {
                    alert('Erro ao adicionar o quadro. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro ao adicionar quadro:', error);
                alert('Erro ao adicionar o quadro. Tente novamente.');
            });
        } else {
            alert('O nome do quadro não pode estar vazio!');
        }
    }
     
    function createBoardInUI(boardId, boardName) {
        const sidebar = document.querySelector('.sidebar .sidebar-section');
        
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board-container');
        boardContainer.setAttribute('data-board-id', boardId);  
        
        const boardContent = document.createElement('div');
        boardContent.classList.add('board-content');
        
        const boardNameSpan = document.createElement('span');
        boardNameSpan.textContent = boardName; 
        boardNameSpan.classList.add('board-name');
        boardContent.appendChild(boardNameSpan);
        boardNameSpan.addEventListener('click', (event) => {
            const boardContainer = event.target.closest('.board-container');
            const boardId = boardContainer.getAttribute('data-board-id');
            const boardName = boardNameSpan.textContent; 
            selectBoard(boardId, boardName);  
        });
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.classList.add('board-name-input', 'hidden');
        boardContent.appendChild(editInput);
        
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.innerHTML = '✏';
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '🗑';
        
        const boardItem = document.createElement('div');
        boardItem.classList.add('board-item');
        boardItem.textContent = boardName;
        editButton.addEventListener('click', () => {
            editInput.value = boardNameSpan.textContent;
            boardNameSpan.classList.add('hidden');
            editInput.classList.remove('hidden');
            editInput.focus();
            editBoard(boardId);
        });
    
        deleteButton.addEventListener('click', () => {
            deleteBoard(boardId, boardContainer); 
        });
        
        boardContainer.appendChild(boardContent);
        boardContainer.appendChild(editButton);
        boardContainer.appendChild(deleteButton);
        sidebar.appendChild(boardContainer);
        
        editInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                saveEdit();
            }
        });
        
        editInput.addEventListener('blur', saveEdit);
    
        function saveEdit() {
            const newName = editInput.value.trim();
            if (newName) {
                boardNameSpan.textContent = newName;
            }
            editInput.classList.add('hidden');
            boardNameSpan.classList.remove('hidden');
        
            fetch(`/taskflow/quadros/${boardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: newName })
            })
            .then(response => {
                if (response.ok) {
                    alert('Nome do quadro atualizado!');
                } else {
                    alert('Erro ao atualizar o nome do quadro.');
                }
            })
            .catch(error => {
                console.error('Erro ao se comunicar com o servidor:', error);
                alert('Erro ao atualizar o nome do quadro.');
            });
        }
    }
    
    document.querySelector('.add-board-button').addEventListener('click', addBoard);
});
function selectBoard(id, boardName) {
    selectedBoardId = id;

    const selectedBoardNameElement = document.querySelector('.selected-board-name');
    selectedBoardNameElement.textContent = boardName;

    document.querySelector('.main-content').classList.remove('hidden');

    taskList = []; 
    resetColumns(); 
    loadTasksForBoard(id);
}
    function deleteBoard(boardId) {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir este quadro?');
    
        if (confirmDelete) {
            fetch(`/taskflow/quadros/${boardId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);  
                const boardNameElement = document.querySelector(`[data-board-id='${boardId}']`);
                boardNameElement.remove(); 
            })
            .catch(error => {
                console.error('Erro ao excluir quadro:', error);
            });
        }
    }

    function editBoard(boardId) {
        const boardNameElement = document.querySelector(`[data-board-id='${boardId}'] .board-name`);
        const newName = prompt("Digite o novo nome para o quadro:", boardNameElement.textContent);
        
        if (newName) {
            fetch(`/taskflow/quadros/${boardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: newName }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                boardNameElement.textContent = newName;
            })
            .catch(error => {
                console.error('Erro ao editar quadro:', error);
            });
        }
    }

    const $modal = document.getElementById('modal');
    const $descriptionInput = document.getElementById('description');
    const $priorityInput = document.getElementById('priority');
    const $deadlineInput = document.getElementById('deadline');
    const $columnInput = document.getElementById('column');
    const $idInput = document.getElementById("idInput");
    
    const $creationModeTitle = document.getElementById('creationModeTitle');
    const $editingModeTitle = document.getElementById('editingModeTitle');
    
    const $creationModeBtn = document.getElementById('creationModeBtn');
    const $editingModeBtn = document.getElementById('editingModeBtn');
    
    var taskList = [];
    
    function openModal(id) {
        $modal.style.display = "flex";
    
        if (id) {
            $creationModeTitle.style.display = "none";
            $creationModeBtn.style.display = "none";
    
            $editingModeTitle.style.display = "block";
            $editingModeBtn.style.display = "block";
    
            const index = taskList.findIndex(function(task){
                return task.id == id;
            });
    
        const task = taskList[index];
    
        $idInput.value = task.id;
        $descriptionInput.value = task.description;
        $priorityInput.value = task.priority;
        $deadlineInput.value = task.deadLine;
        $columnInput.value = task.column;
        } else {
            $creationModeTitle.style.display = "block";
            $creationModeBtn.style.display = "block";
    
            $editingModeTitle.style.display = "none";
            $editingModeBtn.style.display = "none";
        }
    }
    
    function closeModal() {
        $modal.style.display = "none";
    
        $idInput.value = "";
        $descriptionInput.value = "";
        $priorityInput.value = "";
        $deadlineInput.value = "";
        $columnInput.value = "";
    }
    
    function resetColumns() {
        document.querySelector('[data-column="1"] .body').innerHTML = '';
        document.querySelector('[data-column="2"] .body').innerHTML = '';
        document.querySelector('[data-column="3"] .body').innerHTML = '';
        document.querySelector('[data-column="4"] .body').innerHTML = '';
    }
    
    
    function generateCards() {

        document.querySelectorAll('.column .body').forEach(column => {
            column.innerHTML = ''; 
        });
     
        taskList.forEach(function(task) {
            const formattedDate = moment(task.deadLine).format('DD/MM/YYYY');
            const columnBody = document.querySelector(`[data-column="${task.column}"] .body`);
            
            
            if (columnBody) {
                const card = `
                    <div class="card" ondblclick="openModal(${task.id})">
                        <div class="info">
                            <b>Descrição:</b>
                            <span>${task.description}</span>
                            <b>Prioridade:</b>
                            <span>${task.priority}</span>
                            <b>Prazo:</b>
                            <span>${formattedDate}</span>
                        </div>
                          <button class="delete-task-button" onclick="deleteTask(${task.id})">🗑</button>
                    </div>
                `;
                columnBody.innerHTML += card;
            }
        });
     }
    async function loadTasksForBoard(selectedBoardId) {
        try {
            const response = await fetch(`/taskflow/tarefas/${selectedBoardId}`);
            if (response.ok) {
                const tasks = await response.json();
                taskList = tasks.map(task => ({
                    id: task.id,
                    description: task.descricao,
                    priority: task.prioridade,
                    deadLine: task.prazo,
                    column: task.coluna
                }));
                generateCards();
            } else {
                console.error('Erro ao buscar tarefas');
            }
        } catch (err) {
            console.error('Erro ao carregar tarefas:', err);
        }
    }
    
    async function createTask() {

        const newTask = {
            descricao: $descriptionInput.value,
            prioridade: $priorityInput.value,
            prazo: $deadlineInput.value,
            coluna: $columnInput.value,
            id_quadro: selectedBoardId 
        };
    
        if (newTask.descricao && newTask.prioridade && newTask.prazo && newTask.coluna && newTask.id_quadro) {
            try {
                const response = await fetch('/taskflow/tarefas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTask)
                });
    
                if (response.ok) {
                    const task = await response.json();
                    console.log('Tarefa criada:', task);
    
                    taskList.push({
                        id: task.id,
                        description: task.descricao,
                        priority: task.prioridade,
                        deadLine: task.prazo,
                        column: task.coluna
                    });
    
                    closeModal();
                    generateCards();
                } else {
                    const error = await response.json();
                    alert(error.message || 'Erro ao criar tarefa');
                }
            } catch (err) {
                console.error('Erro ao enviar tarefa:', err);
                alert('Erro ao criar tarefa. Tente novamente.');
            }
        } else {
            alert('Preencha todos os campos!');
        }
    }
    
    async function updateTask() {
        const updatedTask = {
            description: $descriptionInput.value,
            priority: $priorityInput.value,
            deadLine: $deadlineInput.value,
            column: $columnInput.value
        };
    
        const taskId = $idInput.value;
    
        if (updatedTask.description && updatedTask.priority && updatedTask.deadLine && updatedTask.column) {
            try {
                const response = await fetch(`/taskflow/tarefas/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedTask)
                });
    
                if (response.ok) {
                    
                    const updatedTaskData = await response.json();
                    const taskPadrao = {
                        id: updatedTaskData.id,
                        description: updatedTaskData.descricao,
                        priority: updatedTaskData.prioridade,
                        deadLine: updatedTaskData.prazo,
                        column: updatedTaskData.coluna
                    }
                    const index = taskList.findIndex(task => task.id == taskId);
                    taskList[index] = taskPadrao;
                    generateCards();
                    closeModal();
                } else {
                    console.error('Erro ao editar a tarefa');
                }
            } catch (err) {
                console.error('Erro ao enviar dados de edição:', err);
            }
        } else {
            alert('Todos os campos são obrigatórios!');
        }
    }
    async function deleteTask(taskId) {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir esta tarefa?');
        
        if (confirmDelete) {
            try {
                const response = await fetch(`/taskflow/tarefas/${taskId}`, {
                    method: 'DELETE',
                });
        
                if (response.ok) {
                    taskList = taskList.filter(task => task.id !== taskId);
                    generateCards(); 
                    alert('Tarefa excluída com sucesso!');
                } else {
                    const error = await response.json();
                    alert(error.message || 'Erro ao excluir a tarefa');
                }
            } catch (err) {
                console.error('Erro ao excluir a tarefa:', err);
                alert('Erro ao excluir a tarefa. Tente novamente.');
            }
        }
    }