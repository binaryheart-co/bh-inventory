# ZNS Backend Documention
The goal of the document is to outline any relevant information for the ZNS backend.

## API endpoints

After `cd` into the backend directory, run `npm run start` to start the backend server.

 All endpoints are accessed off of  `http://localhost:3001/api/` For example: the login endpoint is at `http://localhost:3001/api/auth/login`

purpose | endpoint | HTTP Method | required parameters | optional parameters | notes
--- | --- | --- | --- | --- | ---
login user | `/auth/login` | `POST` | `email`, `password`
logout user | `/auth/logout` | `DELETE`
register user | `/auth/register` | `POST` | `email`, `password`, `firstName`, `lastName`
log new device | `/devices` | `POST` | `type`, `subtype`, `code`, `description`, `estValue` | `note`
request device list | `/devices` | `GET` || `items`, `tokenDirection`, `tokenID`, `tokenScore`, `search`, `minDate`, `maxDate`, `code`, `type`, `subtype`, `minValue`, `maxValue`| Parameters in query not body. If the `tokenDirection` field is included, `tokenID` must be supplied.
modify device | `/devices/:fullID` | `PUT` | `updatedAt` | `code`, `note`, `description`, `estValue`, `receiver`
request individual task list | `/tasks` | `GET`
sign up new task | `/tasks` | `POST`
quit task | `/tasks/:fullID` | `DELETE`
task completion | `/tasks/:fullID` | `PUT` | `updatedAt` | `code`, `note`, `description`, `estValue`

## NGINX Reverse Proxy
From the NGINX Documention:
>The optimal size of the shared memory zone can be counted using the following data: the size of $binary_remote_addr value is 4 bytes for IPv4 addresses, stored state occupies 128 bytes on 64-bit platforms. Thus, state information for about 16,000 IP addresses occupies 1 megabyte of the zone.

Rate limit configuration code:
```nginx
#...

limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

server {
    #...

    location / {
        #...

        limit_req zone=one burst=20 nodelay;
    }
}
#...
```
Don't leak server tokens (in all server contexts): `server_tokens off;`

To test nginx config: `sudo nginx -t`

## PM2 Node Runner
This section of the documention is still under construction.
