# Qaravan

<img alt="Qaravan" src="https://github.com/Qaravan/Qaravan.github.io/raw/main/public/Screenshot1.png">

---

#### Three components of an ideal decentralized marketplace

<img alt="Qaravan users" src="https://github.com/Qaravan/Qaravan.github.io/raw/main/public/users.png">

- Sellers;
- Buyers;
- Delivery services.

They should all have equal rights on the app. Any user can be a buyer or a seller. External Chainlink adapters check the order status from the delivery services via the API and change the order status inside the blockchain. Thus, buyers and sellers can not worry about the fact that one of them will be deceived. The seller will receive his money when the buyer picks up the goods from the delivery service. If the buyer does not receive his goods within 30 days, he has the right to return his money back.

---

#### Adding a new delivery service

<img alt="Qaravan" src="https://github.com/Qaravan/Qaravan.github.io/raw/main/public/Screenshot6.png">

- Using the JobID of an external Chainlink adapter
  - NovaPoshta <a href="https://developers.novaposhta.ua/">developers portal</a> (<a href="https://github.com/smartcontractkit/external-adapters-js/pull/2294">NovaPoshta External Adapter</a>);
  - UPS <a href="https://developer.ups.com/">developers portal</a> (soon...);
  - DHL <a href="https://developer.dhl.com/">developers portal</a> (soon...);
  - FedEX <a href="https://developer.fedex.com/">developers portal</a> (soon...);
  - ...
- Using the request API via Chainlink (specify the URL and path in the JSON response)

---

#### Adding a new seller

<img alt="Qaravan" src="https://github.com/Qaravan/Qaravan.github.io/raw/main/public/Screenshot5.png">

In order to start selling products on the Caravan marketplace, you need to register as a seller. The products in the marketplace are compatible with the ERC1155 standard + several additional fields in the metadata.

```json
"attributes": [
    {
        "trait_type": "Token",
        "value": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    },
    {
        "trait_type": "Amount",
        "value": "0.1"
    }
]
```

Specify the `Token` and `Amount` fields in the metadata of your products. Thanks to these two fields, you will be able to sell goods in any token and at any price.

---

<img alt="Qaravan" src="https://github.com/Qaravan/Qaravan.github.io/raw/main/public/Screenshot3.png">

---

<img alt="Qaravan" src="https://github.com/Qaravan/Qaravan.github.io/raw/main/public/Screenshot4.png">

---

(`c`) Alex Baker
