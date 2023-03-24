# Facebook Authentication

> ## Data:

- Access Token

> ## Primary Flow:

1. Get data (name, email and facebook id) from Facebook API
2. Check if user exists in database with provided email
3. Create an account if user does not exist with provided data from Facebook
4. Create an access token from the user's id, with 30 minutes expiration time
5. Return generated access token

> ## Alternative Flow: User exists in database

3. Update user's data with provided data from Facebook (Facebook id and name - only update if user does not have a name already)

> ## Exception Flow: Invalid or expired access token

1. Return authentication error
