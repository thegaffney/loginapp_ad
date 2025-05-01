-- Manually create your database first then run the following on your database

CREATE SCHEMA IF NOT EXISTS data AUTHORIZATION slate_apps;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- For GUID generation

-- For tracking cookies
CREATE TABLE data.session (
	guid_id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    ad_user json NOT NULL,
    date_expired timestamp without time zone
);

-- Allows user to access tables
GRANT USAGE ON SCHEMA data to slate_apps;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA data TO GROUP slate_apps;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA data TO GROUP slate_apps;