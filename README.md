# Shango - Lightning Wallet for iOS and Android

## Quick Start

### 1. Install App
Install the Shango app from Google Play or iTunes App Store. If you received a Beta invitation to test out the cutting edge releases you use these instructions instead 

* iOS Test Flight : https://developer.apple.com/testflight/testers/ for iOS
* Google Play Beta : https://support.google.com/googleplay/answer/7003180?hl=en 

### 2. Check your node is ready
The first time you connect to the Shango service, you will be assigned a pre-warmed, **full** LND Lightning node that is already pre-synced to the Bitcoin **testnet** blockchain and ready to use. If you get a warning that your chain is not synced it is probably because the cloud service is experiencing high traffic at the moment so just wait until the chain is synced and you see the synched up icon on your dashboard as below. 

![Shango Screenshot](/images/synced.png)

### 3. Get some Testnet coins
Get some Testnet coins! My usual places to get shiny new testnet coins are listed below. Once your testnet coins have been deposited to your on-chain wallet and confirmed you are ready to spend them. It may take a while to confirm depending on the conditions of the testnet network.

* https://testnet.manu.backend.hamburg/faucet
* https://faucet.lightning.community/

### 4. Open Channels (optional)
Wait for Channels to open. By default autopilot mode is enabled with a commitment of 30% of your funds to open channels. This means that LND will seek out the best nodes to open channels with without any intervention on your part. Relax, your funds may look like they have been spent from your balance but they are actually still in your control and can be redeemed anytime when you close the channels.

### 5. Spend away!
Try sending an instant Lightning payment to one of the following demo stores:

* https://starblocks.acinq.co/#/
* https://yalls.org/

Note: Whilst opening a channel directly the above sites is optional, it may help you get transfers done faster and save a few Satoshis in fees. 

For Starblocks, the best node to manually open a channel to is this endurance node: 
```03933884aaf1d6b108397e5efe5c86bcf2d8ca8d2f700eda99db9214fc2712b134@34.250.234.192:9735```



