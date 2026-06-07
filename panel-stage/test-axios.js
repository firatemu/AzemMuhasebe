const axios = require('axios');

async function test() {
    const instance = axios.create({
        baseURL: '/api'
    });

    console.log('Test 1: /vehicles');
    try {
        // We mock a browser-like environment for just this test by providing a full URL for the adapter to fail or show what it would do
        const config1 = instance.getUri({ url: '/vehicles' });
        console.log('URI 1:', config1);

        console.log('Test 2: vehicles');
        const config2 = instance.getUri({ url: 'vehicles' });
        console.log('URI 2:', config2);
    } catch (e) {
        console.error(e);
    }
}

test();
