# 1. GIT and GitHub

## git checkout -[options].
- This is the command for checking out from one branch to another, in our case, we checkout from the current branch to our working branch using this command.

        $ git checkout deployment #to checkout to the branch named deployment

- In addition to that, you can also checkout files, from one branch to another using the same git checkout command. 
- For example, we need to move a file _(chama/v/code/a.html)_ **from** _the deployment branch_ **to the** _file\_io branch_.
  -  **To do so, we;** _ **first switch to the file\_io branch** _

        $ git checkout file\_io #to checkout to the file\_io branch

_ **And proceed to checkout the file from the deployment branch** _

        $ git checkout deployment chama/v/code/a.html #to check out the a.html file

## git commit -[options] 
- The git commit in its basic form is used to commit changes from the staging area to the GitHub account. 
  - You can also commit changing while adding them in the same command, by running the command;

        $ git commit -a -m "Made some changes to some file"
        
adding the changes done to a file in a branch and committing the changes in a single command.

- However, when working with this command, all changes stored in the staging area, will be added.

**NB** : Care should be taken when using this command, it may violate the order or commit messages to be attached to a file when the changes are in multiple files.**

## Adding ssh-keys._
- Using ssh-keys is an easier way of access GitHub without providing a user with your GitHub access credentials. 
- This was a go to method, over the https access method which is deprecated in some IDE's such as IntelliJ. 
  - ssh-key access is platform the process of adding an SSH key broken down in into

### Generating a new SSH key

- To generate a new ssh key, use Git Bash over the common Cygwin or the VS Code terminal. Run the command;

**This associates your GitHub account to a generated ssh-key.**

        $ ssh-keygen -t ed25519 -C "your_email@example.com";

- **However**, if you are using a legacy system that does not support the

**Ed25519 algorithm**, use:

        $ ssh-keygen -t rsa -C &quot; your"@example.com";

- After creating the key, you are prompted to add a passphrase to the terminal.

- While generating the ssh-keys, two keys are created, one which is public and another private. To secure your keys even further, it is recommended to use a passphrase from which the security of these keys is improved.

## Adding the SSH key to the ssh-agent

- Start the ssh-agent where you first ensure the ssh-agent is running before adding the ssh key and once it is done:
- Start the ssh agent
- You can run each of the commands independently and the separator used is "|";.

        $ eval '$(ssh-agent -s)'; | eval `ssh-agent -s` | eval "ssh-agent -s";

add the SSH-private key to the ssh-agent

## Add the ssh private key to the ssh-agent

- If you created your key with a different name, or if you are adding an existing key that has a different name, replace _id_ed25519_ in the command with the name of your private key file.

        $ ssh-add ~/.ssh/id_rsa

- Once completed, then add the ssh-key to your GitHub account. To Add the ssh-key;

- Go to windows local diskC:\\Users\"PC name"\&git.ssh.
- In the .ssh folder, open the public ssh key and copy the key to the GitHub account by going to the 
    - settings >> GPS and SSH keys >> Add the ssh key.

        **NOTE: The use of ssh-keys is platform dependent. This means that for every platform, **Linux or windows** , a unique public and private key must be generated. For more information, access the GitHub documentation from [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)[.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

## git fetch_ and _git pull

- The two commands are commonly confused. However, running git fetch -remote fetches information from the origin, the GitHub account, that you do not have and after this, you have references to all branches from the remote, which you can merge in or inspect at any time. _Git fetch_ fetches any work it fetches the information from the GitHub account, but does not automatically merge. _Git pull_ command automatically fetches and then merge on to your current branch. The fetched changes are the changes present on the remote, since you last cloned.