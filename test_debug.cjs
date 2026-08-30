
async function testDebug() {
    try {
        const res = await fetch('https://loopdeck.raclos.es/api/forest/test/randomuser123');
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (err) {
        console.error('Error:', err);
    }
}
testDebug();