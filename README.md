Assumptions:

1. Only rails repo is used
2. description is the body in the response
3. When POST request is sent all relevant data like title, description, user info etc are sent in the request body except for `id` and `issue number`
4. Redis keeps track of what the last issue is and its number
5. App is started once the Redis is populated with data. Request for issues from Github is fetched only once (if data is not populated)
