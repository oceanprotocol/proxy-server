# ENS API

## Running Locally

```
npm install
npm i -g vercel
vercel dev
```

## Example Requests

### Get Ens Name

```
GET http://localhost:3000/api/name?accountId=0x903322c7e45a60d7c8c3ea236c5bea9af86310c7
```

Example response:

```
{
    "name": "winstonwolfe.eth"
}
```

### Get Ens Address

```
GET http://localhost:3000/api/address?name=winstonwolfe.eth
```

Example response:

```
0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7
```

### Get Ens Text Records

```
GET http://localhost:3000/api/text?name=jellymcjellyfish.eth
```

Example response:

```
[
    {
        "key": "url",
        "value": "https://oceanprotocol.com"
    },
    {
        "key": "avatar",
        "value": "https://raw.githubusercontent.com/oceanprotocol/art/main/logo/favicon-white.png"
    },
    {
        "key": "com.github",
        "value": "oceanprotocol"
    },
    {
        "key": "com.twitter",
        "value": "oceanprotocol"
    }
]
```
