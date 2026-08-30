
async function run() {
    const token = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2MWI2NzcyOC1iMWU4LTRjMzQtOTcxNC1mODJhZjUyM2JjZmIiLCJlbWFpbCI6InRlc3QxNzg4MTMyODQ5MzQ0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzg4MTMyODQ5LCJleHAiOjE3OTA3MjQ4NDl9.ZMCVsX1L-eUPFKYygRsnZP2UEnLkYvRt_CKKzToCvw9MFVKgWRbSAra1CpOxedAv';
    const forestRes = await fetch('https://loopdeck.raclos.es/api/forest', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    console.log('Status:', forestRes.status);
    console.log(await forestRes.text());
}
run();