document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar-section');
    const topBarName = document.querySelector('.selected-board-name');
    const boardInput = document.querySelector('.board-name-input');

    function addBoard(name) {
        const newBoard = document.createElement('a');
        newBoard.textContent = name;
        newBoard.href = "#";
        newBoard.classList.add('board-link');
        sidebar.appendChild(newBoard);

        newBoard.addEventListener('click', (event) => {
            event.preventDefault();
            topBarName.textContent = name;
        });
    }

    // Escutar o evento de Enter no input para adicionar o novo quadro
    boardInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const boardName = boardInput.value.trim();
            if (boardName) {
                addBoard(boardName);
                boardInput.value = ''; // Limpar o campo de input
            }
        }
    });
});