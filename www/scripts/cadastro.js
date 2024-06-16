document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro-cliente');

    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        // Validar os campos do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;

        if (nome === '' || email === '' || telefone === '') {
            alert('Por favor, preencha todos os campos do formulário.');
            return;
        }
        
        var checkbox = document.getElementById('ckb_profissao');
        console.log(checkbox.checked);
        if (checkbox.checked) {
            // é profissional
            window.location.href = "http://localhost:8081/agradecimento.html";
        } else {
            // é usuario comum
            window.location.href = "http://localhost:8081/index.html";
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("group_profissao").style.display = 'none';

    var checkbox = document.getElementById('ckb_profissao');
    var content = document.getElementById('group_profissao');
  
    checkbox.addEventListener('change', function () {
        // Verifica se o checkbox está marcado
        if (checkbox.checked) {
            // Mostra o conteúdo
            content.style.display = 'block';
        } else {
            // Oculta o conteúdo
            content.style.display = 'none';
        }
    });
});
