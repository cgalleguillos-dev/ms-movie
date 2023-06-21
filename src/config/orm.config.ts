import { ConfigModule } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { Movie, Actor, Genre } from "../entities";


ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
})

const entities = [Movie, Actor, Genre];
const DevelopmentDatabaseOptions: DataSourceOptions = {
    type: process.env.TYPEORM_CONNECTION as any,
    host: 'localhost',
    port: 5432,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: entities,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

const DatabaseOptions: DataSourceOptions = {
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: entities,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
}

const TestDatabaseOptions: DataSourceOptions = {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: entities,
    synchronize: true,
    logging: false,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
}
class DataSourceFactory {
    dataSourceOptions: DataSourceOptions;

    private constructor() { }

    static getDataSourceOptions(nodeEnv: string): DataSourceOptions {
        switch (nodeEnv) {
            case 'dev':
                return DevelopmentDatabaseOptions;
            case 'test':
                return TestDatabaseOptions;
            default:
                return DatabaseOptions;
        }
    }
}

const DataSourceConfig = DataSourceFactory.getDataSourceOptions(process.env.NODE_ENV);

export { DataSourceConfig };

export const AppDS = new DataSource(DataSourceConfig)