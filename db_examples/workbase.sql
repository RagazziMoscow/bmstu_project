--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.8
-- Dumped by pg_dump version 9.4.8
-- Started on 2017-05-16 12:10:16 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 2056 (class 1262 OID 18399)
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
-- TOC entry 2059 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 176 (class 1259 OID 30641)
-- Name: template_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE template_id_seq OWNER TO admin;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 175 (class 1259 OID 30638)
-- Name: template; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE template (
    template_id integer DEFAULT nextval('template_id_seq'::regclass) NOT NULL,
    name text NOT NULL,
    data text NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE template OWNER TO admin;

--
-- TOC entry 174 (class 1259 OID 30554)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO admin;

--
-- TOC entry 173 (class 1259 OID 30483)
-- Name: user; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE "user" (
    user_id integer DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
    login text NOT NULL,
    password text NOT NULL,
    user_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL
);


ALTER TABLE "user" OWNER TO admin;

--
-- TOC entry 2050 (class 0 OID 30638)
-- Dependencies: 175
-- Data for Name: template; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- TOC entry 2060 (class 0 OID 0)
-- Dependencies: 176
-- Name: template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('template_id_seq', 4, true);


--
-- TOC entry 2048 (class 0 OID 30483)
-- Dependencies: 173
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO "user" (user_id, login, password, user_name, email, phone) VALUES (2, 'admin', 'admin', 'Ilya', 'zzaerodromio@gmail.com', '79035834301');
INSERT INTO "user" (user_id, login, password, user_name, email, phone) VALUES (4, 'victor', '1312', 'Виктор', 'victor@gmail.com', '790035834301');
INSERT INTO "user" (user_id, login, password, user_name, email, phone) VALUES (3, 'cekavo', '1312', 'Чекаво', 'cekavo@gmail.com', '790035834301');
INSERT INTO "user" (user_id, login, password, user_name, email, phone) VALUES (12, 'iliya', 'admin', 'iliya', 'iliya5376@mail.com', '+79035833576');


--
-- TOC entry 2061 (class 0 OID 0)
-- Dependencies: 174
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('user_id_seq', 12, true);


--
-- TOC entry 1937 (class 2606 OID 30648)
-- Name: pk_template; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY template
    ADD CONSTRAINT pk_template PRIMARY KEY (template_id);


--
-- TOC entry 1932 (class 2606 OID 30490)
-- Name: pk_user; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT pk_user PRIMARY KEY (user_id);


--
-- TOC entry 1934 (class 2606 OID 30553)
-- Name: user_login_key; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_login_key UNIQUE (login);


--
-- TOC entry 1935 (class 1259 OID 30656)
-- Name: fki_owner; Type: INDEX; Schema: public; Owner: admin; Tablespace: 
--

CREATE INDEX fki_owner ON template USING btree (owner_id);


--
-- TOC entry 1938 (class 2606 OID 30651)
-- Name: owner; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY template
    ADD CONSTRAINT owner FOREIGN KEY (owner_id) REFERENCES "user"(user_id);


--
-- TOC entry 2058 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-05-16 12:10:16 MSK

--
-- PostgreSQL database dump complete
--

