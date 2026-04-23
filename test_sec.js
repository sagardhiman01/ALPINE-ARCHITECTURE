const fetch = require('node-fetch'); // Needs node 18+ for native fetch
async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@alpine.com', password: 'admin123' })
    });
    const data = await res.json();
    console.log('Login Test:', res.status, data);

    const res2 = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'invalid-email', message: '<script>alert(1)</script>' })
    });
    const data2 = await res2.json();
    console.log('Validation Test (should fail):', res2.status, data2);
  } catch(e) { console.log(e); }
}
test();
