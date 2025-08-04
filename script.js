document.getElementById('formAcesso').addEventListener('submit', function (event) {
    event.preventDefault();
    let inSenha = document.getElementById('inSenha').value.trim();
    let inUsuario = document.getElementById('inUsuario').value.trim();
    buscarArquivos(inUsuario, inSenha);
});
document.getElementById("formAcesso").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let inSenha = document.getElementById('inSenha').value.trim();
        let inUsuario = document.getElementById('inUsuario').value.trim();
        buscarArquivos(inUsuario, inSenha);
    }
});
document.getElementById("inFiltro").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        filtrar();
    }
});


async function buscarArquivos(usuario, senha) {
    let secAcesso = document.getElementById('secAcesso');
    let secDocumentos = document.getElementById('secDocumentos');
    let spanNomeUsuario = document.getElementById('spanNomeUsuario');
    let inUsuario = document.getElementById('inUsuario');
    let msmConfirm = document.getElementById('msmConfirm');
    let bntSair = document.getElementById('btnSair');
    let inSenha = document.getElementById('inSenha');

    secAcesso.style.display = 'none';
    msmConfirm.innerText = "Validando Funcionário...";
    msmConfirm.style.display = 'block';

    try {
        let url = await fetch(`https://script.google.com/macros/s/AKfycbwvTa1qlyNfpOVlLnn0JNFHsYalNei2vhhsiUGQeAZ1oevN5g6JDsCFzeCmdfT7eqS6Gw/exec?usuario=${usuario}&senha=${senha}`);
        let arquivos = await url.json();

        let primeiroNome = arquivos.length>0 ? arquivos[0].name.split(' ')[0] : 'você não possui arquivos';

        const lista = document.getElementById("lista-arquivos");
        arquivos.forEach(arquivo => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${arquivo.downloadUrl}" download target="_blank">${arquivo.name}</a>`;
            lista.appendChild(li);
        })

        secAcesso.style.display = 'none';
        secDocumentos.style.display = 'block';
        spanNomeUsuario.innerText = primeiroNome;
        spanNomeUsuario.style.textTransform = arquivos.length==0 ? 'lowercase' : 'capitalize';
        bntSair.style.display = 'block';
        msmConfirm.style.display = 'none';

        return true;
    } catch (error) {
        inSenha.value = '';
        inUsuario.value = '';
        msmConfirm.innerHTML = "<p><strong>Desculpe!</strong> Você não foi encontrado(a).</p><p>Verifique seus <strong>'DADOS DE ACESSO'</strong> ou procure o setor responsável pelos cadastramentos.</p>";

        setTimeout(() => {
            secAcesso.style.display = 'block';
            msmConfirm.style.display = 'none';
            inUsuario.focus();

            if (document.getElementById('inExibir').checked) {
                document.getElementById('inExibir').checked = false;
                document.getElementById('inSenha').type = 'password';
            }
        }, 5000);

    }
}


function filtrar() {
    let lista = document.getElementById('lista-arquivos');
    let btnLimparFiltro = document.getElementById('btnLimparFiltro');
    let inFiltro = document.getElementById('inFiltro').value.toUpperCase();

    for (let i = 0; i < lista.children.length; i++) {
        lista.children[i].style.display = 'block';
    }

    for (let i = 0; i < lista.children.length; i++) {
        if (!lista.children[i].textContent.toUpperCase().includes(inFiltro)) {
            lista.children[i].style.display = 'none';
        }
    }

    btnLimparFiltro.style.display = 'inline-block';
    btnLimparFiltro.textContent = 'Limpar Filtro: ' + inFiltro;
    document.getElementById('inFiltro').value = '';
}


function limparFiltro() {
    let lista = document.getElementById('lista-arquivos');
    for (let i = 0; i < lista.children.length; i++) {
        lista.children[i].style.display = 'block';
    }
    document.getElementById('btnLimparFiltro').style.display = 'none';
}


function sair() {
    window.location.reload();
    document.getElementById('btnSair').style.display = 'block';
}


function exibirSenha() {
    if (document.getElementById('inExibir').checked) {
        document.getElementById('inSenha').type = 'text';
    } else {
        document.getElementById('inSenha').type = 'password';
    }
}