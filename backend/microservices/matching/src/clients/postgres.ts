// import { Pool, QueryResult, QueryResultRow } from 'pg';

// class PostgresClient {
//     private readonly pool: Pool;

//     constructor(connectionString: string) {
//         this.pool = new Pool({
//             max: process.env.POSTGRES_CONN_COUNT ? parseInt(process.env.POSTGRES_CONN_COUNT) : undefined,
//             connectionString: connectionString,
//             idleTimeoutMillis: process.env.POSTGRES_TIMEOUT ? parseInt(process.env.POSTGRES_TIMEOUT) : undefined
//         });
//     }

//     public async query<T extends QueryResultRow>(
//         sql: string,
//         values?: any[]
//     ): Promise<QueryResult<T>> {
//         const client = await this.pool.connect();

//         try {
//             return await client.query(sql, values);
//         } finally {
//             client.release(); 
//         }
//     }

//     public async disconnect(): Promise<void> {
//         await this.pool.end();
//     }

//     public async getConnection() {
//         return this.pool.connect()
//     }
// }

// const connString = process.env.POSTGRES
// if (!connString) {
//     console.log("Missing conn string for postgres")
//     process.exit()
// }

// const postgresClient = new PostgresClient(connString);

// export default postgresClient