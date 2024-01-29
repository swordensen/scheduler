#!/bin/bash


counter=15

while [ $counter -gt 0 ]; do
    echo $counter
    sleep 1
    ((counter--))
done

echo "Countdown complete!"