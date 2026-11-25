-- Seed the real tool catalogue into the products table.
-- Every slug used in src/data/products.js must exist here, because
-- subscriptions.product_slug references products(slug).

insert into public.products (slug, name) values
  ('pipe-2d-3d-convertor',       '2D-3D Pipe Convertor'),
  ('airflow-summary',            'Air Terminal Flow Summary'),
  ('equipment-mark-to-ducts',    'Equipment Mark to Ducts'),
  ('import-export-parameter',    'Import & Export Parameter'),
  ('inline-valve-placer',        'Inline Pipe & Valve Placer'),
  ('room-name-to-spaces',        'Room Name to Spaces'),
  ('sheets-from-unplaced-plans', 'Create Sheets from Unplaced Plans')
on conflict (slug) do update set name = excluded.name;

-- The old placeholder is no longer shown on the site. It is kept in the
-- table only if a test subscription still references it; otherwise remove it:
--   delete from public.products where slug = 'example-tool';
