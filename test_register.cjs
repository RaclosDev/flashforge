
async function testForest() {
    try {
        const id = Date.now();
        const email = 'test' + id + '@example.com';
        console.log('Registering', email);
        const registerRes = await fetch('https://loopdeck.raclos.es/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: '123', name: 'TestUser' })
        });
        
        const registerData = await registerRes.json();
        if (!registerData.token) {
            console.log('Register failed:', registerData);
            return;
        }

        console.log('Register successful. Fetching forest...');
        const forestRes = await fetch('https://loopdeck.raclos.es/api/forest', {
            headers: {
                'Authorization': 'Bearer ' + registerData.token
            }
        });

        console.log('Forest API Status:', forestRes.status);
        const text = await forestRes.text();
        console.log('Forest API Response:', text);
    } catch (err) {
        console.error('Error:', err);
    }
}

testForest();