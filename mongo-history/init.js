db.auth('user', 'password')

db = db.getSiblingDB('test')

db.createUser({
  user: 'test-user',
  pwd: 'test-password',
  roles: [
    {
      role: 'root',
      db: 'test',
    },
  ],
});

// db.createCollection('attempt');
