const { competition, sequelize } = require('../db/models');

const getCompetitions = async () => {
  // status 2 = ativo, 1 = upcoming, 0 = finalizado
  const statusCaseWhenClause = `
    CASE
      WHEN CURRENT_TIMESTAMP > end_at THEN 0
      WHEN CURRENT_TIMESTAMP < start_at THEN 1
      ELSE 2
    END`

  return (
    await competition.findAll({
      attributes: [
        'id', 'name', 'start_at', 'end_at',
        [sequelize.literal(statusCaseWhenClause), 'status']
      ],
      order: [
        [sequelize.literal(statusCaseWhenClause), 'DESC'],
        ['start_at', 'ASC']
      ]
    })
  )
}

module.exports = { getCompetitions }
