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

// Permission Middleware (Simple protection)
server.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    // In a real app, we would verify the token. 
    // Here we just let it pass for simplicity or could check a header.
    // The client-side will restrict access based on role.
    next();
  } else {
    next();
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000');
});
