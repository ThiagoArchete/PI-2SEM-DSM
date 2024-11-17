document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar-section');
    const topBarName = document.querySelector('.selected-board-name');
    const boardInput = document.querySelector('.board-name-input');
    const addBoardButton = document.querySelector('.add-board-button');

    function addBoard(name) {
        
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board-container');

        
        const boardContent = document.createElement('div');
        boardContent.classList.add('board-content');

        const boardName = document.createElement('span');
        boardName.textContent = name;
        boardName.classList.add('board-name');
        boardContent.appendChild(boardName);

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

        
        boardContainer.appendChild(boardContent);
        boardContainer.appendChild(editButton);
        boardContainer.appendChild(deleteButton);
        sidebar.appendChild(boardContainer);

        
        boardContent.addEventListener('click', () => {
            topBarName.textContent = boardName.textContent;
        });

        
        editButton.addEventListener('click', () => {
            editInput.value = boardName.textContent;
            boardName.classList.add('hidden');
            editInput.classList.remove('hidden');
            editInput.focus();
        });

        
        editInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                saveEdit();
            }
        });
        editInput.addEventListener('blur', saveEdit);

        function saveEdit() {
            const newName = editInput.value.trim();
            if (newName) {
                boardName.textContent = newName;
            }
            editInput.classList.add('hidden');
            boardName.classList.remove('hidden');
        }

        deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm('Tem certeza que deseja excluir este quadro?');
            if (confirmDelete) {
                boardContainer.remove();
                if (topBarName.textContent === boardName.textContent) {
                    topBarName.textContent = '';
                }
            }
        });
    }


    addBoardButton.addEventListener('click', () => {
        boardInput.classList.remove('hidden');
        boardInput.focus();
    });

    boardInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const boardName = boardInput.value.trim();
            if (boardName) {
                addBoard(boardName);
                boardInput.value = '';
                boardInput.classList.add('hidden');
            }
        }
    });
});


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
    $columnInput.value = task.$column;
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

    resetColumns();

    taskList.forEach(function(task) {
        const formattedDate = moment(task.deadLine).format('DD/MM/YYYY')

        const columnBody = document.querySelector(`[data-column="${task.column}"] .body`);

        const card = `
            <div class="card" ondblclick="openModal(${task.id})" draggable="true">
                <div class="info">
                    <b>Descrição:</b>
                    <span>${task.description}</span>
                    <b>Prioridade:</b>
                    <span>${task.priority}</span>
                    <b>Prazo:</b>
                    <span>${formattedDate}</span>
                </div>
            </div>
        `;

        columnBody.innerHTML += card;
    });
}

function createTask() {
    const newTask = {
        id: Math.floor(Math.random() * 9999999),
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadLine: $deadlineInput.value,
        column: $columnInput.value,
    }

    taskList.push(newTask);

    closeModal();
    generateCards();
}

function updateTask() {
    const task = {
        id: $idInput.value,
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadLine: $deadlineInput.value,
        column: $columnInput.value,
    }

    const index = taskList.findIndex(function(task){
        return task.id == $idInput.value;
    });

    taskList[index] = task;

    closeModal();
    generateCards();

}


function changeColumn(task_id, column_id) {
    if (task_id && column_id) {
      taskList = taskList.map((task) => {
        if (task_id != task.id) return task;
    
        return {
          ...task,
          column: column_id,
        };
      });
    }
  
    generateCards();
  }
  
  function dragstart_handler(ev) {
    console.log(ev);
  
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("my_custom_data", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  }
  
  function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  
  function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const task_id = ev.dataTransfer.getData("my_custom_data");
    const column_id = ev.target.dataset.column;
    
    changeColumn(task_id, column_id);
  }
