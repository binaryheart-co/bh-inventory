module.exports = {
    apps : [{
        name: 'zns',
        script: 'app.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

    deploy : {
        production : {
            key: "~/.ssh/digitalOcean_rsa",
            user : 'marzukr', //SSH user
            host : '159.203.123.64', //SSH host

            //Git stuff
            ref  : 'origin/zuk',
            repo : 'git@github.com:marzukr/bh-inventory.git',
            
            //ZNS
            path : '/home/marzukr/zns',
            'post-deploy' : "cd frontend && npm install && cd .. && cd backend && npm install"
        }
    }
};
