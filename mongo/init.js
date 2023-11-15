db.auth('user', 'password');

db = db.getSiblingDB('test');

db.createUser({
  user: 'test-user',
  pwd: 'test-password',
  roles: [{ 
    role: 'dbOwner', db: 'test' 
  }],
});

db.createCollection('questions');
