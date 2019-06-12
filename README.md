# price-checker
Yet another crawler.

# Setup postgres authentication on Ubuntu 14.04.5 LTS
Prerequisites:
- pg ('node-postgres') throws:
    error: password authentication failed for user "ubuntu"
- PostgreSQL: exists

Steps:
1. Setup enviromental variables in .env file:
    PGHOST=localhost
    PGHOSTADDR=127.0.0.1
    PGPORT=5432
    PGUSER=user
    PGPASSWORD=password
2. Run >'sudo -u psql username'
      = \password username

