function validarCampos() {
    const emailValido = validarEmail();
    const mensagemErros = document.querySelector('.erros');
    document.getElementById('recuperarSenha').disabled = !emailValido;
    if (!emailValido) {
        mensagemErros.textContent = 'Insira um e-mail valido'
        mensagemErros.style.backgroundColor = 'rgb(255, 115, 115)'
    } else {
        mensagemErros.textContent = ''
        mensagemErros.style.backgroundColor = '#fff'
    }
    const senha = validarSenha();
    document.getElementById('login').disabled = !senha || !emailValido;
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

  function validarEmail() {
    const email = document.querySelector('#exampleInputEmail1').value;
    if (!email) {
        return false;
    }
    return emailValido(email)
}



