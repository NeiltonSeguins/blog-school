const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom Middleware for Login
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = router.db.get('users').find({ email, password }).value();

  if (user) {
    res.json({
      token: `fake-jwt-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } else {
    res.status(401).json({ message: 'Email ou senha inválidos' });
  }
});

// Custom Middleware for Register
server.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = router.db.get('users').find({ email }).value();

  if (existingUser) {
    res.status(400).json({ message: 'E-mail já cadastrado.' });
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: role || 'aluno'
  };

  router.db.get('users').push(newUser).write();

  res.json({
    token: `fake-jwt-token-${newUser.id}-${Date.now()}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email
    }
  });
});

// Permission Middleware (Simple protection)
server.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    // Check for Authorization header
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Autenticação necessária.' });
    }
    // In a real app, we would verify the token validity here.
    next();
  } else {
    next();
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000');
});
