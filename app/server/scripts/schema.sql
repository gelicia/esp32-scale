SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
--
-- TOC entry 3178 (class 1262 OID 24577)
-- Name: scaleMeasurement; Type: DATABASE; Schema: -; Owner: kdurivage
--
CREATE DATABASE "scaleMeasurement" ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';

CREATE ROLE "nodeApp" WITH LOGIN;

\c "scaleMeasurement"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_with_oids = false;
--
-- TOC entry 199 (class 1259 OID 24600)
-- Name: measurements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.measurements (
    "measurementId" integer NOT NULL,
    weight numeric,
    impedance integer,
    "measurementDate" timestamp with time zone DEFAULT now(),
    lbm numeric,
    bmr numeric,
    "fatPercentage" numeric,
    "waterPercentage" numeric,
    "boneMass" numeric,
    "muscleMass" numeric,
    "visceralFat" numeric,
    bmi numeric,
    "proteinPercentage" numeric,
    "userId" integer
);


ALTER TABLE public.measurements OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 24598)
-- Name: measurements_measurementId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."measurements_measurementId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."measurements_measurementId_seq" OWNER TO postgres;

--
-- TOC entry 3179 (class 0 OID 0)
-- Dependencies: 198
-- Name: measurements_measurementId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."measurements_measurementId_seq" OWNED BY public.measurements."measurementId";


--
-- TOC entry 197 (class 1259 OID 24580)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    name character varying,
    height numeric,
    "lastLbm" numeric,
    "lastWeight" numeric,
    "weightUnit" character(3),
    "dateOfBirth" date,
    sex character(1)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 24578)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 3182 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 3046 (class 2604 OID 24603)
-- Name: measurements measurementId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurements ALTER COLUMN "measurementId" SET DEFAULT nextval('public."measurements_measurementId_seq"'::regclass);


--
-- TOC entry 3045 (class 2604 OID 24583)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 3051 (class 2606 OID 24608)
-- Name: measurements measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_pkey PRIMARY KEY ("measurementId");


--
-- TOC entry 3049 (class 2606 OID 24588)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 3178 (class 0 OID 0)
-- Dependencies: 199
-- Name: TABLE measurements; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.measurements TO "nodeApp";


--
-- TOC entry 3180 (class 0 OID 0)
-- Dependencies: 198
-- Name: SEQUENCE "measurements_measurementId_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public."measurements_measurementId_seq" TO "nodeApp";


--
-- TOC entry 3181 (class 0 OID 0)
-- Dependencies: 197
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO "nodeApp";


--
-- TOC entry 3183 (class 0 OID 0)
-- Dependencies: 196
-- Name: SEQUENCE users_userid_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_userid_seq TO "nodeApp";


-- Completed on 2022-02-16 21:06:26 CST

--
-- PostgreSQL database dump complete
--

