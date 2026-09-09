-- ============================================================================
-- Supabase Storage: public "website-media" bucket + access policies.
-- Uploads restricted to image types and size limits enforced both here and in
-- application code.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880, -- 5 MB
  array[
    'image/jpeg','image/png','image/webp','image/gif','image/svg+xml','image/avif'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can read public website images
create policy "Public read website-media"
on storage.objects for select
using (bucket_id = 'website-media');

-- Only active admins can upload
create policy "Admin upload website-media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'website-media'
  and public.is_admin()
);

-- Only active admins can replace/update objects
create policy "Admin update website-media"
on storage.objects for update to authenticated
using (bucket_id = 'website-media' and public.is_admin());

-- Only active admins can delete objects
create policy "Admin delete website-media"
on storage.objects for delete to authenticated
using (bucket_id = 'website-media' and public.is_admin());
