#!/bin/bash

echo "Counting to 10 seconds..."

for ((i = 1; i <= 10; i++)); do
    echo "$i"
    sleep 1
done

echo "Finished counting!"