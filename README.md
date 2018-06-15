# Shango - Lightning Wallet for iOS and Android

## Quick Start if you want to run Shango on your own LND Node

#### 1. Install App
Install the Shango app from Google Play or iTunes App Store. As of now I am running an invite-only BETA test. To get an invitation, simply signup at http://www.shangoapp.com/insider to test out the cutting edge releases and be ready for some bugs. 

Invites will be sent in batches so you may need to wait a few days for your invite. For help installing the beta, see the articles below for your platform: 

* iOS Test Flight : https://developer.apple.com/testflight/testers/ for iOS
* Google Play Beta : https://support.google.com/googleplay/answer/7003180?hl=en 

#### 2. Connect your node via GRPC
Goto Settings -> Switch LND Server -> Show Instructions and follow the commands you need to enter via SSH to your node

Note:  If you need help setting up your own personal node, this guide here is a good start and uses an inexpensive Raspberry Pi https://github.com/Stadicus/guides/tree/master/raspibolt 

## Quick Start for the rest of us

#### 1. Install App
Install the Shango app from Google Play or iTunes App Store. As of now I am running an invite-only BETA test. To get an invitation, simply signup at http://www.shangoapp.com/insider to test out the cutting edge releases and be ready for some bugs. 

Invites will be sent in batches so you may need to wait a few days for your invite. For help installing the beta, see the articles below for your platform: 

* iOS Test Flight : https://developer.apple.com/testflight/testers/ for iOS
* Google Play Beta : https://support.google.com/googleplay/answer/7003180?hl=en 

#### 2. Check your node is ready
The first time you connect to the Shango service, you will be assigned a pre-warmed, **full** LND Lightning node that is already pre-synced to the Bitcoin **testnet** blockchain and ready to use. If you get a warning that your chain is not synced or that there are no peers online yet, it is probably because the cloud service is experiencing high traffic at the moment so just wait until the chain is synced and you see the synched up icon on your dashboard as below. Check that you have at least one peer connected in the dashboard before continuing.

![Shango Screenshot](/images/synced.png)

#### 3. Get some Testnet coins
Get some Testnet coins! My usual places to get shiny new testnet coins are listed below. Once your testnet coins have been deposited to your on-chain wallet and confirmed you are ready to spend them. It may take a while to confirm depending on the conditions of the testnet network.

* https://testnet.manu.backend.hamburg/faucet
* https://faucet.lightning.community/

#### 4. Open Channels (optional)
Wait for Channels to open and have the **'Active'** badge near the right. By default autopilot mode is enabled with a commitment of 30% of your funds to open channels. This means that LND will seek out the best nodes to open channels with without any intervention on your part. Relax, your funds may look like they have been spent from your wallet balance but they are actually still in your control and can be redeemed anytime when you close the channels.

However, you may wish to expand beyond what autopilot does by fine tuning whom you open channels with. For example, if you are testing regularly with a specific crypto exchange, merchant or friend it may be advisable to manually open a channel with them. Try to select counterparties which already have a lot of channels open with others, and remember to set amounts in both directions e.g. have half the balance on your local side and the other half on the remote side. This allows value to move both ways along the channel.

Your goal is to get as 'well connected' as you can, as soon as possible so that you have the highest possible chance of routing payments to/from your node. If you need some ideas on which nodes to connect to, use one of these LN explorers:

1ML : https://1ml.com/testnet/
ACINQ: https://explorer.acinq.co/


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

[1. I'm scared of using cloud services for financial transactions. Cloud Servers are insecure. (I FEAR change!!!!) ](#1)

[2. What security measures are in place when I use Shango Cloud Nodes? If Shango is running all the nodes, doesn't that mean you can see all my private keys / access macaroons and get all my funds when you want? What if Shango gets hacked?](#2)

[3. Why is Shango better than other Lightning wallets that just run on my phone? Why bother with this cloud stuff anyway?](#3)

[4. Leaving a server on all day sounds risky to me. Isn't this a hot wallet that we were told to avoid?](#4)

[5. I trust AWS. I don't trust you. What can I do about this?](#6)

[6. I am still dubious. This is a scam to get my testnet coins and publicly available email address. Everybody is out to get me!](#7)

#### 1. 
#### I'm scared of using AWS cloud services for financial transactions. Cloud Servers are insecure. (I FEAR change!!!! )

Shango allows you to connect to your own Raspberry Pi, PC, Linux or Mac LND server that you setup yourself so the AWS node is **optional**. 

Here are the points why we chose to use the cloud for the back-end:

- AWS is more secure than your own PC. There is a prevailing myth that cloud services are 'insecure'. However, from my research and experience, AWS have invested a lot into security and promoting block chain technology according to the links below, making it the first certified choice used by Fortune 500 companies who handle the most sensitive data including healthcare and financial information. These are industrial strength facilities with fire suppression, tight physical security, multi site redundancies and monitored 24x7 by a dedicated team. Do you actually think your own server or phone is just as safe?

- Your own home is not a datacenter. Running your own node gives you a false sense of security when in reality you can be more easily a victim of social engineering, lose power and data anytime on your devices, have multiple people with access to your WIFI making it an easier target for hackers outside your door. Most devices also don't just run LND, so any other software installed could be compromising your machine/device already without you knowing. Granted if you are a security expert you can do a lot to prevent casual hacks but not all of us can or want to do this.

- There is no 100% fool proof solution. AWS is NOT unhackable, but the chances are far less and at least you will be in the same boat as giants like Verizon, Netflix, Comcast etc and you have a much better case suing AWS for hacking damages than trying to get back your funds you lost from your Windows PC. So the question is, which newspaper headline would you rather read: ```Amazon servers hacked with $XX Millions in losses``` or  ```Guy loses his life savings in Bitcoin stored on his PC``` ??

That said, if you are doing something that you feel is controversial and may be clamped down eventually by a statutory body, your contingency plan lies in the EXPORT image feature in Shango which allows you to download a docker image snapshot of your cloud node to go elsewhere, or of course running your own private node on a secured server.

Links:
- https://aws.amazon.com/compliance/iso-27001-faqs/
- https://aws.amazon.com/about-aws/whats-new/2018/03/aws-fargate-supports-container-workloads-regulated-by-iso-pci-soc-and-hipaa/
- https://aws.amazon.com/partners/blockchain/
- https://aws.amazon.com/blockchain/templates/


#### 2. 
####  If Shango is running all the nodes, doesn't that mean you can see all my private keys / access macaroons and get all my funds when you want? What security measures are in place when I use Shango Cloud Nodes?

Shango is not a custodial wallet, because even if the data is in the cloud, nobody can see your private keys except you. 

- Shango is built with stateless docker containers managed by the ECS FARGATE service from AWS. Nobody outside of AWS, has access to the underlying infrastructure of the nodes. i.e. There is no individual server for anyone to setup, configure or attack as it is spread scross multiple zones and computing resources and changes at any time. You can see your IP change almost every time you run Shango.

- Once the node shuts down, there is no storage so all the data is lost forever so there is no trace of your private information

- All the LND folders are **encrypted** with a passphrase set by YOU. That means that even if someone did get access to the files, they would be unable to read them without your passphrase. 

- Using docker, each node is isolated from the others, has no external SSH access and runs nothing except the LND open source software. (Docker source files made open source too)

- All the data is backed up on your device. Since there is no persistent storage on Fargate containers, Shango makes it easy to export your entire node as a portable docker (https://www.docker.com/what-docker) container that you can take to your own Home PC, another host like Digital Ocean etc whenever you want. So even if the Shango services shuts down you still have your node in tact. The original **base** docker images for LND were around 1GB but with a bit of tweaking we got it down to 13MB compressed which is the size of most high def photos you may already have on your phone. You can easily back this up and keep it somewhere safe and launch a Linux based LND node with your state from exactly where you left off from anywhere you like.

- Shango is released as open source software. So if there is any hanky panky going on you don't need to trust the app, just trust the code you can see.

Finally, if the above still hasn't convinced you, you can always use the Remote Control feature of Shango and connect to your own LND Node hosted on your PC or Server anyway. Shango gives you the option to hold your money any way you like it.

#### 3.
#### Why is Shango better than other Lightning wallets that just run on my phone? Why bother with this cloud stuff anyway?

Lightning Wallets are different from regular Bitcoin on-chain wallets. LN wallets are essentially mini 'servers' that need to check the status of channels periodically in the background and route the actual payment through other nodes. By using Shango, you get the following benefits:

##### Functional Benefits

* **Quick On-boarding**. I believe there is a better alternative to running a limited version of a node on your phone that takes almost half an hour to get the synchronisation ready before you can start using it. Shango lets you use LND now without waiting by spinning up a ready to use, blockchain synchronised LND node with connected peers the moment you download the app.

* **Multiple Devices, One Wallet**. Whether you run your own node or use the AWS Cloud node, you can install Shango on multiple devices and access your node to make payments from anywhere at home, work or on the go. If your phone gets run over by a monster truck, just pickup another device and continue like nothing happened. Why maintain a seperate node and wallet on your phone, tablet and PC?

* **Send and Receive payments**. Shango can send and receive payments with no additional software. Due to security reasons, most wallets will not allow you to receive payments on your phone. If they do, they do it by having additional layers of servers in between to accomplish this and this means they are no longer running a pure LND server and have their own code added to it.

* **Better security of funds**. Your own node or Shango cloud nodes **can be** online all the time, mobile wallets are not and you don't want your phone and funds to go down the toilet, literally. The way the Lightning Network works, if you open a channel to someone and they decide to get naughty and force close based on a previous state, their version is what gets broadcasted to the blockchain and you may lose money. Since your phone's node is off-line most of the time it won't notice. I know there are other proposed solutions like Watchtowers (https://www.coindesk.com/laolu-building-watchtower-fight-bitcoin-lightning-fraud/) but  this is not ready now and we have no idea if and when this concept will be popular. Ultimately, this still goes back to outsourcing your security to someone else/ another server so this is just the same as outsourcing your node in the first place. You need something like the Shango Cloud Node or your own Privately hosted node which can be called upon 24x7 and will always stay on-line to catch such cheaters in the act, and give you all the funds as a penalty for their cheating.

* **Stability**. LND was written with a server running Linux in mind. Call me crazy, but I don't think phones make very good servers. The current wallets in the market try to shoehorn LND into running on your phone. This will inevitably result in crashes, unexpected behaviour and will take a lot of effort before it comes close to the operation and stability of LND running on a Linux server connected 24x7. 

* **Good User Experience** Shango's graphical dashboard is the first of its kind and the interface is one of the better ones out there.

##### Architectual and Conceptual benefits

* **Pays you and helps the overall network.** The more people running a full LND node (and thus a full bitcoin node) the better it is for the network overall. So if fuzzy warm feelings are what you are after, you will also be glad to know that running a full node helps you earn a few pennies to route payments, makes the network more reliable / decentralised unlike the leeching of resources that happens when you use a on/off mobile wallet. Cloud nodes is and should be the preferred solution at this moment in time.

* **Ensures timely updates of software**. Right now, the entire LND team is hard at work adding bugfixes, security patches and performance optimisations daily. If you run a wallet that has a forked, modified version of LND to run on your phone it means that all new changes will take time to be ported to the mobile version maintained by the developer. This create un-necessary additional work and delays in getting you the user the latest and greatest version of LND the moment it comes out. This is especially useful when critical fixes take place. 

#### 4.
#### Leaving a server on all day sounds risky to me. Isn't this a hot wallet that we were told to avoid? 

True, keeping funds online and connected to the internet entails a fair amount of risk, even if it can be managed. Your funds are ultimately, like in any blockchain, only as secure as your private keys.

That said, this is the Lightning Network and by design there is no way to run it offline. However, there are best practices you can adopt to reduce the risk. Just like keeping your money off crypto exchange hot wallets is a good idea it is also a good idea to keep the bulk of your funds ON-CHAIN in a paper wallet/cold storage unplugged from any technology. With a metal etched wallet http://bitcoinist.com/bitstashers-upgrade-paper-wallet-metal/  even an EMP or fire can't take out your key.

Keep only funds for immediate and daily spending on your Lightning wallet and then move funds back and forth to your offline master wallet as needed. This way, even if you lose all your funds on your Lightning node, at least you are not broke.

I believe choice and flexibility is the key to making this project work.

#### 5.
#### I trust AWS. I don't trust you. What can I do about this?

Good. You **SHOULD NOT** trust some random dude on the Internet that you never met and whose true agenda is unknown. I wouldn't either.

The point of Shango is that I have made every effort so you don't have to by:

* Making it open source so you just trust the code, not the person
* Using encryption on server and phone with a passphrase set by you. The approach should be to asssume a breach or a hack will take place, just make it useless when they succeed
* Giving you Flexibility to host your own node instead of using the cloud, and the ability to export your node to another host at any time at will.

From your side you can also:

* Control what data and how much crypto you put on the cloud node in the first place by treating it as a ```disposable lightning node``` 

* Setting strong cipher passwords of course

So one strategy might be that if you anticipate wanting to make large Lightning purchases or receive payments, you simply transfer what you need for the task at hand to your cloud node wallet. Once done, you either spend it all or transfer remaining funds back to your offline, on-chain hardware or other safe wallet, and then **terminate** your cloud node so all the data is gone.

The next time you come back you get a fresh new node and start from a clean slate. You never have to use the same node twice. This I believe offers a high level of privacy and security for people who need it. 

#### 6.
#### I am still dubious. This is a scam to get my testnet coins and publicly available email address. Everybody is out to get me! 

I can't make everyone happy. That is impossible. Instead, I shall quote this verse of our sacred scripture: 

## "If you don't believe it or don't get it, I don't have the time to try to convince you, sorry."
#### - Satoshi Nakamoto




