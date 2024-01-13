# Sendhooks Engine API

## API Testing with Curl

Use `curl` to test the API endpoints:

### Post New Hook

Create a new webhook:

```bash
curl --location --request POST 'http://localhost:5001/api/send' \
--header 'Content-Type: application/json' \
--data-raw '{
  "status": "success",
  "created": "12-02-2022"
}'
