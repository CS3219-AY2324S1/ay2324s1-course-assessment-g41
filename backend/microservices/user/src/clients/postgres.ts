import pg from 'pg';

export interface PostgresError extends Error {
    code: string;
}

class PostgresClient {
    private readonly pool: pg.Pool;

    constructor(connectionString: string) {
        this.pool = new pg.Pool({
            max: process.env.POSTGRES_CONN_COUNT ? parseInt(process.env.POSTGRES_CONN_COUNT) : undefined,
            connectionString: connectionString,
            idleTimeoutMillis: process.env.POSTGRES_TIMEOUT ? parseInt(process.env.POSTGRES_TIMEOUT) : undefined
        });
    }

    public async query<T extends pg.QueryResultRow>(
        sql: string,
        values?: any[]
    ): Promise<pg.QueryResult<T>> {
        const client = await this.pool.connect();

        try {
            return await client.query(sql, values);
        } catch(error) {
            const e = error as PostgresError;
            console.log(e.code);

            throw(error)
        } finally {
            client.release(); 
        }
    }

    public async disconnect(): Promise<void> {
        await this.pool.end();
    }

    public async getConnection() {
        return this.pool.connect()
    }
}

const connString = process.env.POSTGRES
if (!connString) {
    console.log("Missing conn string for postgres")
    process.exit()
}

const postgresClient = new PostgresClient(connString);

export default postgresClient