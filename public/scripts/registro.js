const form = document.getElementById('forms');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const nome = document.getElementById('nameInput').value;
    const email = document.getElementById('exampleInputEmail1').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmsenha').value;
    const mensagemErro = document.getElementById('erros');

    if (senha !== confirmaSenha) {
        mensagemErro.textContent = "As senhas não correspondem!";
        mensagemErro.style.display = "block";
        return;
    }

    try {
        const response = await fetch('/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, confirmaSenha })
        });

        const result = await response.json();
 
        if (response.ok) {
            window.location.href = '/login';
        } else {
            mensagemErro.textContent = result.message;
            mensagemErro.style.display = "block";
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o servidor:', error);
        alert('Erro ao registrar. Tente novamente mais tarde.');
    } 
});