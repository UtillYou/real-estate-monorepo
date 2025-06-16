# Database Utilities for Real Estate Monorepo

## Seeding the First Admin User

1. Generate a bcrypt hash for your desired admin password:

   ```sh
   cd database
   npm install bcrypt
   node generate_bcrypt_hash.js <your_password>
   ```
   Copy the generated hash.

2. Edit `seed_admin.sql` and replace `$2b$10$REPLACE_WITH_YOUR_HASHED_PASSWORD` with your bcrypt hash.

3. Run the seed script against your database:

   ```sh
   psql -h <host> -U <user> -d <database> -f seed_admin.sql
   ```
   Or use your preferred PostgreSQL client.

**Note:** This script only inserts the admin user if it does not already exist.

## Automation
- You can integrate the SQL seed step into your deployment or migration scripts for consistency across environments.
