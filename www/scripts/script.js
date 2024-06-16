document.addEventListener('DOMContentLoaded', () => {
    // Preencher opções de serviços e profissões
    const servicos = ['Reforma', 'Manutenção', 'Limpeza', 'Arquitetura', 'Engenharia', 'Paisagismo'];
    const selectServico = document.getElementById('servico');
    servicos.forEach(servico => {
        const option = document.createElement('option');
        option.value = servico;
        option.textContent = servico;
        selectServico.appendChild(option);
    });

    const profissoes = ['Pedreiro', 'Carpinteiro', 'Pintor', 'Eletricista', 'Encanador', 'Marceneiro', 'Serralheiro', 'Jardineiro', 'Piscineiro', 'Vidraceiro', 'Gesseiro', 'Decorador', 'Arquiteto', 'Engenheiro', 'Paisagista'];
    const selectProfissao = document.getElementById('profissao');
    profissoes.forEach(profissao => {
        const option = document.createElement('option');
        option.value = profissao;
        option.textContent = profissao;
        selectProfissao.appendChild(option);
    });

    // Variáveis para os elementos do formulário
    const checkboxOrcamento = document.getElementById('deseja-orcamento');
    const grupoValorProposta = document.getElementById('grupo-valor-proposta');
    const campoValorProposta = document.getElementById('valor-proposta');
    const descricao = document.getElementById('descricao');
    const solicitacoesInput = document.getElementById('solicitacoes');

    // Evento para alternar a visibilidade e obrigatoriedade do campo "Valor da proposta"
    checkboxOrcamento.addEventListener('change', function() {
        if (checkboxOrcamento.checked) {
            campoValorProposta.required = false;
            descricao.required = false;
            descricao.placeholder = "(OPCIONAL CASO ORÇAMENTO FOR SELECIONADO)";
            grupoValorProposta.style.display = 'none';
        } else {
            campoValorProposta.required = true;
            descricao.required = true;
            descricao.placeholder = "Descrição do Serviço";
            grupoValorProposta.style.display = 'block';
        }
    });

    // Configuração inicial dos campos ao carregar a página
    if (checkboxOrcamento.checked) {
        campoValorProposta.required = false;
        descricao.required = false;
        descricao.placeholder = "(OPCIONAL CASO ORÇAMENTO FOR SELECIONADO)";
        grupoValorProposta.style.display = 'none';
    } else {
        campoValorProposta.required = true;
        descricao.required = true;
        descricao.placeholder = "Descrição do Serviço";
        grupoValorProposta.style.display = 'block';
    }

    // Função para adicionar uma solicitação à lista
    function addEvent(servico, profissao, desejaOrcamento, descricao, valorProposta) {
        const list = document.getElementById('eventsList');
        const listItem = document.createElement('li');
        const eventText = document.createElement('span');
        const formattedValue = valorProposta ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(valorProposta) : 'N/A';
        eventText.textContent = `Serviço: ${servico}, Profissão: ${profissao}, Deseja Orçamento: ${desejaOrcamento ? 'Sim' : 'Não'}, Descrição: ${descricao}, Valor Proposta: ${formattedValue}`;
        listItem.appendChild(eventText);

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = function() {
            const newServico = prompt("Editar o tipo de serviço:", servico);
            const newProfissao = prompt("Editar a profissão:", profissao);
            const newDesejaOrcamento = confirm("Deseja orçamento?");
            const newDescricao = prompt("Editar a descrição do serviço:", descricao);
            const newValorProposta = prompt("Editar o valor da proposta:", valorProposta);
            if (newServico && newProfissao && newDescricao && (newServico != servico || newProfissao != profissao || newDesejaOrcamento != desejaOrcamento || newDescricao != descricao || newValorProposta != valorProposta)) {
                const newFormattedValue = newValorProposta ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(newValorProposta) : 'N/A';
                eventText.textContent = `Serviço: ${newServico}, Profissão: ${newProfissao}, Deseja Orçamento: ${newDesejaOrcamento ? 'Sim' : 'Não'}, Descrição: ${newDescricao}, Valor Proposta: ${newFormattedValue}`;
            }
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remover';
        deleteButton.onclick = function() {
            list.removeChild(listItem);
            updateHiddenInput();
        };

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
        updateHiddenInput();
    }

    // Atualiza o campo oculto com todas as solicitações
    function updateHiddenInput() {
        const list = document.getElementById('eventsList');
        const items = list.getElementsByTagName('li');
        const solicitacoes = [];

        for (let i = 0; i < items.length; i++) {
            solicitacoes.push(items[i].getElementsByTagName('span')[0].textContent);
        }

        solicitacoesInput.value = JSON.stringify(solicitacoes);
    }

    // Adicionar solicitação à lista ao clicar no botão "Adicionar Solicitação"
    const botaoAdicionarSolicitacao = document.getElementById('adicionar-solicitacao');
    botaoAdicionarSolicitacao.addEventListener('click', () => {
        const servico = selectServico.value;
        const profissao = selectProfissao.value;
        const desejaOrcamento = checkboxOrcamento.checked;
        const descricao = document.getElementById('descricao').value;
        const valorProposta = document.getElementById('valor-proposta').value;

        if (servico && profissao && descricao) {
            addEvent(servico, profissao, desejaOrcamento, descricao, valorProposta);
            // Limpar os campos do formulário
            document.getElementById('form-solicitacao').reset();
            campoValorProposta.required = true;
            grupoValorProposta.style.display = 'block';
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });

    // Submeter todas as solicitações ao clicar no botão "Enviar Todas as Solicitações"
    const botaoEnviarTodasSolicitacoes = document.getElementById('enviar-todas-solicitacoes');
    botaoEnviarTodasSolicitacoes.addEventListener('click', () => {
        console.log("Botão 'Enviar Todas as Solicitações' clicado");
        document.getElementById('form-solicitacao').submit();
    });
});
