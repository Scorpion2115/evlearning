# Deploying Ansible
## Install Ansible on the control host.
1. From your control node, run the following command to include the official project’s PPA (personal package archive) in your system’s list of sources:
```bash
sudo apt-add-repository ppa:ansible/ansible
```
2. Install Ansible
```bash
sudo apt update

sudo apt install ansible
```

## Create an `ansible` user 
1. On both the control node and worker node
```bash
sudo adduser ansible
# ansible

#sudo usermod -aG sudo ansible
```

## Configure a pre-shared key for Ansible 
With the user created, we need create a pre-shared key that allows the user to log in from `control` to `workstation` without a password.
1. On the control node, change to `ansible` user
```bash
su - ansible
```
2. Generate a new SSH key, accepting the default settings when prompted:
```bash
ssh-keygen
```
3. Copy the SSH key to workstation, providing the password we created earlier:
```bash
# ssh-copy-id <worker node ip>

for i in 4dba7187061c.mylabserver.com 4dba7187062c.mylabserver.com 4dba7187063c.mylabserver.com;
do
ssh-copy-id $i
done
```

4. Test that we no longer need a password to log in to the workstation:
```bash
ssh <worker node ip>
```

## Configure the Ansible user on the workstation host so that Ansible may sudo without a password.
1. Edit the sudoers file on the workstation host 
```bash
sudo visudo

# Add this line at the end of the file:
ansible       ALL=(ALL)       NOPASSWD: ALL
```

## Create inventory include all worker hosts
1. On the control host, as the ansible user, create a simple inventory on the control node `/home/ansible/inventory`, consisting of only the worker host.
```bash
vi /home/ansible/inventory

# add these host names
4dba7187061c.mylabserver.com
4dba7187062c.mylabserver.com
4dba7187063c.mylabserver.com
```

## Try add-hoc command
```bash
ansible -i /home/ansible/inventory all -m ping > /home/ansible/output
```

## Try Ansible playbook 
We will write an Ansible playbook into `/home/ansible/git-setup.yml` on the control node that installs git on workstation, then executes the playbook.
1. On the control host, as the ansible user, create an Ansible playbook:
```yml
# vim /home/ansible/git-setup.yml

--- # install git on target host
- hosts: all
  become: yes
  tasks:
  - name: install git
    apt:
      name: git
      state: latest
```
2. Run the playbook
```bash
ansible-playbook -i inventory git-setup.yml 

...
TASK [install git] *****************************************************************************************************************************************************************
[WARNING]: Updating cache and auto-installing missing dependency: python-apt
ok: [4dba7187062c.mylabserver.com]
ok: [4dba7187063c.mylabserver.com]

PLAY RECAP *************************************************************************************************************************************************************************
4dba7187062c.mylabserver.com : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
4dba7187063c.mylabserver.com : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
```

3. Verify that the playbook ran successfully:
```bash
ssh <worker host>
which git
git --version
```