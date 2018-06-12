# Shango - Lightning Wallet for iOS and Android

## Quick Start

#### 1. Install App
Install the Shango app from Google Play or iTunes App Store. As of now I am running an invite-only BETA test. To get an invitation, simply signup at http://www.shangoapp.com/insider to test out the cutting edge releases and be ready for some bugs. 

Invites will be sent in batches so you may need to wait a few days for your invite. For help installing the beta, see the articles below for your platform: 

* iOS Test Flight : https://developer.apple.com/testflight/testers/ for iOS
* Google Play Beta : https://support.google.com/googleplay/answer/7003180?hl=en 

#### 2. Check your node is ready
The first time you connect to the Shango service, you will be assigned a pre-warmed, **full** LND Lightning node that is already pre-synced to the Bitcoin **testnet** blockchain and ready to use. If you get a warning that your chain is not synced it is probably because the cloud service is experiencing high traffic at the moment so just wait until the chain is synced and you see the synched up icon on your dashboard as below. 

![Shango Screenshot](/images/synced.png)

#### 3. Get some Testnet coins
Get some Testnet coins! My usual places to get shiny new testnet coins are listed below. Once your testnet coins have been deposited to your on-chain wallet and confirmed you are ready to spend them. It may take a while to confirm depending on the conditions of the testnet network.

* https://testnet.manu.backend.hamburg/faucet
* https://faucet.lightning.community/

#### 4. Open Channels (optional)
Wait for Channels to open and have the **'Active'** badge near the right. By default autopilot mode is enabled with a commitment of 30% of your funds to open channels. This means that LND will seek out the best nodes to open channels with without any intervention on your part. Relax, your funds may look like they have been spent from your wallet balance but they are actually still in your control and can be redeemed anytime when you close the channels.

However, you may wish to expand beyond what autopilot does by fine tuning whom you open channels with. For example, if you are testing regularly with a specific crypto exchange, merchant or friend it may be advisable to manually open a channel with them. Try to select counterparties which already have a lot of channels open with others, and remember to set amounts in both directions e.g. have half the balance on your local side and the other half on the remote side. This allows value to move both ways along the channel.

Your goal is to get as 'well connected' as you can, as soon as possible so that you have the highest possible chance of routing payments to/from your node.

#### 5. Spend away!
Try sending an instant Lightning payment to one of the following demo stores:

* https://starblocks.acinq.co/#/
* https://yalls.org/
* https://lncast.com/
* http://satoshis.place


Note: Whilst opening a channel directly to the above sites is optional, it may help you get transfers done faster and save a few Satoshis in fees. 

For Starblocks, the best node to manually open a channel to is this endurance node: 
```03933884aaf1d6b108397e5efe5c86bcf2d8ca8d2f700eda99db9214fc2712b134@34.250.234.192:9735```


## FAQ

[1. I'm scared of using cloud services for financial transactions. Cloud Servers are insecure. I FEAR change!!!! ](#1)

[2. What security measures are in place when I use Shango Cloud Nodes? If Shango is running all the nodes, doesn't that mean you can see all my private keys / access macaroons and get all my funds when you want? What if Shango gets hacked?](#2)


#### 1. 
#### I'm scared of using cloud services for financial transactions. Cloud Servers are insecure. I FEAR change!!!! 

Chill. Before you run around screaming 'Custodial Wallet! Bad! Bad! Bad!',let us first discuss the long-standing myth and false notion that using cloud services is 'insecure'.

Shango is backed by cloud infrastructure from Amazon Web Services (AWS) - the biggest and most reliable cloud partner on the planet trusted by Fortune 500 companies. According to these links here https://aws.amazon.com/compliance/iso-27001-faqs/ and https://aws.amazon.com/about-aws/whats-new/2018/03/aws-fargate-supports-container-workloads-regulated-by-iso-pci-soc-and-hipaa/ it looks like they have invested a lot into security.

As you can see, they are a ISO 9001, 27001, PCI DSS2, SOC 1, SOC 2, and SOC 3 HIPAA certified data centre for your node authorised to handle the most sensitive data including healthcare and financial information. These are industrial strength facilities with fire suppression, tight physical security and monitored 24x7 by a dedicated team. Do you think your own server is just as safe?

 This is in contrast to the false sense of security you get with your privately managed server at home or phone based wallet where you can lose power and data anytime, and has WIFI access to make it easily accessible by hackers outside your door and where any other software installed could be compromising your machine already without you knowing. Granted if you are a security expert you can do a lot to prevent casual hacks but not all of us can or want to do this.

I don't know about you but I personally don't have the time or resources to build industrial strength security into my own private Raspberry Pi node and if my money was truly at stake  I would much rather be trusting a professional service than myself any day. Not that AWS is unhackable, but the chances are far less and at the end of the day, if they get hacked you will be in the same boat as giants like Verizon, Netflix, Comcast etc and you have a much better case suing them for damages than trying to get back your funds you lost from your Windows PC because you forgot to change your password regularly. So the question is, which newspaper headline would you rather read: ```Amazon servers hacked with $XX Millions in losses``` or  ```Guy loses his life savings in Bitcoin stored on his PC``` ??

#### 2 . What security measures are in place when I use Shango Cloud Nodes? If Shango is running all the nodes, doesn't that mean you can see all my private keys / access macaroons and get all my funds when you want? What if Shango gets hacked?

Shango is built around portable, stateless docker containers managed by the ECS FARGATE service from AWS. This means that :

- Nobody, not even myself has access to the underlying infrastructure of the nodes. i.e. There is no individual server you can setup, configure or attack as it is spread scross multiple zones and computing resources and changes at any time.

- Once the node shuts down, all the data is lost forever so there is no trace of your private information

- All the LND folders are (at the time of writing, this is still in development and pending the release of the new LND version 0.42) encrypted with a passphrase set by YOU. That means that even if someone did get access to the files, they would be unable to read them without your passphrase. 

- All the data is backed up on your device. Since there is no persistent storage on Fargate containers, Shango makes it easy to export your entire node as a portable docker (https://www.docker.com/what-docker) container that you can take to your own Home PC, another host like Digital Ocean etc whenever you want. So even if the Shango services shuts down you still have your node in tact. The original docker images for LND were around 1GB but with a bit of tweaking we got it down to 13MB compressed which is the size of most high def photos you may already have on your phone. You can easily back this up and keep it somewhere safe and launch a Linux based LND node with your state from exactly where you left off from anywhere you like.

- Shango is released as open source software. So if there is any hanky panky going on you don't need to trust the app, just trust the code you can see.

Finally, if the above still hasn't convinced you, you can always use the Remote Control feature of Shango and connect to your own LND Node hosted on your PC or Server anyway. Shango gives you the option to hold your money any way you like it.


#### 3. Why is Shango better than other Lightning wallets that just run on my phone? Why bother with this cloud stuff anyway?

I believe there is a better alternative to running a half-disabled node on your phone that takes almost half an hour to get the synchronisation ready before you can start using it. 

The way the Lightning Network works, if you open a channel to someone and they decide to get naughty and force close based on a previous state you may lose money because your phone's node is off-line most of the time. 

I know there are other proposed solutions like Watchtowers (https://www.coindesk.com/laolu-building-watchtower-fight-bitcoin-lightning-fraud/) but  this is not ready now and we have no idea if and when this concept will be popular. Ultimately, this still goes back to outsourcing your security to someone else so this is just the same as outsourcing your node in the first place.

Moreover, the promise of LN is that we can do fast, Ubiquitous transfers and what is the point if you can only send funds but not receive funds whilst you are mobile? How is your friend going to pay you back for his share of dinner and how will you receive refunds for purchases?

The Shango Cloud Node or your own Privately hosted node can be called upon 24x7 and will always stay on-line to catch such cheaters in the act and give you all the money as a penalty. If fuzzy warm feelings are what you are after, you will also be glad to know that running a full node helps you earn a few pennies to route payments, makes the network more reliable / decentralised unlike the leeching of resources that happens when you use a on/off mobile wallet. Cloud nodes is and should be the preferred solution at this moment in time.

#### 4. Leaving a server on all day sounds risky to me. Isn't this a hot wallet that we were told to avoid? I want my fiat paper money and abacus!

True, keeping funds online and connected to the internet entails a fair amount of risk, even if it can be managed. Your funds are ultimately, like in any blockchain, only as secure as your private keys.

That said, there are best practices you can adopt to reduce the risk. Just like keeping your money off crypto exchange hot wallets is a good idea it is also a good idea to keep the bulk of your funds ON-CHAIN in a paper wallet/cold storage unplugged from any technology. With a metal etched wallet http://bitcoinist.com/bitstashers-upgrade-paper-wallet-metal/  even an EMP or fire can't take out your key.

Keep only funds for immediate and daily spending on your Lightning wallet and then move funds back and forth to your offline master wallet as needed. This way, even if you lose all your funds on your Lightning node, at least you are not broke.







