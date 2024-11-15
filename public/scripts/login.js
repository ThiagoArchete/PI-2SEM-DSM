const form = document.getElementById('forms');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('exampleInputEmail1').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('erros');
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    
    const result = await response.json(); 

    if (response.ok) { 
        window.location.href = '/home';  
    } else {
        mensagemErro.textContent = result.message;
        mensagemErro.style.display = "block";
    } 
}); 



