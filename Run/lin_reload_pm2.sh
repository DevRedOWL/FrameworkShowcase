# GitHook Script for PM2
cd /var/www/online-expo # Смена дирректории
sudo git stash
sudo git pull origin dev # Вытягиваем последние изменения
sudo git stash pop
sudo pm2 restart all # Перезапуск PM2