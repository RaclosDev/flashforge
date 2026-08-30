
async function run() {
    const id = Date.now();
    const email = 'test' + id + '@example.com';
    console.log('Registering', email);
    
    // Register
    const registerRes = await fetch('https://loopdeck.raclos.es/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: '123', name: 'TestUser' })
    });
    
    console.log('Status:', registerRes.status);
    console.log(await registerRes.text());
}
run();