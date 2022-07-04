# Creating a new user and password with Ansible
1. To view the existing groups and users in ubuntu
To display all users run following command:
```bash
# display users
compgen -u

# display groups
compgen -g
```

2. Generating Secure User Passwords to be uesed in Ansible Playbook

```bash
sudo apt install whois

sudo mkpasswd --method=sha-512
# input: helloworld
# output: $6$akQIADBFaU8$bUmF2E1mHDRD8BX7Q75lxI1LChwHSNvrbT8MvjcY5jHH69Zbu2Uk3UMQUTQAqREw4n/4MMRx7MBMRyLfJP0kE/
```

3. Run the create-user.yml playbook
```bash
ansible-playbook -i inventory create-user.yml
```

4. Run the remove-user.yml playbook to teardown the lab
```bash
ansible-playbook -i inventory remove-user.yml
```


## Reference
* [ansible.builtin.user module – Manage user accounts](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html)
* [How to Use Ansible Create User Functionality in Linux](https://adamtheautomator.com/ansible-create-user/)