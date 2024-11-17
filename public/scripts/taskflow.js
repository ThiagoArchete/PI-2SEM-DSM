document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar-section');
    const topBarName = document.querySelector('.selected-board-name');
    const boardInput = document.querySelector('.board-name-input');
    const addBoardButton = document.querySelector('.add-board-button');

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

    // Mostrar o input ao clicar no botão "Adicionar novo quadro"
    addBoardButton.addEventListener('click', () => {
        boardInput.classList.remove('hidden');
        boardInput.focus();
    });

    // Adicionar quadro ao pressionar Enter no input
    boardInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const boardName = boardInput.value.trim();
            if (boardName) {
                addBoard(boardName);
                boardInput.value = ''; // Limpar o campo de input
                boardInput.classList.add('hidden'); // Ocultar o input novamente
            }
        }
    });
});
