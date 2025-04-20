    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
    
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
    
      if (username === "cafe" && password === "1234") {
        // Redireciona para outra página após login bem-sucedido
        window.location.href = "menu.html";
      } else {
        alert("Usuário ou senha incorretos.");
      }
    });

    const loading = document.getElementById("loading");

    const showLoading = () => {
      loading.style.display = "flex";
      return setTimeout(() => {
        hideLoading();
        alert("Tempo limite de resposta excedido.");
      }, 60000);
    };

    const hideLoading = () => {
      loading.style.display = "none";
    };

    const formatarMoeda = (input) => {
      let valor = input.value.replace(/\D/g, '');
      valor = (valor / 100).toFixed(2) + '';
      valor = valor.replace('.', ',');
      valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      input.value = 'R$ ' + valor;
    };

    document.getElementById('valor').addEventListener('input', function () {
      formatarMoeda(this);
    });

    document.getElementById('valorRateio').addEventListener('input', function () {
      formatarMoeda(this);
    });

    async function enviarLancamento() {
      const descricao = document.getElementById('descricao').value;
      const categoria = document.getElementById('categoria').value;
      const valor = document.getElementById('valor').value.replace(/[^\d,]/g, '').replace(',', '.');

      const payload = {
        descricao,
        categoria,
        valor: parseFloat(valor)
      };

      const timeout = showLoading();

      try {
        const response = await fetch('https://lancamentosquattrocoffe.fly.dev/lancamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        clearTimeout(timeout);
        hideLoading();

        if (response.ok) {
          alert('Lançamento salvo com sucesso!');
          document.getElementById('form-lancamento').reset();
        } else {
          alert('Erro ao salvar lançamento.');
        }
      } catch (error) {
        clearTimeout(timeout);
        hideLoading();
        console.error(error);
        alert('Erro ao comunicar com o servidor.');
      }
    }

    async function obterRateio() {
      const centroCusto = document.getElementById("centroCusto").value;
      let valorDespesaBruto = document.getElementById("valorRateio").value;
      let valorDespesaInput = valorDespesaBruto.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');

      if (!valorDespesaInput || isNaN(parseFloat(valorDespesaInput))) {
        alert("Por favor, insira um valor válido para a despesa.");
        return;
      }

      const valorDespesa = parseFloat(valorDespesaInput);

      const timeout = showLoading();

      try {
        const response = await fetch(`https://lancamentosquattrocoffe.fly.dev/Rateios?centroCusto=${centroCusto}&valor=${valorDespesa}`);
        const data = await response.json();

        clearTimeout(timeout);
        hideLoading();

        const formattedData = Object.entries(data).map(([nome, valor]) => {
          return {
            item1: nome,
            item2: `R$ ${valor.toFixed(2).replace('.', ',')}`
          };
        });

        const resultDiv = document.getElementById("resultadoRateio");
        const listaRateioDiv = document.getElementById("listaRateio");
        resultDiv.style.display = "block";
        listaRateioDiv.innerHTML = "";

        formattedData.forEach(rateio => {
          const div = document.createElement("div");
          div.textContent = `${rateio.item1}: ${rateio.item2}`;
          listaRateioDiv.appendChild(div);
        });
      } catch (error) {
        clearTimeout(timeout);
        hideLoading();
        console.error("Erro ao obter o rateio:", error);
        alert("Erro ao processar o rateio.");
      }
    }
	

		
	