# Shango - Lightning Wallet for iOS and Android


## Quick Start if you want to run Shango with your own LND Node (Main Net or Testnet)

Note:  The instructions below assume you have a working LND Node. If you need help setting up your own personal node, this guide here is a good start and uses an inexpensive Raspberry Pi https://github.com/Stadicus/guides/tree/master/raspibolt If you don't want to invest the time and money, scroll down for instructions on using a Shango Cloud node.

#### 1. Install App
Install the Shango app from Google Play or iTunes App Store. As of now this app is still in Public Beta so expect some bugs, excuse them and report all bugs on the Github page so they don't get lost in Inbox Hell. To get the app, click on the test links below.

* iOS Test Flight : https://testflight.apple.com/join/WwCjFnS8
* Google Play Beta : Visit https://play.google.com/apps/testing/com.shango from your device to opt-in to Google Beta Store testing.

#### 2. Connect your node via GRPC

For access to your node from outside your home network, firstly make sure that the following settings are enabled on your node:

* Log into the router connected to your node, and add a port forward rule for 10009 to go to your node
* Add the following lines to your LND conf file, using ``` sudo nano ~/.lnd/lnd.conf```:
```
    rpclisten=0.0.0.0:10009
    tlsextraip=<your node's external ip>
    externalip=<your node's external ip>
```
* Add a new uncomplicated firewall rule, using ``` allow sudo ufw allow 10009 comment 'allow LND grpc from public internet'```
* Enable the new uncomplicated firewall rule, using ``` sudo ufw enable```  
* Delete any tls.cert and tls.key files, using ``` cd ~/.lnd``` and then ``` sudo rm tls.cert tls.key```
* Restart the node using by running lnd again or ``` sudo shutdown -r now```
* When it has restarted, it will automatically add new tls files using the information from the LND conf file
* If needed, copy the tls files to other users, using ``` sudo cp /home/<username 1>/.lnd/tls.cert /home/<username 2>/.lnd```

Your node should now be set up to connect to Shango. The next step is to send over the permission files:

* Install QR Encoder, using ``` sudo apt-get install qrencode```
* Move to the directory with LND, using ``` cd /home/<username>/.lnd``` 
* If you are using a Testnet node, type ``` export NETWORK=testnet ```
* If you are using a Main Net node, type ``` export NETWORK=mainnet ```
* Generate a QR code, using 
```
 echo -e "$(curl -s ipinfo.io/ip),\n$(xxd -p -c2000 ~/.lnd/data/chain/bitcoin/$NETWORK/admin.macaroon)," > qr.txt && cat ~/.lnd/tls.cert >>qr.txt && qrencode -t ANSIUTF8 < qr.txt
```
* On the Shango App, go to 'Settings' -> 'Connect to other LND Servers', and scan the QR code provided
* Make sure you can connect to your node using the ```lncli connect --rpcserver=<YOUR PUBLIC IP> getinfo``` command first before trying to connect to Shango. 
 


## Quick Start for the rest of us (Testnet Cloud Node Only for now)

#### 1. Install App
Install the Shango app from Google Play or iTunes App Store. As of now this app is still in Public Beta so expect some bugs, excuse them and report all bugs on the Github page so they don't get lost in Inbox Hell. To get the app, click on the test links below.

* iOS Test Flight : https://testflight.apple.com/join/WwCjFnS8
* Google Play Beta : Visit https://play.google.com/apps/testing/com.shango from your device to opt-in to Google Beta Store testing.

#### 2. Check your node is ready
The first time you connect to the Shango service, you will be assigned a pre-warmed, **full** LND Lightning node that can earn fees, and that is already pre-synced to the Bitcoin **testnet** blockchain and ready to use. If you get a warning that your chain is not synced or that there are no peers online yet, it is probably because the cloud service is experiencing high traffic at the moment so just wait until the chain is synced and you see the synched up icon on your dashboard as below. Check that you have at least one peer connected in the dashboard before continuing.

![Shango Screenshot](/images/synced.png)

#### 3. Get some Testnet coins
Get some Testnet coins! My usual places to get shiny new testnet coins are listed below. Once your testnet coins have been deposited to your on-chain wallet and confirmed you are ready to spend them. It may take a while to confirm depending on the conditions of the testnet network.

* https://testnet.manu.backend.hamburg/faucet
* https://faucet.lightning.community/

#### 4. Open Channels (optional)
Wait for Channels to open and have the **'Active'** badge near the right. By default autopilot mode is enabled with a commitment of 60% of your funds to open channels. This means that LND will seek out the best nodes to open channels with without any intervention on your part. Relax, your funds may look like they have been spent from your wallet balance but they are actually still in your control and can be redeemed anytime when you close the channels.

However, you may wish to expand beyond what autopilot does by fine tuning whom you open channels with. For example, if you are testing regularly with a specific crypto exchange, merchant or friend it may be advisable to manually open a channel with them. Try to select counterparties which already have a lot of channels open with others, and remember to set amounts in both directions e.g. have half the balance on your local side and the other half on the remote side. This allows value to move both ways along the channel.

Your goal is to get as 'well connected' as you can, as soon as possible so that you have the highest possible chance of routing payments to/from your node. If you need some ideas on which nodes to connect to, use one of these LN explorers:

1ML : https://1ml.com/testnet/
ACINQ: https://explorer.acinq.co/


#### 5. Spend away!
Try sending an instant Lightning payment to one of the following demo stores:

* https://starblocks.acinq.co/#/ (may need to open channel to endurance node below)
* https://yalls.org/
* https://lncast.com/
* https://testnet.satoshis.place/
* https://example.coingate.com/


Note: Whilst opening a channel directly to the above sites is optional, it may help you get transfers done faster and save a few Satoshis in fees. 

For those who love to be connected, these are highly-connected nodes, so you should be able to pay anywhere once you make a connection to at least one of them.
```
htlc.me03193d512b010997885b232ecd6b300917e5288de8785d6d9f619a8952728c78e8@18.205.112.169:9735

yalls.org02212d3ec887188b284dbb7b2e6eb40629a6e14fb049673f22d2a0aa05f902090e@testnet-lnd.yalls.org

faucet.lightning.community 0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b@159.203.125.125:9735

btctest.lnetwork.tokyo 023ea0a53af875580899da0ab0a21455d9c19160c4ea1b7774c9d4be6810b02d2c@160.16.233.215:9735

https://lightning-test.tom.place024c4a95dd7075c70ad36cb5f2de5e17dc99fd5fba9c402420b0af6abbd0137f4f@213.144.130.35:9735

http://lnd.fun0354d21c34f65c3429eedcef9e871a7286013ad5b27722a02752e29a4a888b0e62@lnd.fun:9735

aranguren.org038863cf8ab91046230f561cd5b386cbff8309fa02e3f0c3ed161a3aeb64a643b9@180.181.208.42:9735

lnplays.com02cdb6c06c0e1362212ab135993f4a92e0b8f85803d62c87df3644340ecab83990@lnplays.com:9735

endurance 03933884aaf1d6b108397e5efe5c86bcf2d8ca8d2f700eda99db9214fc2712b134@34.250.234.192:9735

nanoparticle.space 0269a94e8b32c005e4336bfb743c08a6e9beb13d940d57c479d95c8e687ccbdb9f@197.155.6.38:9735
```

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

- **AWS is more secure than on premise servers.** There is a prevailing myth that cloud services are 'insecure'. However, from my research and experience, AWS have invested a lot into security and even promoting block chain technology according to the links below, making it an internationally certified choice used by Fortune 500 companies who handle the most sensitive data including healthcare and financial information. These are industrial strength facilities with fire suppression, tight physical security, multi site redundancies and monitored 24x7 by a dedicated team. Do you actually think your own server or phone is just as safe? If running home servers was the most reliable way to go wouldn't all major corporations run their web servers at home too?

- **Your home is not a datacenter.** Running your own node may give you a false sense of security and censorship resistance when in reality your local ISP and telecom providers will shut down your service if the law requires them to do so. Moreover, you can more easily be a victim of loss of battery power, crashes and lose data anytime on your device, not to mention suffer intrusions via your WIFI. Most of your devices also aren't security hardended and don't just run LND, so any other software installed could be compromising your machine/device already without you knowing. Granted if you are a security expert you can do a lot to prevent casual hacks but not all of us can or want to do this. Trusting yourself when you're not fully trained is like putting money under your mattress and saying it's safer than a bank.

- **High Availability worldwide** Apart from the obvious benefit of being able to keep your node up and access it 24x7 when you travel, we found that most of the 2 billion unbanked population reside in developing countries, where their local power and communications infrastructure is unstable and where the government has a strong hand in all central services. Relying on a local server or phone node to conduct transactions would not be reliable or even legal in most cases. 

- **There is no 100% perfect solution.** AWS is NOT unhackable, centralised cloud providers and for that matter, your local ISP/Telecom provider is not 100% censorship resistant and cloud solutions are not for everyone. We get it. But the chances of you losing money are far less with a global cloud provider, and if they get hacked, at least you will be in the same boat as giants like Verizon and Netflix who together with you have a strong case suing them for hacking damages rather than trying to get back your funds you lost from your home Windows PC. So the question is, which newspaper headline would you rather read: ```Amazon servers hacked with XX Millions in losses``` or  ```Guy loses his life savings in Bitcoin stored on his PC``` ??

That said, if you are doing something that you feel is controversial and may be clamped down eventually by a statutory body, your contingency plan lies in the EXPORT image feature in Shango which allows you to download a docker image snapshot of your cloud node to go elsewhere, or of course running your own private node on a secured server managed by you.

Links:
- https://aws.amazon.com/compliance/iso-27001-faqs/
- https://aws.amazon.com/about-aws/whats-new/2018/03/aws-fargate-supports-container-workloads-regulated-by-iso-pci-soc-and-hipaa/
- https://aws.amazon.com/partners/blockchain/
- https://aws.amazon.com/blockchain/templates/


#### 2. 
####  If Shango is running all the nodes, doesn't that mean you can see all my private keys / access macaroons and get all my funds when you want? What security measures are in place when I use Shango Cloud Nodes?

Before you run around yelling 'Custodian Wallet! Bad! Bad!' because you heard the word cloud, remember that even if the *LND database* is in the cloud, nobody can see your private keys except you, the keys are on your phone and *you control them*. Hence, this cannot be considered a custodial wallet.

- Shango is built with **stateless** docker containers managed by the ECS FARGATE service from AWS. Nobody outside of AWS's technical team, has access to the underlying infrastructure of the nodes. i.e. There is no individual server for anyone to setup, configure or attack as it is spread scross multiple zones and computing resources and changes at any time. You can see your IP change almost every time you run Shango.

- Once the node shuts down, there is no storage so all the data is lost forever so there is no trace of your private information

- All the LND folders are **encrypted** with a passphrase set by YOU. That means that even if someone did get access to the files, they would be unable to read them without your passphrase. 

- LND is launched in *stateless init mode* which means all your access keys and certificates are **not** written to the server's temporary disk at all, they are sent over the encrypted socket and reside on your phone. So if you lose your keys on your phone, nobody else can help you.

- Using docker, each node is isolated from the others, has no external SSH access and runs nothing except the LND open source software. (Docker source files made open source too)

- All the data is backed up on your device. Since there is no persistent storage on Fargate containers (check AWS forums if you don't believe me) Shango makes it easy to export your entire node as a portable docker (https://www.docker.com/what-docker) container that you can take to your own Home PC, another host like Digital Ocean etc whenever you want. So even if the Shango services shuts down you still have your node in tact. The original **base** docker images for LND were around 1GB but with a bit of tweaking we got it down to 13MB compressed which is the size of most high def photos you may already have on your phone. You can easily back this up and keep it somewhere safe and launch a Linux based LND node with your state from exactly where you left off from anywhere you like.

- Shango is released as open source software (Code will be uploaded after public beta starts). So if there is any hanky panky going on you don't need to trust the app, just trust the code you can see. In fact, since Shango was built using React Native and written in ECMAScript executed at runtime, **the plain text source code is also present in every app file** for your to inspect which you can easily compare to the source code repository to ensure that what you see is what you get.

Finally, if the above still hasn't convinced you, you can always use the Remote Control feature of Shango and connect to your own LND Node hosted on your PC or Server anyway. Shango gives you the option to hold your money any way you like it.

#### 3.
#### Why is Shango better than other Lightning wallets that just run on my phone? Why bother with this cloud stuff anyway?

Lightning Wallets are different from regular Bitcoin on-chain wallets. LN wallets are essentially mini 'servers' that need to be online all the time to check the status of channels periodically in the background and route the actual payment through other nodes. By using Shango, you get the following benefits:

##### Functional Benefits

* **Quick On-boarding**. I believe there is a better alternative to running a limited version of a node on your phone that takes almost half an hour to get the synchronisation ready before you can start using it. Shango lets you use LND now without waiting by spinning up a ready to use, blockchain synchronised LND node with connected peers the moment you download the app.

* **Multiple Devices, One Wallet**. Whether you run your own node or use the AWS Cloud node, you can install Shango on multiple devices and access your node to make payments from anywhere at home, work or overseas. Most people have enough difficulty keeping track of their savings and current account already, why maintain a seperate node and individual wallet on your phone, tablet and PC in addition to that?

* **Send and Receive payments**. Shango can send and receive payments with no additional software. Due to security reasons, most wallets will not allow you to receive payments on your phone. If they do, they do it by having additional layers of servers in between to accomplish this and this means they are no longer running a pure LND server and have their own code added to it.

* **Better security of funds**. Your own node or Shango cloud nodes **can be** online all the time, mobile wallets are not especially if you live in a country with unstable power and limited cell phone coverage. The way the Lightning Network works, if you open a channel to someone and they decide to get naughty and  broadcast their version of your balance to the blockchain you may lose money. Since your phone's node is off-line most of the time it won't notice. I know there are other proposed solutions like Watchtowers (https://www.coindesk.com/laolu-building-watchtower-fight-bitcoin-lightning-fraud/) but  this is not ready now and we have no idea if and when this concept will be popular. Ultimately, this still goes back to outsourcing your security to someone else/ another server so this is just the same as outsourcing your node in the first place. You need something like the Shango Cloud Node or your own Privately hosted node which can be called upon 24x7 and will always stay on-line to catch such cheaters in the act.

* **Stability**. LND was written with a server running Linux in mind. Call me crazy, but I don't think phones make very good servers. The current wallets in the market try to shoehorn LND into running on your phone. This will inevitably result in crashes, unexpected behaviour and will take a lot of effort before it comes close to the operation and stability of LND running on a Linux server connected 24x7. 

* **Good User Experience** Shango's graphical dashboard is the first of its kind and the interface is one of the better ones out there.

##### Architectual and Conceptual benefits

* **Allows you to earn routing fees.** Only if you are in control of a full node, can you act as a gateway routing node and earn fees for forwarding payments on behalf of other users. Users with sufficient liquidity and who are the most connected and reliable across the network can eventually become a major hubs for payments which will be saught out by algorithms like the Autopilot function of LND.

* **Helps the overall network.** The more people running a full LND node (and thus a full bitcoin node) the better it is for the network overall. So if fuzzy warm feelings are what you are after, you will also be glad to know that running a full node  makes the network more reliable / decentralised unlike the leeching of resources that happens when you use a on/off mobile wallet. Cloud nodes is and should be the preferred solution at this moment in time.

* **Ensures timely updates of software**. Right now, the entire LND team is hard at work adding bugfixes, security patches and performance optimisations daily. If you run a wallet that has a forked, modified version of LND to run on your phone it means that all new changes will take time to be ported to the mobile version maintained by the developer. This create un-necessary additional work and delays in getting you the user the latest and greatest version of LND the moment it comes out. This is especially useful when critical fixes take place. 

#### 4.
#### Leaving a server on all day sounds risky to me. Isn't this a hot wallet that we were told to avoid? 

True, keeping funds online and connected to the internet entails a fair amount of risk, even if it can be managed. Your funds are ultimately, like in any blockchain, only as secure as your private keys.

That said, this is the Lightning Network and by design there is no way to run it offline. However, there are best practices you can adopt to reduce the risk. Just like keeping your money off crypto exchange hot wallets is a good idea it is also a good idea to keep the bulk of your funds ON-CHAIN in a paper wallet/cold storage unplugged from any technology. With a metal etched wallet http://bitcoinist.com/bitstashers-upgrade-paper-wallet-metal/  even an EMP or fire can't take out your key.

Keep only funds for immediate and daily spending on your Lightning wallet and then move funds back and forth to your offline master wallet as needed. This way, even if you lose all your funds on your Lightning node, at least you are not broke.

I believe choice and flexibility is the key to making this project work.

#### 5.
#### I can maybe trust AWS. I don't trust you. What can I do about this?

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




