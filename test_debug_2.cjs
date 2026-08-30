
async function run() {
    const res = await fetch('https://loopdeck.raclos.es/api/forest/test/randomuser');
    console.log(res.status);
    console.log(await res.text());
}
run();