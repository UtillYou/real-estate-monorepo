-- Replace the hash below with your actual bcrypt hash!
INSERT INTO users (email, password, name, role)
SELECT 'admin@example.com', '$2b$10$4vGFhR6wSPP1Jo/US4TvwutREfUpyer2CsBPAhNXGcEriHswrbhqW','admin', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@example.com'
);
