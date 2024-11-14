const form = document.getElementById('forms');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('exampleInputEmail1').value;
    const senha = document.getElementById('senha').value;
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    
    const result = await response.json(); 

    alert(result.message);  

    if (response.ok) { 
        window.location.href = '/home';  
    } else {
        document.querySelector('.erros').textContent = result.message; 
    } 
});



