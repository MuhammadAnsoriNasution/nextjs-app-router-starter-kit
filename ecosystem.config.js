module.exports = {
    apps: [{
        name: 'next-app',
        script: 'node_modules/.bin/next',
        args: 'start',
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: "production",
            PORT: 5555
        },
    }]
};