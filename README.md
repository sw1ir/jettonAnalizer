# jettonAnalizer


## 1. Установка.
Для начала работы с jettonAnalizer вам необходимо установить его сделать это можно следующим способом(Работает только на операционных системах семейства Linux)
### Обновление пакетов
Откройте терминал и введите в нем
```
sudo apt update && sudo apt upgrade
```
нужно будет ввести пароль от root пользователя и возможно ввести y в терминал чтобы команды выполнились

### Установка git 
Далее нужно установить git делается это с помощью этой команды :
```
sudo apt install git
```
### Установка Репозитория
Далее нам нужно загрузить репозиторий jettonAnalizer делается это с помощью этой команды:
```
git clone https://github.com/sw1ir/jettonAnalizer
```
### Заходим в каталог jettonAnalizer
Для того чтобы зайти в каталог jettonAnalizer необходимо ввести следующую команду:
```
cd jettonAnalizer
```
### Даем разрешение на исполнение файлу install.sh
Нужно дать разрешение на исполнение файлу install.sh, он устанавливает все нужные зависимости сделать это можно командой:
```
chmod +x install.sh
```
### Запускаем файл install.sh
Запускаем файл install.sh чтобы он все установил командой ниже:
```
./install.sh
```
В результате работы у вас появится файл control-start не путать с control-start.go
### Запускаем файл control-start
Запустить файл control-start можно командой ниже:
```
./control-start 
```
После выберите порт и вам выйдет сообщение "Успешно запущено на http://localhost:выбранный вами порт/" зайдите в браузер и введите в адресной строке данную ссылку.
