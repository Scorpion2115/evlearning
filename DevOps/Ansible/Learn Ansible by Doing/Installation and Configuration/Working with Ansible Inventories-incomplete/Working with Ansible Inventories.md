# Working with Ansible Inventories



## Create and Configure the inventory file
```bash
# vi inventory
[media]
4dba7187062c.mylabserver.com

[webservers]
4dba7187063c.mylabserver.com
```

## Define Variables 
1. For media hosts with Their Accompanying Values
```bash
# mkdir group_vars

# vi group_vars/media

media_content: /var/media/content/
media_index: /opt/media/mediaIndex
```
2. For webserver hosts
```bash
# vi group_vars/webservers

httpd_webroot: /var/www/
httpd_config: /etc/httpd/
```

## Define the script_files Variable for web1 and Set Its Value