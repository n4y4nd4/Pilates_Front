# Sistema de Cobrança Automatizada - Pilates (Frontend)

Frontend React para o Sistema de Cobrança Automatizada de Pilates, desenvolvido para se integrar com a API Django REST Framework.

## 🚀 Funcionalidades

- ✅ **Gerenciamento de Clientes**: Listagem, criação, edição e exclusão
- ✅ **Gerenciamento de Cobranças**: Visualização e marcação de pagamento
- ✅ **Visualização de Planos**: Listagem de planos disponíveis
- ✅ **Interface Moderna**: Design responsivo e intuitivo
- ✅ **Integração Completa**: Comunicação total com a API backend

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Backend Django rodando em `http://localhost:8000`

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

## 🏃 Executando o Projeto

1. Certifique-se de que o backend Django está rodando em `http://localhost:8000`

2. Inicie o servidor de desenvolvimento:

```bash
npm start
```

3. O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Clientes/       # Componentes de clientes
│   ├── Cobrancas/      # Componentes de cobranças
│   └── Planos/         # Componentes de planos
├── services/           # Serviços de API
│   ├── api.js          # Configuração do axios
│   ├── clientesService.js
│   ├── cobrancasService.js
│   └── planosService.js
├── App.js              # Componente principal
├── App.css             # Estilos globais
└── index.js            # Ponto de entrada
```

## 🔌 Configuração da API

A URL base da API está configurada em `src/services/api.js`. Por padrão, está configurada para:

```javascript
baseURL: 'http://localhost:8000/api'
```

Se o backend estiver em outra URL, edite este arquivo.

## 📱 Rotas

- `/` ou `/clientes` - Lista de clientes
- `/clientes/novo` - Formulário de novo cliente
- `/clientes/:id/editar` - Formulário de edição de cliente
- `/cobrancas` - Lista de cobranças
- `/planos` - Lista de planos

## 🎨 Funcionalidades por Página

### Clientes
- Visualização em tabela com todos os dados
- Criação de novos clientes
- Edição de clientes existentes
- Exclusão de clientes (com confirmação)
- Formatação de CPF e telefone
- Badges de status coloridos

### Cobranças
- Listagem de todas as cobranças
- Filtro por status (Todas, Pendentes, Pagas, Atrasadas, Canceladas)
- Marcação de cobrança como paga
- Formatação de valores monetários
- Visualização de datas formatadas

### Planos
- Visualização em cards
- Informações de valor e periodicidade
- Status ativo/inativo

## 🛠 Tecnologias Utilizadas

- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- CSS3 (estilos customizados)

## 📝 Notas

- O frontend está configurado para se comunicar com o backend em `http://localhost:8000`
- Certifique-se de que o CORS está configurado no backend para aceitar requisições de `http://localhost:3000`
- Todos os erros de API são tratados e exibidos ao usuário

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este projeto está configurado para desenvolvimento. Para produção:

1. Configure variáveis de ambiente para a URL da API
2. Implemente autenticação/autorização
3. Use HTTPS
4. Configure CORS adequadamente no backend

## 📞 Suporte

Para problemas ou dúvidas, verifique:

- Se o backend está rodando e acessível
- Se o CORS está configurado corretamente
- Os logs do console do navegador para erros

---

**Desenvolvido para integração com o backend Django REST Framework**

