# n8n-nodes-random

n8n – Custom Node Random

Este repositório contém:

Infraestrutura Docker para rodar o n8n (self-hosted) com banco PostgreSQL.

Um conector personalizado (custom node) chamado Random, que consome a API do Random.org
 para gerar um número inteiro aleatório entre valores mínimo e máximo (inclusive).

🚀 Pré-requisitos

Docker
 e Docker Compose
 instalados

Node.js 22 LTS
 + npm (necessário para compilar o custom node)

Git para clonar o repositório

🛠 Instalação das dependências

Clone o repositório:

git clone https://github.com/<seu-usuario>/<seu-repositorio>.git
cd <seu-repositorio>


Instale e compile o custom node:

npm install n8n -g
npm install
npm run build

⚙️ Configuração do ambiente

Crie um arquivo .env na raiz (pode usar o exemplo abaixo):

# Configuração do banco Postgres
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8n

# n8n
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http


Ajuste os valores se necessário.

▶️ Executar o serviço localmente (Docker)

Na raiz do repositório:

docker compose up -d


O n8n estará disponível em: http://localhost:5678

🧩 Utilizando o custom node Random

Acesse a interface web do n8n.

Crie um novo workflow.

Adicione o node Random.

Selecione a operação True Random Number Generator.

Preencha os parâmetros:

Min: inteiro mínimo (inclusive).

Max: inteiro máximo (inclusive).

Clique em Execute Node.

Exemplo de saída JSON:

{
  "value": 37,
  "min": 1,
  "max": 60,
  "source": "random.org",
  "url": "https://www.random.org/integers/?num=1&min=1&max=60&col=1&base=10&format=plain&rnd=new",
  "timestamp": "2025-09-20T10:00:00.000Z"
}

🧪 Executar os testes

Este projeto não inclui testes automatizados por padrão.
Sugestão: criar testes unitários (ex.: com Jest) para validar:

Validação de parâmetros (min, max).

Integração com a API do Random.org (mock).

💡 Informações adicionais

Carregamento de custom nodes: O diretório custom/ é montado no container em /home/node/.n8n/custom e o n8n carrega automaticamente qualquer pacote que exponha nós em package.json → n8n.nodes.

Alterações no node: sempre execute npm run build no pacote antes de reiniciar o container.

Para reiniciar apenas o n8n:

docker compose restart n8n


Caso não veja o node na interface, verifique os logs:

docker compose logs -f n8n
