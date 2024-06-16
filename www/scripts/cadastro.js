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


/*
document.addEventListener('DOMContentLoaded', function() {
    const profissoes = ['Pedreiro', 'Carpinteiro', 'Pintor', 'Eletricista', 'Encanador', 'Marceneiro', 'Serralheiro', 'Jardineiro', 'Piscineiro', 'Vidraceiro', 'Gesseiro', 'Decorador', 'Arquiteto', 'Engenheiro', 'Paisagista'];

    const formCadastro = document.getElementById('form-cadastro-cliente');
    const selectProfissao = document.getElementById('profissao');
    const checkbox = document.getElementById('ckb_profissao');
    const content = document.getElementById('group_profissao');

    // Preencher o select com as profissões existentes
    profissoes.forEach(profissao => {
        const option = document.createElement('option');
        option.value = profissao;
        option.textContent = profissao;
        selectProfissao.appendChild(option);
    });

    // Esconder o campo de profissão inicialmente
    content.style.display = 'none';

    // Evento para mostrar/ocultar o campo de profissão
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            // Mostra o conteúdo
            content.style.display = 'block';
        } else {
            // Oculta o conteúdo
            content.style.display = 'none';
        }
    });

    // Evento de submit do formulário
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const profissaoInput = document.getElementById('profissao').value.trim();

        // Validar se todos os campos obrigatórios estão preenchidos
        if (nome === '' || email === '' || telefone === '' || profissaoInput === '') {
            alert('Por favor, preencha todos os campos do formulário.');
            return;
        }

        // Se a opção de profissão digitada não estiver na lista, adiciona dinamicamente
        if (checkbox.checked && !profissoes.includes(profissaoInput)) {
            profissoes.push(profissaoInput);

            const newOption = document.createElement('option');
            newOption.value = profissaoInput;
            newOption.textContent = profissaoInput;
            selectProfissao.appendChild(newOption);
        }

        // Redirecionamento com base na seleção do checkbox
        if (checkbox.checked) {
            // é profissional
            window.location.href = "http://localhost:8081/agradecimento.html";
        } else {
            // é usuario comum
            window.location.href = "http://localhost:8081/index.html";
        }
    });
});
*/