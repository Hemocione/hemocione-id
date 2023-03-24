// aqui temos apenas erros não esperados pela aplicação.
// podemos enviar para o sentry, por exemplo.
function errorsMiddleware(err, req, res, _) {
  console.error(err);
  res.header("Content-Type", "application/json");
  res
    .status(err.statusCode || 500)
    .json({
      message:
        "Desculpe, um erro inesperado aconteceu. Por favor, tente novamente.",
    }); // pretty print
}

function notFoundRoute(req, res, _) {
  res.status(404).json({ error: "Route NOT FOUND" });
}

module.exports = { errorsMiddleware, notFoundRoute };
