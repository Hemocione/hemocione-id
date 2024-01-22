# Hemocione ID

npm start

## Importação de doações

batemos no endpoint de busca de cada provedor em busca das doações dos usuários - no primeiro login batemos na rota passando alguns filtros extras:

- hemocioneId
- email
- telefone

ao mesmo tempo, de tempos em tempos batemos na mesma rota passando um outro filtro:

- minDonationDate

dependendo do filtro, o endpoint do provedor deve retornar a lista de doações, ordenadas por donationDate, para o hemocioneId.
este endpoint unico serve tanto para a importação de tempos em tempos das doações como para a importação de um usuários específico

logo, o endpoint deve:

suportar paginação usual (*page* & *limit* como parametros)
suportar os filtros: *hemocioneId*, *email*, *telefone* e *minDonationDate*

Note que os 3 primeiros devem funcionar como um "possivel match" - se uma doação pertencer a alguem com um hemocioneId igual mas com um email diferente do passado, essa doação deve ser retornada pelo endpoint. o mesmo vale para o caso contrário. o parâmetro "forte" é o minDonationDate

Resposta esperada do endpoint de doação:

`GET {seu_endpoint}/?page=0&limit=1` 

```json
[
  {
    "id": "id-doação",
    "hemocioneId": null ou "id-usuario",
    "email": null ou "email@pessoa",
    "telefone": null ou "telefone", // apenas numeros incluindo DDD e codigo de pais - exemplo BR: 5521984426717 seria um retorno valido.
    "donationDate": DATETIME ISO8601 em UTC (exemplo: "2023-02-15T15:00:00Z")
  }
]
```

OBS: a primeira página é a 0, não a 1. certifique-se de levar isso em consideração na sua implementação;

Para garantir a segurança da importação de dados, um `secret` é gerado para cada provedor. Este secret é enviado em toda requisição no header `x-secret-hemocione` e é compartilhado com o provedor para a validação deste segredo em cada requisição. 