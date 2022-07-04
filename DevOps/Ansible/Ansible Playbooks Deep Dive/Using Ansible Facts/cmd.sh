# 1. use ad-hoc command to gather fact and apply a filter using wild cards
ansible -i /home/ansible/hosts workers -m setup -a filter=*ipv4*