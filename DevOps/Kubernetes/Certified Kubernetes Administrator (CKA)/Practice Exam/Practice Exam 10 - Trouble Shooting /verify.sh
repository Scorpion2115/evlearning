#!/bin/bash
echo -e "Checking Objectives..."
OBJECTIVE_NUM=0
function printresult {
  ((OBJECTIVE_NUM+=1))
  echo -e "\n----- Checking Objective $OBJECTIVE_NUM -----"
  echo -e "----- $1"
  if [ $2 -eq 0 ]; then
      echo -e "      \033[0;32m[COMPLETE]\033[0m Congrats! This objective is complete!"
  else
      echo -e "      \033[0;31m[INCOMPLETE]\033[0m This objective is not yet completed!"
  fi
}

expected='acgk8s-worker2'
actual=$(cat /k8s/0004/broken-node.txt 2>/dev/null)
[[ "$actual" = "$expected" ]]
printresult "Determine what is wrong with the broken Node." $?

expected='True'
actual=$(kubectl get node acgk8s-worker2 -o jsonpath="{.status.conditions[?(@.type == 'Ready')].status}" 2>/dev/null)
[[ "$actual" = "$expected" ]]
printresult "Fix the problem." $?