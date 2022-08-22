# Proxy API for ENS requests

## Running Locally

```
npm install
npm i -g vercel
vercel dev
```

## Example Requests

### Get Ens Name

```
GET http://localhost:3000/api/name?accountId=0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0
```

Example response:

```
{
    "name": "jellymcjellyfish.eth"
}
```

### Get Ens Address

```
GET http://localhost:3000/api/address?name=jellymcjellyfish.eth
```

Example response:

```
0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0
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

### Get ENS Profile

```
GET http://localhost:3000/api/profile?address=0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0
```

Example response:

```
{
    "name": "jellymcjellyfish.eth",
    "avatar": "https://metadata.ens.domains/mainnet/avatar/jellymcjellyfish.eth",
    "links": [
        {
            "key": "url",
            "value": "https://oceanprotocol.com"
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
}
```
