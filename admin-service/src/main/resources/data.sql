ALTER TABLE admin.audit_log ALTER COLUMN metadata TYPE text USING metadata::text;

INSERT INTO admin.system_setting (key, value, type) VALUES
  ('access_token_ttl',              '60',       'INT'),
  ('refresh_token_ttl',             '30',       'INT'),
  ('password_min_length',           '12',       'INT'),
  ('password_complexity_uppercase', 'false',    'BOOL'),
  ('password_complexity_number',    'true',     'BOOL'),
  ('password_complexity_special',   'true',     'BOOL'),
  ('maintenance_mode',              'false',    'BOOL'),
  ('primary_color',                 '#000000',  'STRING'),
  ('company_logo_url',              '',         'IMAGE')
ON CONFLICT (key) DO NOTHING;
