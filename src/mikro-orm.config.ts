import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Reise } from './entities/reise';
import { Reiseziel } from './entities/reiseziel';
import { Teilnehmer } from './entities/teilnehmer';
import { Zeitraum } from './entities/zeitraum';
import { UserData } from './entities/user';

export default defineConfig({
    driver: PostgreSqlDriver,
    dbName: 'fwe2024_travelAgency',
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    //define the entities here so that mikro orm will recognise it
    entitiesTs: [Reise, Reiseziel, Teilnehmer, Zeitraum, UserData],
    entities:[Reise, Reiseziel, Teilnehmer, Zeitraum, UserData],
    metadataProvider: TsMorphMetadataProvider,
    debug: true,
});
