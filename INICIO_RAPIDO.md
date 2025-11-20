# 🚀 Guia de Início Rápido

## Passo a Passo para Executar o Projeto

### 1. Verificar Pré-requisitos

Certifique-se de que você tem:
- ✅ Node.js instalado (versão 14 ou superior)
- ✅ Backend Django rodando em `http://localhost:8000`

### 2. Instalar Dependências

As dependências já foram instaladas. Se precisar reinstalar:

```bash
npm install
```

### 3. Iniciar o Backend Django

Em um terminal, navegue até o diretório do backend e execute:

```bash
python manage.py runserver
```

O backend deve estar rodando em `http://localhost:8000`

### 4. Iniciar o Frontend React

Em outro terminal, no diretório do frontend, execute:

```bash
npm start
```

O frontend será aberto automaticamente em `http://localhost:3000`

### 5. Usar o Sistema

1. **Clientes**: 
   - Visualize todos os clientes cadastrados
   - Clique em "Novo Cliente" para adicionar
   - Use "Editar" para modificar um cliente
   - Use "Excluir" para remover um cliente

2. **Cobranças**:
   - Visualize todas as cobranças
   - Use o filtro para ver cobranças por status
   - Clique em "Marcar Pago" para atualizar o status

3. **Planos**:
   - Visualize todos os planos disponíveis
   - Veja valores e periodicidades

## 🔧 Configuração da API

Se o backend estiver em outra URL, você pode:

1. Criar um arquivo `.env` na raiz do projeto:
```
REACT_APP_API_URL=http://sua-url:porta/api
```

2. Ou editar diretamente `src/services/api.js` e alterar a `baseURL`

## ⚠️ Problemas Comuns

### Erro de CORS
- Certifique-se de que o CORS está configurado no backend Django
- O backend deve aceitar requisições de `http://localhost:3000`

### Erro de Conexão
- Verifique se o backend está rodando
- Verifique se a URL da API está correta
- Verifique os logs do console do navegador

### Porta 3000 já em uso
- O React tentará usar outra porta automaticamente
- Ou pare o processo que está usando a porta 3000

## 📝 Notas

- O frontend está totalmente funcional e integrado com a API
- Todos os erros são tratados e exibidos ao usuário
- A interface é responsiva e funciona em dispositivos móveis


