# CC-SaaS
This is the cost saving tool for the AWS cloud users

##**To start building and running your CleanCloud SaaS product on an Ubuntu EC2 instance, here are the key prerequisites for both backend (Python/FastAPI) and frontend (React):**

✅ 1. Update Ubuntu Packages

sudo apt update && sudo apt upgrade -y

✅ 2. Install Python 3.10+ and pip
FastAPI requires Python ≥3.7, but ideally use Python 3.10+.

sudo apt install python3.10 python3.10-venv python3-pip -y
python3.10 --version

✅ 3. Install Node.js & npm (for React frontend)
Install Node.js (use LTS version):

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v

✅ 4. Install Git (for cloning repos)

sudo apt install git -y

✅ 5. Install AWS CLI (for AWS resource management)

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version

Then configure it (if needed):

aws configure
