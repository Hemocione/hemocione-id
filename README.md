# Hemocione ID

npm start

## Importação de doações

Para garantir a segurança da importação de dados, um `secret` é gerado para cada provedor. Este secret é enviado em toda requisição no header `x-secret-hemocione` e é compartilhado com o provedor para a validação deste segredo em cada requisição. 

### Usuário específico

batemos no endpoint de busca de cada provedor em busca das doações do usuário logando - no primeiro login batemos na rota passando alguns campos:

- hemocioneId
- email
- telefone

o endpoint deve retornar as doações do usuários passado como filtro, dando match em ao menos um campo dos mencionados.

Resposta esperada do endpoint de doação:

`GET {seu_endpoint} com os parametros acima`

RESPONSE:
```json
[
  {
    "id": "id-doacao",
    "hemocioneId": null ou "id-usuario",
    "email": null ou "email@pessoa",
    "telefone": null ou "telefone", // apenas numeros incluindo DDD e codigo de pais - exemplo BR: 5521984426717 seria um retorno valido.
    "donationDate": DATETIME ISO8601 em UTC (exemplo: "2023-02-15T15:00:00Z")
  }
]
```

### Bulk Import (TODO) - talvez aqui algo mais orientado a interface - Botão de "importar". Usuário "Liga" importações automáticas para uma dada fonte, por exemplo.
