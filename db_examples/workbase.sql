--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.8
-- Dumped by pg_dump version 9.4.8
-- Started on 2017-05-12 13:07:21 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 2036 (class 1262 OID 18399)
-- Name: workbase; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE workbase WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'ru_RU.UTF-8' LC_CTYPE = 'ru_RU.UTF-8';


ALTER DATABASE workbase OWNER TO admin;

\connect workbase

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 1 (class 3079 OID 11897)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2039 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 173 (class 1259 OID 30483)
-- Name: user; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE "user" (
    user_id integer NOT NULL,
    login text NOT NULL,
    password text NOT NULL,
    user_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL
);


ALTER TABLE "user" OWNER TO admin;

--
-- TOC entry 2031 (class 0 OID 30483)
-- Dependencies: 173
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO "user" (user_id, login, password, user_name, email, phone) VALUES (1, 'admin', 'admin', 'Dragan', 'zzearodromio@gmail.com', '+381646839502');


--
-- TOC entry 1921 (class 2606 OID 30490)
-- Name: pk_user; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT pk_user PRIMARY KEY (user_id);


--
-- TOC entry 2038 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-05-12 13:07:21 MSK

--
-- PostgreSQL database dump complete
--

