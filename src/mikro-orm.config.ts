import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options, PostgreSqlDriver} from '@mikro-orm/postgresql';
import { Reise } from './entities/reise';
import { Reiseziel } from './entities/reiseziel';
import { Teilnehmer } from './entities/teilnehmer';
import { Zeitraum } from './entities/zeitraum';

    export default {
        entitiesTs: [Reise, Reiseziel, Teilnehmer, Zeitraum],
        dbName: 'fwe2024_travelAgency',
        type: 'postgresql',
        driver: PostgreSqlDriver,
        host: '127.0.0.1',
        port: 3306,
        user: 'postgres',
        password: 'postgres',
        metadataProvider: TsMorphMetadataProvider,
        debug: true,
    } as Parameters<typeof MikroORM.init>[0];