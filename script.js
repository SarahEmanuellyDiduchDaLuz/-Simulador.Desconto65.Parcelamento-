document.addEventListener('DOMContentLoaded', function () {
  function moedaBR(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  function toNumber(val) {
    if (typeof val === 'number') return val;
    if (!val && val !== 0) return NaN;
    return parseFloat(String(val).trim().replace(',', '.'));
  }

  const form = document.getElementById('form');
  const erro = document.getElementById('erro');
  const resultados = document.getElementById('resultados');
  const tabelaSecao = document.getElementById('tabelaSecao');
  const outPrecoComDesconto = document.getElementById('precoComDesconto');
  const outValorParcela = document.getElementById('valorParcela');
  const outTotalPagar = document.getElementById('totalPagar');
  const outEconomia = document.getElementById('economia');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    erro.textContent = '';

    try {
      const preco = toNumber(document.getElementById('preco').value);
      const desconto = toNumber(document.getElementById('desconto').value);
      const taxa = toNumber(document.getElementById('taxa').value);
      const parcelasRaw = document.getElementById('parcelas').value;
      const parcelas = parseInt(String(parcelasRaw).replace(',', ''), 10);

      if (isNaN(preco) || preco <= 0) throw new Error('Informe um preço válido (> 0).');
      if (isNaN(desconto) || desconto < 0) throw new Error('Desconto deve ser ≥ 0.');
      if (isNaN(taxa) || taxa < 0) throw new Error('Taxa deve ser ≥ 0.');
      if (isNaN(parcelas) || parcelas < 1) throw new Error('Número de parcelas deve ser ≥ 1.');

      const precoComDesconto = preco * (1 - desconto / 100);
      const i = taxa / 100; // taxa decimal
      const J_total = precoComDesconto * i * parcelas;
      const totalPagar = precoComDesconto + J_total;
      const valorParcela = totalPagar / parcelas;
      const economia = preco - precoComDesconto;

      outPrecoComDesconto.textContent = moedaBR(precoComDesconto);
      outValorParcela.textContent = moedaBR(valorParcela);
      outTotalPagar.textContent = moedaBR(totalPagar);
      outEconomia.textContent = moedaBR(economia);
      resultados.hidden = false;

      let corpoTabela = document.querySelector('#tabela tbody');
      if (!corpoTabela) {
        const tabela = document.getElementById('tabela');
        corpoTabela = document.createElement('tbody');
        tabela.appendChild(corpoTabela);
      }
      corpoTabela.innerHTML = '';

      const jurosMesConstante = precoComDesconto * i;
      const amortizacaoConstante = precoComDesconto / parcelas;

      for (let mes = 1; mes <= parcelas; mes++) {
        const principalRestante = Math.max(0, precoComDesconto - amortizacaoConstante * mes);

        const tr = document.createElement('tr');

        const tdMes = document.createElement('td');
        tdMes.textContent = mes;

        const tdParcela = document.createElement('td');
        tdParcela.textContent = moedaBR(valorParcela);

        const tdJurosMes = document.createElement('td');
        tdJurosMes.textContent = moedaBR(jurosMesConstante);

        const tdAmortizacao = document.createElement('td');
        tdAmortizacao.textContent = moedaBR(amortizacaoConstante);

        const tdRestante = document.createElement('td');
        tdRestante.textContent = moedaBR(principalRestante);

        tr.appendChild(tdMes);
        tr.appendChild(tdParcela);
        tr.appendChild(tdJurosMes);
        tr.appendChild(tdAmortizacao);
        tr.appendChild(tdRestante);

        corpoTabela.appendChild(tr);
      }

      tabelaSecao.hidden = false;
    } catch (erro) {
      erro.textContent = erro.message || 'Erro inesperado. Verifique os dados.';
      resultados.hidden = true;
      tabelaSecao.hidden = true;
    }
  });
});
