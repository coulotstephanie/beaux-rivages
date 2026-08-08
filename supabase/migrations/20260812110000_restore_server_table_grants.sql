begin;

-- These tables were introduced after the foundation-wide grants. The Back Office
-- reads them through the server client, so the service role must retain access.
grant select, insert, update, delete on table
  public.reservation_items,
  public.reservation_special_requests,
  public.reservation_events,
  public.payment_method_settings,
  public.payment_reminders,
  public.property_visual_content
to service_role;

grant select, insert, update, delete on table
  public.cms_media_assets
to authenticated, service_role;

commit;
