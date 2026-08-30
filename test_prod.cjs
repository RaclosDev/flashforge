
async function testForest() {
    try {
        const loginRes = await fetch('https://loopdeck.raclos.es/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'raclosdev@gmail.com', password: '123456' })
        });
        
        const loginData = await loginRes.json();
        if (!loginData.token) {
            console.log('Login failed:', loginData);
            return;
        }

        console.log('Login successful. Fetching forest...');
        const forestRes = await fetch('https://loopdeck.raclos.es/api/forest', {
            headers: {
                'Authorization': 'Bearer ' + loginData.token
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