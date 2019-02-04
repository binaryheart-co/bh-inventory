# zns api endpoints

After `cd` into the backend directory, run `npm run start` to start the backend server.

 All endpoints are accessed off of  `http://localhost:3001/api/`

purpose | endpoint | required parameters | optional parameters
--- | --- | --- | ---
login user | `/auth/login` | `email`, `password`
register user | `/auth/register` | `email`, `password`, `firstName`, `lastName`
log new device | `/inventory/register` | `type`, `subtype`, `code`, `description`, `estValue` | `note`