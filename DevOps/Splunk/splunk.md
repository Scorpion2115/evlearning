# How To Install Splunk On Ubuntu 18.04
1. First, we are going to download the Splunk binary using the wget command as shown

```bash
wget https://download.splunk.com/products/splunk/releases/8.2.5/linux/splunk-8.2.5-77015bc7a462-linux-2.6-amd64.deb
```

2. Navigate to the folder where you have downloaded the Debian file  and install Splunk using the dpkg command
```bash
dpkg -i splunk-8.2.5-77015bc7a462-linux-2.6-amd64.deb
```

3. Next, We shall enable Splunk to always start when the server starts
```bash
sudo /opt/splunk/bin/splunk enable boot-start
```

4, Now we are going to Start Splunk
```bash
sudo systemctl start splunk

sudo systemctl status splunk
```

5. Open your web browser and type the Url
```bash
http://ip-address/8000
```

[How To Install Splunk On Ubuntu 18.04](https://cloudcone.com/docs/article/how-to-install-splunk-on-ubuntu-18-04/)