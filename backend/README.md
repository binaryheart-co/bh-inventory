# zns api endpoints

After `cd` into the backend directory, run `npm run start` to start the backend server.

 All endpoints are accessed off of  `http://localhost:3001/api/` For example: the login endpoint is at `http://localhost:3001/api/auth/login`

purpose | endpoint | required parameters | optional parameters | notes
--- | --- | --- | --- | ---
login user | `/auth/login` | `email`, `password`
register user | `/auth/register` | `email`, `password`, `firstName`, `lastName`
log new device | `/inventory/register` | `type`, `subtype`, `code`, `description`, `estValue` | `note`
request device list | `/inventory/list` | `items` | `filters.search`, `filters.date.min`, `filters.date.max`, `filters.code`, `filters.type`, `filters.subtype`, `filters.value.min`, `filters.value.max`, `token.direction`, `token.score`, `token.id` | If the `token` field is included, `token.id` and `token.direction` must be supplied.
