cd /home/tagpad/tagpad
git clean -f -d
git pull origin master
npm install
sudo forever stopall
source scripts/build.sh
cd build
sudo NODE_ENV=production forever start server.js
