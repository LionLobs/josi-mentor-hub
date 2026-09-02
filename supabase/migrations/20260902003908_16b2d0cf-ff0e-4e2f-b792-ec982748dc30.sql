REVOKE EXECUTE ON FUNCTION public.available_slots(date, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.available_slots(date, integer) TO authenticated, service_role;