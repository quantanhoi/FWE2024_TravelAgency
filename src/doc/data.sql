

-- Inserting data into Zeitraum for Reiseziel
INSERT INTO Zeitraum (z_startDate, z_endDate) VALUES
('2024-06-01 00:00:00', '2024-06-10 00:00:00'),
('2024-06-15 00:00:00', '2024-06-25 00:00:00'),
('2024-07-01 00:00:00', '2024-07-10 00:00:00'),
('2024-06-10 00:00:00', '2024-06-15 00:00:00'),
--testing insert null timestamp for reise (this will be updated due to trigger)
(null, null),
(null, null),
(null, null);


--testing insert null timestamp for reise


-- Inserting data into Reise
INSERT INTO Reise (z_id, r_Name, r_Beschreibung, r_Bild) VALUES
(5, 'Berlin Trip', 'Excursion to the capital city', 'berlin.jpg'),
(6, 'Munich Oktoberfest', 'Visit the world-famous beer festival', 'oktoberfest.jpg'),
(7, 'Black Forest Hike', 'Explore the scenic trails of the Black Forest', 'blackforest.jpg');

-- Inserting data into Reiseziel
INSERT INTO Reiseziel (z_id, rz_Name, rz_Beschreibung, rz_Bild) VALUES
(1, 'Brandenburg Gate', 'Iconic 18th-century gate', 'brandenburg.jpg'),
(2, 'Neuschwanstein Castle', '19th-century hilltop fairytale castle', 'neuschwanstein.jpg'),
(3, 'Lake Titisee', 'Popular lake in the Black Forest', 'titisee.jpg'),
(4, 'Berliner Fernsehturm', 'Iconic TV tower in Berlin', 'fernsehturm.jpg');  --extra data to test trigger function


-- Inserting data into Reise_Reiseziel (Linking trips with destinations)
INSERT INTO Reise_Reiseziel (r_id, rz_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4);


--password: admin
INSERT INTO userData (u_email, u_name, u_password, u_isAdmin) VALUES
('admin@admin.com', 'Admin', '$2a$12$FPnecWIYqu3wkzn7TyxcxO8SVZFGnmD/..lxKKo6KWJcMZtrDm48y', true);



-- Querying data from the database
select r.r_name, r.r_beschreibung, z.z_startDate, z.z_endDate from 
reise r join zeitraum z on r.z_id = z.z_id;

--check reiseziel and reise date
select r.r_name, r.r_beschreibung, rz.rz_name, rz.rz_beschreibung, z.z_startDate, z.z_endDate from reise r
join reise_reiseziel rrz on r.r_id = rrz.r_id
join reiseziel rz on rz.rz_id = rrz.rz_id
join zeitraum z on r.z_id = z.z_id
where r.r_id = 1;



--check reiseziel and reiseziel date
select r.r_name, r.r_beschreibung, rz.rz_name, rz.rz_beschreibung, z.z_startDate, z.z_endDate from reise r
join reise_reiseziel rrz on r.r_id = rrz.r_id
join reiseziel rz on rz.rz_id = rrz.rz_id
join zeitraum z on rz.z_id = z.z_id
where r.r_id = 1;