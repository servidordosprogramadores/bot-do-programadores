# Bot dos Programadores

Este é um bot para Discord focado em comunidades de programação, desenvolvido em Node.js utilizando [discord.js](https://discord.js.org/) e [Express](https://expressjs.com/).

## Como executar o projeto

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/bot-dos-programadores.git
   cd bot-dos-programadores
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configure o arquivo `.env`:**
   - Preencha as variáveis necessárias, como `BOT_TOKEN`, `CHAT_CHANNEL_ID`, etc.
```
   BOT_TOKEN=
CHAT_CHANNEL_ID=
SUGESTIONS_CHANNEL_ID=
ROLES_CHANNEL_ID=
NEWS_CHANNEL_ID=
HELP_CHANNEL_ID=
TECH_CHANNEL_ID=
COLOR_CHANNEL_ID=
```
4. **Inicie o bot:**
   ```sh
   npm run start
   ```
   O bot irá iniciar o servidor Express em `http://localhost:3000` e conectar ao Discord.

## Estrutura do Projeto

- `index.js`: Arquivo principal, inicializa o bot e o servidor Express.
- `src/`: Código-fonte do bot.
  - `techs/`: Funções relacionadas a tecnologias/cargos.
  - `colors/`: Funções para seleção de cores.
  - `messages/`: Mensagens automáticas e eventos.
  - `embeds/`: Embeds especiais para canais.

## Dicas

- Certifique-se de que o bot tem permissões suficientes no servidor Discord.
- Use Node.js 18+ para melhor compatibilidade.
- Consulte os arquivos em `src/` para entender como adicionar novas funcionalidades.

---

Contribuições são bem-vindas!# Bot dos Programadores