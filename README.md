# Presentation

Привет, друзья.

Что вы видите сейчас на экране? - Вы смотрите на обычную коллекцию NFT токенов.
А что если я Вам скажу, что сейчас мы превратим эту коллекцию в товары, которые можно будет заказать у продавцов и получить в службе доставки.

Как работает децентрализованный маркетплейс Qaravan?
Все данные без исключения хранятся в блокчейне и децентрализованной сети IPFS.
Все пользователи имеют равные права.
Любой пользователь может добавить в систему службу доставки.
Лбой пользователь может быть продавцом и выставить свои товары на продажу.
Любой пользователь можеть быть покупателем.
Покупатель делает заказ товара, шифрует открытым ключем продавца свой адрес доставки и отправляет в блокчейн.
Продавец отправляет заказ покупателю и записывает в блокчейн номер отслеживания доставки, который получил в службе доставки.
Когда покупатель получает товар, продавец вызывает смарт-контракт для того чтобы Chinlink через внешний адаптер проверил статус заказа по API и отправил заработанные деньги продавцу.

Настраивается конфигурация службы доставки, чтобы Chinlink мог работать с внешним адаптером или API.
Каждый пользователь может быть и продавцом и покупателем.
Чтобы добавить товары, нужно создать стандартный токен ERC 1155, у токена в метаданных должно быть два обязательных поля, это адрес токена и сумма, за которую будет продан товар.
Когда происходит добавление товаров, продавец отправляет в блокчейн свой публичный ключ, именно с помощью него будет шифроваться адрес доставки покупателя. Таким образом, зашифрованный адрес доставки будет храниться в блокчейне и расшифровать его сможет только продавец.
Теперь любой пользователь может купить товары на маркетплейсе.
Покупая товары, пользователь платит не напрямую продавцу, а на Escrow счёт смарт-контракта Qaravan.
Когда продавец видит покупку нового товара, он должен выполнить отправку и получить от почтовой службы номер отслеживания. Этот номер продавец отправляет в блокчейн, чтобы статус доставки мог увидеть покупатель.
Когда покупатель успешно получает товар у почтовой службы, в API изменяется статус заказа. Продавец может проверить, получил ли покупатель товар. Всё происходит внутри блокчейна, Chinlink обращается к API и получает статус заказа.
Если покупатель не получит товар в течении 30 дней, он сможет вернуть свои деньги.
Теперь, когда Chinlink изменил статус в смарт-контракте и продавец видит что товар получен покупателем, он может завершить сделку и получить свои заработанные деньги.

Я вам весь процесс продемонстрирую на реальном примере.
У меня есть NFT коллекция и сейчас давайте представим, что это реальные картины, которые можно купить и повесить в гостиной.
Добавляем нового продавца. Выбираем ему название, далее загрузим изображение нашего магазина. Все картинки загружаются по API в сервис децентрализованного хранения web3.storage. Вы можете видеть, что новая картинка была загружена только что. Далее давайте придумаем описание.
И последним пунктом будет добавление адреса нашей NFT коллекции. Вы должны разрешить смарт-контракту Qaravan управлять вашими токенами. И после этого можно добавлять нового продавца в блокчейн.
Давайте зайдем во вкладку со списком продавцов, и увидим наш новенький магазин.
Перейдем в него и увидим все товары которые пользователи смогут покупать.
Но пока в системе нет ни одной службы доставки, список пуст.
Давайте добавим реально существующую службу доставки, чтобы с помощью ее пользователи могли заказывать доставку товаров.
Прописываем название, выбираем изображение и заполняем описание.
Job ID - это идентификатор внешнего адаптера Chinlink. Я уже создал внешний адаптер для службы доставки NovaPost, но пока он еще ожидает публикации в основной ветке на GitHub. Поэтому сейчас мы протестируем работу не через внешний адаптер, а через API. Мы будем использовать неофициальную документацию почтовой службы, так как она очень простая и понятная. Вы всегда можете зайти на официальный портал разработчиков любой почтовой службы, такой как DHL, FedEX, чтобы получить их API.
Почтовая служба добавлена, а это значит что уже можно выполнять заказы товаров.
Давайте зайдем с другого браузера и выполним заказ.
Нажимаем на кнопку покупки, выбираем почтовую службу и заполняем поле адреса доставки. Адрес доставки будет шифроваться публичным ключом продавца и храниться в блокчейне.
Теперь нужно дать разрешение на использование токенов от имени смарт-контракта Qaravan. После этого можно совершать покупку. Токены отправляются на Escrow счёт смарт-контракта Qaravan и хранятся там до того, пока товар будет доставлен.
Продавец видит в своём личном кабинете новый заказ и адрес доставки, по которому должен отправить товар. Товар отправляется покупателю, от почтовой службы получается номер отслеживания и этот номер отправляется его в блокчейн.
Спустя некоторое время, покупатель получает товар и можно запросить проверку внутри блокчейна, чтобы Chinlink по API проверил статус заказа.
Статус заказа изменяется внутри смарт-контракта Qaravan и теперь продавец может завершить сделку и получить заработанные деньги.
Важно понимать, что все данные хранятся исключительно внутри блокчейна и децентрализованной сети IPFS. Продавец и покупатель защищены от мошенничества, благодаря службам доставки и условиям в смарт-контракте Qaravan.
Спасибо что досмотрели видео-презентацию децентрализованного маркетплейса Qaravan. Желаю вам хорошего дня.

---

Hello friends.

What do you see on the screen now? - You look at the usual collection of NFT tokens.
But what if I tell you that now we will turn this collection into goods that can be ordered from sellers and get in the delivery service.

How does the QARAVAN decentralized marketplace work?
Delivery configuration is set up so that ChinLink can work with an external adapter or API.
Each user can be a seller and a buyer.
To add goods, you need to create a standard ERC 1155 token, the token in metadata must have two compulsory fields, this is the address of token and the amount for which the goods will be sold.
When the goods are added, the seller sends his public key to the blockchain, it is with him that the customer delivery address will be encrypted. Thus, the encrypted delivery address will be stored in the blockchain and only the seller can decipher it.
Now any user can buy goods on the marketplace.
When buying goods, the user pays not directly to the seller, but on the Escrow account of the QARAVAN smart contract.
When the seller sees the purchase of a new product, he must send and receive tracking number from the postal service. The seller sends this number to the blockchain so that the buyer can see the status of delivery.
When the buyer successfully receives the goods from the postal service, the status of the order changes in the API. The seller can check if the buyer has received the goods. Everything happens inside the blockchain, ChinLink turns to the API and receives the status of the order.
If the buyer does not receive the goods within 30 days, he will be able to return his money.
Now that ChinLink has changed the status in a smart contract and the seller sees that the goods were received by the buyer, he can complete the deal and get his earned money.

I will show you all this with a real example.
I have a NFT collection and now let's imagine that these are real paintings that you can buy and hang in the living room.
Add a new seller. Choose a name for it, then load the image of our store. All pictures are loaded according to the API in the decentralized storage service Web3.Storage. You can see that the new picture was just loaded. Next, let's come up with a description.
And the last point will be adding the address of our NFT collection. You must allow the QARAVAN smart contract to manage your tokens. And after that you can add a new seller to the blockchain.
Let's go to the tab with a list of sellers, and see our brand new store.
Let's go to it and see all the products that users will be able to buy.
But so far there is not a single delivery service in the system, the list is empty.
Let's add a real-life delivery service so that users can use it to order delivery of goods.
We prescribe the name, select the image and fill out the description.
Job ID is the identifier of the external adapter ChinLink. I have already created an external adapter for the novapost delivery service, but so far it is still waiting for publication in the main branch on GitHub. Therefore, now we are not testing the work not through an external adapter, but through the API. We will use the unofficial documentation of the postal service, since it is very simple and understandable. You can always go to the official portal of developers of any postal service, such as DHL, FedEx, to get their API.
The postal service has been added, which means that it is already possible to fulfill orders of goods.
Let's go from another browser and fulfill the order.
Press the purchase button, select the postal service and fill out the delivery address field. The delivery address will be encrypted by the seller’s public key and stored in the blockchain.
Now you need to give permission to use tokens on behalf of the QARAVAN smart contract. After that, you can make a purchase. Tokens are sent to the Escrow account of the QARAVAN smart contract and are stored there until the goods are delivered.
The seller sees in his personal account a new order and the delivery address to which he must send the goods. The goods are sent to the buyer, the tracking number is obtained from the postal service and this number is sent to the blockchain.
After some time, the buyer receives the goods and you can request a check inside the blockchain so that the ChinLink for the API checks the status of the order.
The status of the order changes inside the QARAVAN smart contract and now the seller can complete the deal and get the money earned.
It is important to understand that all data are stored exclusively inside the blockchain and the IPFS decentralized network. The seller and buyer are protected from fraud, thanks to the delivery services and conditions in the QARAVAN smart contract.
Thank you for watching a video presentation of a decentralized QARAVAN market. I wish you good day.
