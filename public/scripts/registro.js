
const form = document.getElementById('forms');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const nome = document.getElementById('nameInput').value;
    const email = document.getElementById('exampleInputEmail1').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmsenha').value;
    
    const response = await fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, confirmaSenha })
    });
    
    const message = await response.text();
    alert(message);

    if (response.ok) {
        window.location.href = '/login'; 
    } else {
        alert(message);
    }
});