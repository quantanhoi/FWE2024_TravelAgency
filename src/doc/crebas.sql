/*==============================================================*/
/* DBMS name:      PostgreSQL 14.x                              */
/* Created on:     4/26/2024 5:38:29 PM                         */
/*==============================================================*/
drop index if exists ASSOCIATION_3_FK;

drop index if exists REISE_PK;

drop table if exists Reise cascade;

drop index if exists ASSOCIATION_4_FK2;

drop index if exists ASSOCIATION_4_FK;

drop index if exists ASSOCIATION_4_PK;

drop table if exists Reise_Reiseziel cascade;

drop index if exists ASSOCIATION_5_FK;

drop index if exists REISEZIEL_PK;

drop table if exists Reiseziel cascade;

drop index if exists TEILNEHMER_PK;

drop table if exists Teilnehmer cascade;

drop index if exists ASSOCIATION_2_FK2;

drop index if exists ASSOCIATION_2_FK;

drop index if exists ASSOCIATION_2_PK;

drop table if exists Teilnehmer_Reise cascade;

drop index if exists ZEITRAUM_PK;

drop table if exists Zeitraum cascade;

drop table if exists userData cascade;

/*==============================================================*/
/* Table: Reise                                                 */
/*==============================================================*/
create table Reise (
   r_id serial not null,
   z_id integer not null,
   r_Name varchar(254),
   r_Beschreibung varchar(254),
   r_Bild varchar(254),
   constraint PK_REISE primary key (r_id)
);

/*==============================================================*/
/* Index: REISE_PK                                              */
/*==============================================================*/
create unique index REISE_PK on Reise (r_id);

/*==============================================================*/
/* Index: ASSOCIATION_3_FK                                      */
/*==============================================================*/
create index ASSOCIATION_3_FK on Reise (z_id);

/*==============================================================*/
/* Table: Reise_Reiseziel                                       */
/*==============================================================*/
create table Reise_Reiseziel (
   r_id integer not null,
   rz_id integer not null,
   constraint PK_REISE_REISEZIEL primary key (r_id, rz_id)
);

/*==============================================================*/
/* Index: ASSOCIATION_4_PK                                      */
/*==============================================================*/
create unique index ASSOCIATION_4_PK on Reise_Reiseziel (r_id, rz_id);

/*==============================================================*/
/* Index: ASSOCIATION_4_FK                                      */
/*==============================================================*/
create index ASSOCIATION_4_FK on Reise_Reiseziel (r_id);

/*==============================================================*/
/* Index: ASSOCIATION_4_FK2                                     */
/*==============================================================*/
create index ASSOCIATION_4_FK2 on Reise_Reiseziel (rz_id);

/*==============================================================*/
/* Table: Reiseziel                                             */
/*==============================================================*/
create table Reiseziel (
   rz_id serial not null,
   z_id integer not null,
   rz_Name varchar(254),
   rz_Beschreibung varchar(254),
   rz_Bild varchar(254),
   constraint PK_REISEZIEL primary key (rz_id)
);

/*==============================================================*/
/* Index: REISEZIEL_PK                                          */
/*==============================================================*/
create unique index REISEZIEL_PK on Reiseziel (rz_id);

/*==============================================================*/
/* Index: ASSOCIATION_5_FK                                      */
/*==============================================================*/
create index ASSOCIATION_5_FK on Reiseziel (z_id);

/*==============================================================*/
/* Table: Teilnehmer                                            */
/*==============================================================*/
create table Teilnehmer (
   t_id serial not null,
   t_Name varchar(254),
   constraint PK_TEILNEHMER primary key (t_id)
);

/*==============================================================*/
/* Index: TEILNEHMER_PK                                         */
/*==============================================================*/
create unique index TEILNEHMER_PK on Teilnehmer (t_id);

/*==============================================================*/
/* Table: Teilnehmer_Reise                                      */
/*==============================================================*/
create table Teilnehmer_Reise (
   r_id integer not null,
   t_id integer not null,
   constraint PK_TEILNEHMER_REISE primary key (r_id, t_id)
);

/*==============================================================*/
/* Index: ASSOCIATION_2_PK                                      */
/*==============================================================*/
create unique index ASSOCIATION_2_PK on Teilnehmer_Reise (r_id, t_id);

/*==============================================================*/
/* Index: ASSOCIATION_2_FK                                      */
/*==============================================================*/
create index ASSOCIATION_2_FK on Teilnehmer_Reise (r_id);

/*==============================================================*/
/* Index: ASSOCIATION_2_FK2                                     */
/*==============================================================*/
create index ASSOCIATION_2_FK2 on Teilnehmer_Reise (t_id);

/*==============================================================*/
/* Table: Zeitraum                                              */
/*==============================================================*/
create table Zeitraum (
   z_id serial not null,
   z_startDate timestamp,
   z_endDate timestamp,
   constraint PK_ZEITRAUM primary key (z_id)
);

/*==============================================================*/
/* Index: ZEITRAUM_PK                                           */
/*==============================================================*/
create unique index ZEITRAUM_PK on Zeitraum (z_id);

alter table
   Reise
add
   constraint FK_REISE_ASSOCIATI_ZEITRAUM foreign key (z_id) references Zeitraum (z_id) on delete restrict on update restrict;

alter table
   Reise_Reiseziel
add
   constraint FK_REISE_RE_ASSOCIATI_REISE foreign key (r_id) references Reise (r_id) on delete restrict on update restrict;

alter table
   Reise_Reiseziel
add
   constraint FK_REISE_RE_ASSOCIATI_REISEZIE foreign key (rz_id) references Reiseziel (rz_id) on delete restrict on update restrict;

alter table
   Reiseziel
add
   constraint FK_REISEZIE_ASSOCIATI_ZEITRAUM foreign key (z_id) references Zeitraum (z_id) on delete restrict on update restrict;

alter table
   Teilnehmer_Reise
add
   constraint FK_TEILNEHM_ASSOCIATI_REISE foreign key (r_id) references Reise (r_id) on delete restrict on update restrict;

alter table
   Teilnehmer_Reise
add
   constraint FK_TEILNEHM_ASSOCIATI_TEILNEHM foreign key (t_id) references Teilnehmer (t_id) on delete restrict on update restrict;






CREATE OR REPLACE FUNCTION update_zeitraum()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the earliest start date and the latest end date from Reiseziel linked to the Reise
    WITH date_ranges AS (
        SELECT 
            MIN(z.z_startDate) AS start_date,
            MAX(z.z_endDate) AS end_date
        FROM 
            Reiseziel rz
        JOIN 
            Reise_Reiseziel rrz ON rz.rz_id = rrz.rz_id
        JOIN
            Zeitraum z ON rz.z_id = z.z_id
        WHERE 
            rrz.r_id = NEW.r_id OR rrz.r_id = OLD.r_id
    )
    UPDATE 
        Zeitraum
    SET 
        z_startDate = (SELECT start_date FROM date_ranges),
        z_endDate = (SELECT end_date FROM date_ranges)
    WHERE 
        z_id = (SELECT z_id FROM Reise WHERE r_id = NEW.r_id OR r_id = OLD.r_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;




-- Trigger for updates on the linking table if entries are added or removed
CREATE TRIGGER trg_update_zeitraum_after_link_update
AFTER INSERT OR UPDATE OR DELETE ON Reise_Reiseziel
FOR EACH ROW
EXECUTE FUNCTION update_zeitraum();


--user for JWT test
CREATE TABLE userData(
	u_id serial not null,
	u_email varchar(254) not null,
	u_name varchar(254) not null,
	u_password varchar(512) not null,
   UNIQUE(u_email)
);