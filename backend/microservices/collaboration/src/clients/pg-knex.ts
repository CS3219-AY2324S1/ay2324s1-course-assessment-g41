const objection = require('objection')

const { knexSnakeCaseMappers } = objection

export const knexPgClient = require('knex')({
  client: 'pg',
  connection: process.env.POSTGRES_COLLAB,
  // set min to 0 so all idle connections can be terminated
  pool: { min: 0, max: 10 },
  ...knexSnakeCaseMappers({ underscoreBeforeDigits: true })
});
