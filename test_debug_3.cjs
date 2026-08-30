
async function run() {
    const id = Date.now();
    const email = 'test' + id + '@example.com';
    
    // Register
    await fetch('https://loopdeck.raclos.es/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: '123', name: 'TestUser' })
    });
    
    // Login
    const loginRes = await fetch('https://loopdeck.raclos.es/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: '123' })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.token) {
        console.log('Login failed:', loginData);
        return;
    }
    
    const userId = loginData.user.id;
    console.log('Got user id:', userId);
    
    // Call test endpoint
    const res = await fetch('https://loopdeck.raclos.es/api/forest/test/' + userId);
    console.log(await res.text());
}
run();