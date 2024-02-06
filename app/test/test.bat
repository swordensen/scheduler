@echo off
for /l %%i in (1,1,10) do (
    echo Count: %%i
    ping -n 2 127.0.0.1 >nul
)
echo Done counting to 10.