-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.province (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  CONSTRAINT province_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  category text NOT NULL,
  Price double precision,
  image_url text,
  CONSTRAINT product_pkey PRIMARY KEY (id)
);
CREATE TABLE public.time_dimension (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  week_number integer,
  month text,
  CONSTRAINT time_dimension_pkey PRIMARY KEY (id)
);
CREATE TABLE public.season_info (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payday_week boolean,
  holiday_type text,
  festival_season text,
  school_season text,
  CONSTRAINT season_info_pkey PRIMARY KEY (id)
);
CREATE TABLE public.context_dimensions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  avg_temperature_level text,
  rainfall_level text,
  tourism_level text,
  urbanization_level text,
  avg_income_level text,
  CONSTRAINT context_dimensions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sales_forecast (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  province_id uuid,
  product_id uuid,
  time_id uuid,
  season_id uuid,
  context_id uuid,
  demand_score numeric,
  estimated_units_sold numeric,
  user_id uuid,
  CONSTRAINT sales_forecast_pkey PRIMARY KEY (id),
  CONSTRAINT sales_forecast_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(id),
  CONSTRAINT sales_forecast_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id),
  CONSTRAINT sales_forecast_time_id_fkey FOREIGN KEY (time_id) REFERENCES public.time_dimension(id),
  CONSTRAINT sales_forecast_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.season_info(id),
  CONSTRAINT sales_forecast_context_id_fkey FOREIGN KEY (context_id) REFERENCES public.context_dimensions(id),
  CONSTRAINT sales_forecast_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  full_name text,
  role text DEFAULT 'user'::text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);