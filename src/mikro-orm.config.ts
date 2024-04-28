import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Reise } from './entities/reise';
import { Reiseziel } from './entities/reiseziel';
import { Teilnehmer } from './entities/teilnehmer';
import { Zeitraum } from './entities/zeitraum';

export default defineConfig({
    driver: PostgreSqlDriver,
    dbName: 'fwe2024_travelAgency',
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    entitiesTs: [Reise, Reiseziel, Teilnehmer, Zeitraum],
    entities:[Reise, Reiseziel, Teilnehmer, Zeitraum],
    metadataProvider: TsMorphMetadataProvider,
    debug: true,
});
