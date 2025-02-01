// Importações
const qrcode = require('qrcode-terminal'); // qrcode para terminal
const qrcodeWeb = require("qrcode"); // qrcode para imagem web
const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js'); // Adicionado LocalAuth
const express = require("express");

const app = express();
const port = 3002;

const client = new Client({
  authStrategy: new LocalAuth(),
});

let qrCodeImage = "";
let connectionStatus = "Desconectado"; // Inicializa como desconectado

// Geração do QR Code para terminal e imagem
function generateQRCode() {
  return new Promise((resolve, reject) => {
    client.on("qr", (qr) => {
      qrcode.toString(qr, { small: true }, (err, qrCode) => {
        if (!err) {
          console.log(qrCode); // Exibe o QR code no terminal
        }
      });

      // Geração do QR Code para imagem
      qrcodeWeb.toDataURL(qr, (err, url) => {
        if (!err) {
          qrCodeImage = url; // Armazena a URL da imagem do QR code
          resolve(url); // Resolve a promise com a URL do QR Code
        } else {
          reject("Erro ao gerar QR Code para imagem");
        }
      });
    });
  });
}

// Quando o cliente estiver pronto
client.on("ready", () => {
    console.log('Tudo certo! WhatsApp conectado.');
    connectionStatus = "Conectado"; // Atualiza para conectado
});

// Quando o cliente se desconectar
client.on("disconnected", () => {
  console.log("Bot desconectado.");
  connectionStatus = "Desconectado"; // Atualiza para desconectado
  generateQRCode(); // Gera novamente o QR Code quando desconectado
});

// Inicializa o cliente
client.initialize();

// Rota HTTP
app.get("/", async (req, res) => {
  try {
    if (!qrCodeImage) {
      await generateQRCode(); // Gera o QR Code se não houver
    }// Se a conexão estiver estabelecida, redireciona para a página "Conectado"
if (connectionStatus === "Conectado") {
  return res.send(`
    <html>
      <head>
        <title>Conectado ao WhatsApp</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <script>
          setTimeout(() => {
            location.reload();
          }, 30000);
        </script>
      </head>
      <body class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        <div class="container">
          <h1 class="text-success">Você está conectado ao WhatsApp!</h1>
          <p class="lead">O seu WhatsApp foi conectado com sucesso.</p>
        </div>
      </body>
    </html>
  `);
}

// Caso contrário, exibe a tela com o QR Code
res.send(`
  <html>
    <head>
      <title>QR Code WhatsApp</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <script>
        setTimeout(() => {
          location.reload();
        }, 30000);
      </script>
    </head>
    <body class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div class="container">
        <h1 class="text-success">Escaneie o QR Code para conectar</h1>
        <img src="${qrCodeImage}" class="img-fluid my-3" alt="QR Code" />
        <div class="status fs-4 fw-bold ${connectionStatus === "Conectado" ? 'text-success' : 'text-danger'}">
          ${connectionStatus}
        </div>
        <div class="status-alert mt-2 fs-5 ${connectionStatus === "Conectado" ? 'text-success' : 'text-danger'}">
          ${connectionStatus === "Conectado" ? "Você está conectado ao WhatsApp!" : "Conecte seu WhatsApp escaneando o código."}
        </div>
      </div>
    </body>
  </html>
`);

  } catch (error) {
    res.send('Erro ao gerar QR Code');
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Evento quando a conexão for estabelecida com o celular
client.on("authenticated", () => {
  console.log("📲 WhatsApp conectado ao celular!");
});
// Quando o cliente estiver pronto
//client.on('ready', () => {
  //  console.log('Tudo certo! WhatsApp conectado.');
    


// Executa a função a cada 5 minuto para garantir precisão
//setInterval(enviarLembretes, 5 * 60 * 1000);



//});

//client.initialize();

// Função para criar delay
const delay = ms => new Promise(res => setTimeout(res, ms));

// Variáveis para armazenar os dados do cliente e do agendamento
let cliente_nome = '';
//let data_agendamento = '';
//let horario_agendamento = '';
//let servico_id = '';


// Manipulação de mensagens
// Manipulação de mensagens
client.on('message', async msg => {
    const cliente_telefone = msg.from.split('@')[0];

    // Resposta ao menu inicial
    if (/^(menu|Menu|dia|tarde|noite|oi|Oi|Voltar|voltar|Olá|olá|ola|Ola)$/i.test(msg.body) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname || "Cliente";

        let cliente_telefone = msg.from.split('@')[0];
        let cliente_nome = name;

        let loja1= "Loja01";
        let loja2="Loja02";
        
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);

        await client.sendMessage(
            msg.from,
            `Olá, ${name.split(" ")[0]}! 👋 Eu sou o assistente virtual do *Lojas Terel*. Como posso ajudá-lo(a) hoje? Escolha uma das opções abaixo:\n\n` +
            `1️⃣ - Serviços e preços\n` +
            `2️⃣ - Ganhar brindes\n` +
            `3️⃣ - Promoções da semana\n` +
            `4️⃣ - Localização\n` +
            `5️⃣ - Outras dúvidas\n` +
            `6️⃣ - Consultar agendamento`
        );
  
      let usuario_responsavel = "";

let endereco_loja1 = "Loja01";
let endereco_loja2 = "Loja02";

// Perguntar se o cliente é da região do Grajaú
async function perguntarRegiao() {
    await client.sendMessage(
        msg.from,
        `🏠 Olá, *${name.split(" ")[0]}*! Você é da região do Grajaú? \n\n` +
        `🔹 Digite *sim* se for da região do Grajaú ou *não* caso contrário.`
    );
}

// Capturar a resposta e definir a loja
async function capturarResposta(resposta) {
    if (resposta.toLowerCase() === "sim") {
        endereco_cliente = endereco_loja1;
    } else if (resposta.toLowerCase() === "não") {
        endereco_cliente = endereco_loja2;
    } else {
        await client.sendMessage(
            msg.from,
            '❌ Resposta inválida. Por favor, responda *sim* ou *não*.'
        );
        return;
    }

    verificarEndereco();
}

function verificarEndereco() {
    if (endereco_cliente === endereco_loja1) {
        usuario_responsavel = "Loja01";
        dispararCadastro(usuario_responsavel);
    } else if (endereco_cliente === endereco_loja2) {
        usuario_responsavel = "Loja02";
        dispararCadastro(usuario_responsavel);
    } else {
        console.log("Endereço do cliente não corresponde a nenhuma loja.");
    }
}

async function dispararCadastro(loja) {

  let usuario_responsavel=loja;
  
    try {
        const protocoloResponse = await axios.post('https://lojamaster.antoniooliveira.shop/Bot/gerar_protocolo.php', {
            cliente_nome,
            cliente_telefone,
            usuario_responsavel
        });
        console.log("Cadastro disparado com sucesso para", loja);
    } catch (error) {
        await client.sendMessage(msg.from, '❌ Erro ao confirmar o agendamento. Tente novamente.');
    }
}
          perguntarRegiao();
    }
    // Resposta para a opção "Serviços e Preços"
    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);

        let servicosDisponiveis = {};
        try {
            const response = await axios.get('https://lojamaster.antoniooliveira.shop/Bot/consultar-servicos_bot.php');
            servicosDisponiveis = response.data.servicos;
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            await client.sendMessage(msg.from, '❌ Erro ao consultar serviços. Tente novamente mais tarde.');
            return;
        }
       
        const listaServicos = Object.entries(servicosDisponiveis)
            .map(([codigo, { nome, preco }]) => ` ${nome} - R$ ${preco}`)
            .join('\n');
       
        await client.sendMessage(
            msg.from,
            `💇‍♀️ *Produtos e Preços* 💇‍♂️\n\n` +
            `📦 *Confira nossos produtos e preços abaixo:*\n${listaServicos}\n\n` +
            `🔹 Digite *2* para agendar seu horário!`
        );
    }

    // Resposta para "Localização"
    if (msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);

        await client.sendMessage(
            msg.from,
            `📍 *Localização das Lojas Terel* 📍\n\n` +
            `Endereço: Vila São José, Centro\n` +
            `Cidade: São Paulo - SP\n\n` +
            `Estamos ansiosos para sua visita! 😊`
        );
    }

    // Função delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Resposta para "Promoções da Semana"
    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);

        let servicosDisponiveis = {};
        try {
            const response = await axios.get('https://lojamaster.antoniooliveira.shop/Bot/consultar-servicos_bot_p.php');
            servicosDisponiveis = response.data.servicos;
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            await client.sendMessage(msg.from, '❌ Erro ao consultar serviços. Tente novamente mais tarde.');
            return;
        }

        const listaServicos = Object.entries(servicosDisponiveis)
            .map(([codigo, { nome, preco }]) => ` ${nome} - R$ ${preco}`)
            .join('\n');

        await client.sendMessage(
            msg.from,
            `🎉 *Promoções da Semana* 🎉\n\n` +
            `📝\n${listaServicos}\n` +
            `Aproveite essas ofertas incríveis! Válidas até sábado. 💅\n\n` + 
            `Digite *2* para agendar seu horário!\n`
        );
    }

    // Resposta para "Outras Dúvidas"
    if (msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(2000);
        await chat.sendStateTyping();
        await delay(2000);

        await client.sendMessage(
            msg.from,
            `❓ *Outras Dúvidas* ❓\n\n` +
            `Por favor, descreva sua dúvida que entraremos em contato para ajudá-lo(a).`
        );
    }

    // Menu 2
    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        (async () => {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(2000);

            let cliente_nome = '';
            let cliente_telefone = msg.from.split('@')[0];
            let protocolo = '';
            let confirmacao = false;

            async function solicitarCampo(campo, mensagemValidacao, regex = null, mensagemConfirmacao = '') {
                let campoValido = false;
                while (!campoValido) {
                    if (!campo || (regex && typeof campo === 'string' && !regex.test(campo))) {
                        await client.sendMessage(msg.from, mensagemValidacao);
                        const resposta = await esperarMensagem(msg.from);
                        
                        if (resposta.trim().toLowerCase() === 'menu') {
                            await client.sendMessage(msg.from, '🔙 Retornando ao menu principal.');
                            return null;
                        }
                        campo = resposta.trim();
                    } else {
                        campoValido = true;
                    }
                }

                if (mensagemConfirmacao) {
                    await client.sendMessage(msg.from, `✅ ${mensagemConfirmacao}: ${campo}`);
                }
                return campo;
            }

            async function esperarMensagem(user) {
                return new Promise((resolve) => {
                    const listener = (response) => {
                        if (response.from === user) {
                            client.off('message', listener);
                            resolve(response.body);
                        }
                    };
                    client.on('message', listener);
                });
            }

            let servicosDisponiveis = {};
            try {
                const response = await axios.get('https://lojamaster.antoniooliveira.shop/Bot/consultar-servicos_bot.php');
                servicosDisponiveis = response.data.servicos;
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
                await client.sendMessage(msg.from, '❌ Erro ao consultar serviços. Tente novamente mais tarde.');
                return;
            }

            await client.sendMessage(msg.from, 
                `🌟 *Ganhar brindes* 🌟\n\n` +
                `Digite *Nome Completo:*\n\n` +
                `Digite *Menu* para retornar ao menu principal.`
            );

            cliente_nome = await solicitarCampo(
                null, 
                '❌ Nome inválido. Por favor, envie seu nome completo sem números.', 
                /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
                'Nome recebido'
            );

            if (!cliente_nome) return;

            await client.sendMessage(msg.from,
                `📝 Confirme as informações:\n\n` +
                `Nome: ${cliente_nome}\n` +
                `Digite *Sim* ✅ para confirmar\nDigite *Cancelar* ❌ para cancelar e voltar ao menu principal\nDigite *Menu* para retornar ao menu principal.`
            );

            const resposta = await esperarMensagem(msg.from);
            if (resposta.trim().toLowerCase() !== 'sim') {
                await client.sendMessage(msg.from, '❌ Agendamento cancelado. Retornando ao menu principal.');
                return;
            }

            try {
                const protocoloResponse = await axios.post('https://lojamaster.antoniooliveira.shop/Bot/gerar_protocolo.php', {
                    cliente_nome,
                    cliente_telefone
                });

                protocolo = protocoloResponse.data.protocolo;

                if (protocolo) {
                    await client.sendMessage(msg.from,
                        `✅ *Você está cadastrado e Confirmado!*\n` +
                        `📜 *Protocolo:* ${protocolo}\n` +
                        `👤 *Nome:* ${cliente_nome}\n`
                    );
                } else {
                    await client.sendMessage(msg.from, '❌ Erro ao gerar protocolo. Tente novamente.');
                }
            } catch (error) {
                console.error("Erro no cadastro:", error);
                await client.sendMessage(msg.from, '❌ Erro ao cadastrar, tente novamente!');
            }
        })();
    }
});



const agendamentosNotificados = new Set();

async function enviarLembretes() {
    try {
        const response = await axios.get('https://antoniooliveira.shop/consultar-agendamentos.php');

        if (!response.data || !Array.isArray(response.data.agendamentos) || response.data.agendamentos.length === 0) {
            console.log('⚠️ Nenhum agendamento encontrado.');
            return;
        }

        const agendamentos = response.data.agendamentos;

        for (const agendamento of agendamentos) {
            const { cliente_telefone, cliente_nome, servico, data_agendamento, horario_agendamento } = agendamento;

            if (![cliente_telefone, cliente_nome, servico, data_agendamento, horario_agendamento].every(Boolean)) {
                console.log(`⚠️ Dados incompletos para um agendamento. Verifique na plataforma. Dados:`, agendamento);
                continue;
            }

            // Formatar data e hora
            const dataObj = new Date(`${data_agendamento}T${horario_agendamento}`);

            if (isNaN(dataObj)) {
                console.log(`❌ Erro ao processar data para ${cliente_telefone}: ${data_agendamento} ${horario_agendamento}`);
                continue;
            }

            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

            const chaveUnica = `${cliente_telefone}-${dataFormatada}-${horaFormatada}`;
            if (agendamentosNotificados.has(chaveUnica)) {
                console.log(`⏳ Lembrete já enviado para ${cliente_telefone}, ignorando...`);
                continue;
            }

            const mensagem = `🔔 Olá, ${cliente_nome}! Lembrete do seu agendamento:\n\n📅 Data: ${dataFormatada}\n🕒 Horário: ${horaFormatada}\n💇 Serviço: ${servico}\n\nEstamos te esperando! 😊`;

            if (!client || !client.sendMessage) {
                console.error('❌ Erro: client.sendMessage não está definido. Verifique a conexão do bot.');
                return;
            }

            const numeroWhatsApp = `${cliente_telefone}@c.us`;
            await client.sendMessage(numeroWhatsApp, mensagem);
            agendamentosNotificados.add(chaveUnica);
            console.log(`📩 Lembrete enviado para ${cliente_telefone}`);
        }
    } catch (error) {
        console.error('❌ Erro ao buscar agendamentos:', error.message || error);
    }
}
