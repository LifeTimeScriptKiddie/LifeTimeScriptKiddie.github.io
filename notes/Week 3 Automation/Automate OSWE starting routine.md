 

So while I was browsing reddit, x, substack, etc., I saw a memorable line. The lines goes something like..."if you are repeating a process more than 5 minutes, it is absolutely worth to spend the next five days to automate the process". While I don't recall the exact phrase, I agree 100% and decide to develop a python script to automate the process.  Here is a quick flow chart that is somewhat captures the process.

![](Images/Pasted%20image%2020240625212423.png)

Requirements:
I need tmux windows open with Obsidian, and openvpn connected. Then I will working on OSWE. Once I am done, it should automatically do following tasks upload files to github,  clear histroy, and shutdown the system. 

Process: I built the initial script with chatGPT, which finished 95% of work, and did the fine tuning, which was the fun part. 



Here I imported other libraries. This was my first time using getpass, tempfile, and atexit. 

``` python

import subprocess
import getpass
import threading
import time
import tempfile
import os
import atexit
```
---


Here I defined some functions.  run_in_tmux_pane is to run applications.  Function to run a command in a tmux pane

```python 

def run_in_tmux_pane(session_name, pane, command):
    process = subprocess.Popen(['tmux', 'send-keys', '-t', f'{session_name}.{pane}', command, 'C-m'])
    return process


# tmux_killer is totally kill tmux session.

def tmux_killer():
    process = subprocess.Popen(['tmux', 'kill-server'])
    return process


```

 
 
 ---
 
 Function to execute Git commands

 This is how I upload my notes to github. The github token is loaded in env. Not sure if this is the most secure way. However, when I clone the repository to a different location, I didn't see the token value. So I will assume this is safe somewhat. If there is a better option, please let me know. 

```python

def run_git_commands():
    command = "cd ~/Documents/Notes && git add . && git commit -m 'Automatic commit' && git push"
    subprocess.run(command, shell=True)

```



---
 
 
 Function to ask for shutdown confirmation.  This is to terminate the host. 
```python

def shut_down():
    response = input("Do you want to shut off the system now? (yes or no): ")
    if response.lower() == 'yes':
        print("Shutting down the system...")
        subprocess.run(["shutdown", "-h", "now"])
    elif response.lower() == 'no':
        print("Shutdown canceled.")
    else:
        print("Invalid response. Please answer 'yes' or 'no'.")
        shut_down()
```

 Function to clear history.   Sometimes I have too much going on terminal.   Usually history helps, but I don't want to be custom to having these little helps or leak other data
 
```python

def clean_history():
    response = input("Do you want to clear history (yes or no): ")
    if response.lower() == 'yes':
        print("Clearing history...")
        commands = [
            "history -c",
            "unset HISTFILE",
            "rm -f ~/.bash_history",
            "rm -f ~/.zsh_history",
            "touch ~/.bash_history",
            "touch ~/.zsh_history"
        ]
        for command in commands:
            subprocess.run(command, shell=True)
    elif response.lower() == 'no':
        print("No history will be cleared.")
    else:
        print("Invalid response. Please answer 'yes' or 'no'.")
        clean_history()

```



---
 
 Start Obsidian in first pane.   
```python 
def obsidian_starts():
    obsidian_command = "/opt/Obsidian"
    obsidian_process = run_in_tmux_pane(session_name, 0, obsidian_command)



```

 All Functions are defined, and time to call those functions.  Start tmux session and split into two horizontal panes

``` python 

# Here we have one tmux session " OSWE" 
session_name = "oswe"
subprocess.run(['tmux', 'new-session', '-d', '-s', session_name])
subprocess.run(['tmux', 'split-window', '-v', '-t', session_name])
subprocess.run(['tmux', 'split-window', '-v', '-t', session_name])

```



---

 Saving sudo password temporarily. User type password
 
```python

sudo_password = getpass.getpass("Enter your sudo password for OpenVPN: ")


# Here Obsidian starts. 
# Starts Obsidian
obsidian_starts()


```


---
This was an interesting way to execute but made a sense. Create a temporary expect script for OpenVPN authentication. sudo_password was passed from the above. 

```python

expect_script_content = f"""
spawn sudo openvpn --config /home/kali/offsec/oswe/universal.ovpn
expect "password for"
send "{sudo_password}\\r"
interact
"""




```


---
 Manage the OpenVPN connection in the second pane using expect
 So here it says the script manages openvpn connection.  Added delete_on_close=True and change delete to True. Then change back the setting to False. I guess this delete parameter immediately deletes file and makes os to unable to execute the next process. https://docs.python.org/3/library/tempfile.html indicates delete_on_close as a parameter is default to True. So when I typed in, the function gave me an error.  *.name here is where tecmp_exepct_script is located. //
```python 

with tempfile.NamedTemporaryFile(delete=False, mode='w', suffix='.expect') as temp_expect_script:
    temp_expect_script.write(expect_script_content)
    temp_expect_script_path = temp_expect_script.name

expect_command = f"expect {temp_expect_script_path}"
run_in_tmux_pane(session_name, 1, expect_command)



```


---

Clean up the temporary expect script. Manually deleting the path.
```python
time.sleep(5)  # Ensure the script has time to execute before removal
os.remove(temp_expect_script_path)



# Attach to the tmux session
# Attach to the session. This brings the pane on my face//
subprocess.run(['tmux', 'attach', '-t', session_name])

```



 Register cleanup and shutdown functions at exit. For whatever reason, atexit executes from the bottom. Per the document, https://docs.python.org/3/library/atexit.html#module-atexit, it is an expected behavior.
```python

atexit.register(shut_down)
atexit.register(clean_history)
atexit.register(run_git_commands())
atexit.register(tmux_killer)



```
Set up five minute auto update using crontab.

```
crontab -e

5 0 * * * cd ~/Documents/Note && git add . && git commit -m "crong crong" && git push

```