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

const $todoColumnBody = document.querySelector('#todoColumn .body')

var todoList = [];

function openModal(id) {
    $modal.style.display = "flex";
}

function closeModal() {
    $modal.style.display = "none";

    $descriptionInput.value = "";
    $priorityInput.value = "";
    $deadlineInput.value = "";
}

function generateCards() {
    const todoListHtml = todoList.map(function(task) {
        const formattedDate = moment(task.deadline).format('DD/MM/YYYY')
        return `
            <div class="card" ondblclick="openModal(${task.id})">
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
    });

    $todoColumnBody.innerHTML = todoListHtml.join('');
}

function createTask() {
    const newTask = {
        id: Math.floor(Math.random() * 9999999),
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadLine: $deadlineInput.value,
    }

    todoList.push(newTask);

    closeModal();
    generateCards();

}




