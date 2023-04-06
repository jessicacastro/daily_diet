import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('datetime').notNullable()
    table.boolean('inDiet').notNullable().defaultTo(false)
    table.uuid('userId').notNullable().references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}
