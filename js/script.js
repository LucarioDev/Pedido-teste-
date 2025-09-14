document.addEventListener('DOMContentLoaded', () => {
    const pedidoForm = document.getElementById('pedido-form');
    const pedidosTbody = document.getElementById('pedidos-tbody');
    const filterStatus = document.getElementById('filter-status');
    
    let pedidos = [];
    function carregarPedidos() {
        const pedidosSalvos = localStorage.getItem('pedidosAtelie');
        if (pedidosSalvos) {
            pedidos = JSON.parse(pedidosSalvos);
        } else {
            pedidos = [
                { id: 1, nome: "Pedido Sra. Ana", status: "Em Produção", dataCriacao: "2023-10-26", dataEntrega: "2023-11-10" },
                { id: 2, nome: "Conjunto Renda Azul", status: "Pronto", dataCriacao: "2023-10-20", dataEntrega: "2023-10-30" },
                { id: 3, nome: "Pijama Seda Personalizado", status: "Aguardando Início", dataCriacao: "2023-10-27", dataEntrega: "2023-11-15" }
            ];
        }
        renderizarPedidos();
    }
    function renderizarPedidos() {
        pedidosTbody.innerHTML = '';

        const statusFiltrado = filterStatus.value;
        const pedidosFiltrados = statusFiltrado === 'todos'
            ? pedidos
            : pedidos.filter(pedido => pedido.status === statusFiltrado);

        pedidosFiltrados.forEach(pedido => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', pedido.id);

            let statusClass = '';
            switch (pedido.status) {
                case 'Aguardando Início': statusClass = 'aguardando'; break;
                case 'Em Produção': statusClass = 'producao'; break;
                case 'Pronto': statusClass = 'pronto'; break;
            }
            row.innerHTML = `
                <td>${pedido.nome}</td>
                <td><span class="status ${statusClass}">${pedido.status}</span></td>
                <td>${formatarData(pedido.dataCriacao)}</td>
                <td>${formatarData(pedido.dataEntrega)}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${pedido.id}">✏️</button>
                    <button class="delete-btn" data-id="${pedido.id}">❌</button>
                    <select class="status-update" data-id="${pedido.id}">
                        <option value="Aguardando Início" ${pedido.status === 'Aguardando Início' ? 'selected' : ''}>Aguardando Início</option>
                        <option value="Em Produção" ${pedido.status === 'Em Produção' ? 'selected' : ''}>Em Produção</option>
                        <option value="Pronto" ${pedido.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
                    </select>
                </td>
            `;
            pedidosTbody.appendChild(row);
        });
    }

    function formatarData(dataString) {
        if (!dataString) return '';
        const partes = dataString.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    
    pedidoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nomePedidoInput = document.getElementById('nome-pedido');
        const dataCriacaoInput = document.getElementById('data-criacao');
        const dataEntregaInput = document.getElementById('data-entrega');

        const novoPedido = {
            id: Date.now(),
            nome: nomePedidoInput.value,
            status: 'Aguardando Início',
            dataCriacao: dataCriacaoInput.value || new Date().toISOString().split('T')[0],
            dataEntrega: dataEntregaInput.value
        };

        pedidos.push(novoPedido);
        salvarPedidos();
        renderizarPedidos();

        pedidoForm.reset();
    });

    pedidosTbody.addEventListener('click', (e) => {
        const target = e.target;
        const id = parseInt(target.getAttribute('data-id'));

        if (target.classList.contains('edit-btn')) {
            editarPedido(id);
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este pedido?')) {
                excluirPedido(id);
            }
        }
    });

    pedidosTbody.addEventListener('change', (e) => {
        const target = e.target;
        if (target.classList.contains('status-update')) {
            const id = parseInt(target.getAttribute('data-id'));
            const novoStatus = target.value;
            atualizarStatusPedido(id, novoStatus);
        }
    });

    function editarPedido(id) {
        const pedidoParaEditar = pedidos.find(p => p.id === id);
        if (!pedidoParaEditar) return;

        document.getElementById('nome-pedido').value = pedidoParaEditar.nome;
        document.getElementById('data-criacao').value = pedidoParaEditar.dataCriacao;
        document.getElementById('data-entrega').value = pedidoParaEditar.dataEntrega;

        alert("Os dados do pedido foram carregados no formulário. Por favor, clique em 'Adicionar Pedido' para salvar as alterações (isso irá substituir o pedido existente). Para uma experiência melhor, considere implementar um modal de edição.");

        pedidos = pedidos.filter(p => p.id !== id);
        salvarPedidos();
    }

    function excluirPedido(id) {
        pedidos = pedidos.filter(p => p.id !== id);
        salvarPedidos();
        renderizarPedidos();
    }

    function atualizarStatusPedido(id, novoStatus) {
        const pedidoIndex = pedidos.findIndex(p => p.id === id);
        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].status = novoStatus;
            salvarPedidos();
            renderizarPedidos();
        }
    }

    function salvarPedidos() {
        localStorage.setItem('pedidosAtelie', JSON.stringify(pedidos));
    }

    filterStatus.addEventListener('change', renderizarPedidos);

    carregarPedidos();
});
