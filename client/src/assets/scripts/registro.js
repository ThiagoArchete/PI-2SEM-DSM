const entrar = document.getElementById('criar');
function validarCampos() {
    const email = document.querySelector('#exampleInputEmail1').value;
    const nome = document.getElementById('nameInput').value;
    const nomeValido = validarNome();
    const mensagemErros = document.querySelector('.erros');
    if (!nomeValido) {
        mensagemErros.textContent = 'Preencha o nome';
        mensagemErros.style.backgroundColor = 'rgb(255, 115, 115)';
    } else {
        mensagemErros.textContent = '';
        mensagemErros.style.backgroundColor = '#fff';
    }
    const emailValido = validarEmail();
    document.getElementById('recuperarSenha').disabled = !emailValido;
    if (!emailValido) {
        mensagemErros.textContent = 'Insira um e-mail valido';
        mensagemErros.style.backgroundColor = 'rgb(255, 115, 115)';
    } 
    if (!email){
        mensagemErros.textContent = '';
        mensagemErros.style.backgroundColor = '#fff';
    }
    const senha = validarSenha();
    const confirmacaoSenhas = compararSenhas();
    if (!confirmacaoSenhas) {
        mensagemErros.textContent = 'As senha precisam ser as mesmas';
        mensagemErros.style.backgroundColor = 'rgb(255, 115, 115)';
    } else {
        mensagemErros.textContent = '';
        mensagemErros.style.backgroundColor = '#fff';
    }
    document.getElementById('criar').disabled = !senha || !emailValido || !nomeValido || !confirmacaoSenhas ;
}
function emailValido (email) {
    let emailPattern =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
     return emailPattern.test(email); 
  }

  function validarSenha() {
    const senha = document.querySelector('#senha').value;
    if (!senha) {
        return false;
    } 
    return true;
  }
  function validarNome() {
    const nome = document.getElementById('nameInput').value;
    if (!nome) {
        return false;
    } 
    return true;
  }

  function validarEmail() {
    const email = document.querySelector('#exampleInputEmail1').value;
    if (!email) {
        return false;
    }
    return emailValido(email)
}
entrar.addEventListener('click', (event) => {
    event.preventDefault();
     window.location.href = 'assets/pages/home.html';
})

function compararSenhas() {
    const senha = document.querySelector('#senha').value;
    const confirmaSenha = document.getElementById('confirmsenha').value;
    if (senha !== confirmaSenha) {
        return false;
    }
    return true
}



