# GitHook Script for Nohup
sudo pkill -f nodejs # Убиваем процесс NodeJS
cd /var/www/online-expo # Смена дирректории
sudo git stash
sudo git pull origin dev # Вытягиваем последние изменения
sudo git stash pop
nohup sudo nodejs "index.js" 1>/dev/null 2>/dev/null & # Перезапускаем приложение в фоновом режиме