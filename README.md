# External Grader for programming in C

## <a name="desc"></a> Описание
Внешний грейдер для проверки портивных задач на языке программирования С. ПРинцип работы грейдера заключается в том что, оно проверяет список своих проектов на новые изменения через определенный отрезок времени.
Задачи проверяются синхронным образом, то есть грейдер в одно время может принимать только одну задачу на проверку. В ходе проверки грейдер выставляет оценку в классрум, если студент присоединился к нужному курсу, в противном случае не выставляется оценка. Грейдер возвращает подробные коментарии к задаче в zulip, если студент имеет аккаунт в zulip, по его почте ао которой было создано задача.

***ВАЖНО:***
> 	*Прежде чем ставит задачки с помощью грейдера, убедитесь что по заданному **email** существует аккаунты **gitlab**, **zulip**, **cassroom**, также не забывайте присоединится к курсу в классруме по которой ставится задача.*

## <a name="links"></a> Оглавление
* [Описание](#desc)
* [Оглавление](#links)
* [Установка](#install)
    * [Настройки GoogleAPI](#google_scripts)
    * [Настройки GitlabAPI](#gitlab_scripts)
    * [Zulip bot](#zulip_scripts)
* [Архитектура грейдера](#architecture)
* [Функционал грейдера](#functionality)


## <a name="install"></a> Установка

### <a name="google_scripts"></a> Настройки GoogleAPI
В первую очередь нужно зайти в севрис **google API console**, ссылка на сервис https://console.developers.google.com/apis/dashboard.

Далее во вкладках указано названия проектов, если оно у вас есть:
![google API console](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/1.JPG)

Нажымаете на вкладку и появляется окно в котром нужно создать новый проект.
![creat new project](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/2.JPG)

Далее в левом главном меню есть вкладки, кликайте во вкладку "Учетные данные".
![security](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/3.JPG)

После перехода в учетных данных, в врехней части окно есть вкладка **СОЗДАТЬ УЧЕТНЫЕ ДАННЫЕ**, после нажатия на нее выбираете тип учетных данных. Выбирайте тип **идентификатора клиента OAuth**. После нужно будет выбрать тип приложения, и нужно выбрать другое.
![creating credentials](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/4.JPG)

После создания учетных данных, в странице <a name="">Учетные данные</a>, появляется новый клиент **Auth**. Нужно скачать **credentials.json** клиента, и заменит их в проекте, по пути **google_script/credentials.json**.
![credentials.json](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/5.JPG)

Также в скрипт **gapi.js** по такому же пути, дать следующие разрешения:
- **https://www.googleapis.com/auth/classroom.courses**
- **https://www.googleapis.com/auth/classroom.courses.readonly**
- **https://www.googleapis.com/auth/classroom.coursework.students**
- **https://www.googleapis.com/auth/classroom.coursework.students.readonly**
- **https://www.googleapis.com/auth/classroom.coursework.me.readonly**
- **https://www.googleapis.com/auth/classroom.coursework.me**
- **https://www.googleapis.com/auth/classroom.rosters**
- **https://www.googleapis.com/auth/classroom.rosters.readonly**
- **https://www.googleapis.com/auth/classroom.profile.emails**
- **https://www.googleapis.com/auth/classroom.profile.photos**
- **https://www.googleapis.com/auth/admin.directory.group.readonly**
- **https://www.googleapis.com/auth/admin.directory.group**
- **https://www.googleapis.com/auth/admin.directory.user.readonly**
- **https://www.googleapis.com/auth/admin.directory.user**
- **https://www.googleapis.com/auth/admin.directory.orgunit**
- **https://www.googleapis.com/auth/admin.directory.orgunit.readonly**

В первом запуске приложения, скрипт выдаст **url**, и будет ждать ввод **хеша** для установления **токен**. Для того чтобы установит токен, нужно перейти по ссылке и согласится на выдачи доступа исходя из заданных више разрешениях. После согласия на доступ в проекте будет скачиватья токен, по которому сервис будет делать запросы. В этом и заканчивается настройка **google скриптов**.

### <a name="gitlab_scripts"></a> Настройки GitlabAPI
Перейти по ссылке https://git.miem.hse.ru/, и зайти под свой аккаунт.

Далее нужно зайти в настройки, как указано на картинке.
![gitlab](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/6.JPG)

В левом меню, нужно выбрать **access token**.

![gitlab_menu](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/7.JPG)

Далее можно создавать токен для gitlabAPI, но не забывайте дать разрешения на все виды сервисов. После создания токена, нужно скопирповать ее в настройки проекта по пути **config/configs.json**.
![gitlab_token](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/8.JPG)

### <a name="zulip_scripts"></a> Zulip bot
Зайти в приложения Zulip, и войти в свою организацию. Далее выбираете настройки.
![zulip_settings](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/9.JPG)

Перейти во вкладку **Ваши боты**

![zulip_bots](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/10.JPG)

Создать нового бота, и указать тип **Generic bot**.

![create_bots](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/11.JPG)

После создания созданный бот поялвяется в списке вашых ботов. Нужно будеть скачать ее настройки, и заменит их по пути **gitlab_scripts/zuliprc**.

![setting_bot](https://github.com/KomilGuliev/external_grader_c/blob/dev/instruction/12.JPG)

## <a name="architecture"></a> Архитектура
В проекте используются 4 разных API, такие как Classroom API(Google), Directory API(Google), Gitlab API и API группового чата Zulip. Принцип работы проекта заключается в том что оно протестирует программы написанные студентами, и отдает полный анализ кода. Грейдер запускается на удаленном сервере, и у него есть внутренние и внешние конфигурации. Внешные конфигурация будет находится на отдельной репозитории в gitlab. В конфигурации указывается полная информация о созданных проектов и информация о вариантах задач. Грейдер отслеживает те проекты которые у него есть в конфигурации. В информации о проектах входит:
- gmail-почта студента
- имя студента
- идентификатор круса в classroom
- идентификатор курсовой работы
- идентификатор проекта в gitlab.
- время создания проекта (unix timestamp
- продолжительность отслеживания в секундах
- дата последнего обновления (unix timestamp)
- вариант задачи

Во внутренних конфигурации проекта входит файл по адресу configs/global.js в котором указывается токен для работы с gitlab, домен gitlab, идентификатор репозиторий где указаны внешние конфигурации, также шаблоны сообщений. Также есть файлы для получения доступа к внешним API:
- 	**zuliprc** - доступ к генеративному боту в zulip
- 	**credentials.json** - доступ к API google
- 	**token.json** - токен по котором происходит общения с google API. Создается динамически исходя из credentials.josn


## <a name="functionality"></a> Функциональ грейдера

В файле package.json указывается нужные пакеты, которые необходимы для корректной работы грейдера. При установки npm все указанные пакеты устанавливаются автоматический. Также в ней указанный нужные команды грейдера. Шаблон команды выглядит таким образом **npm run #command**. Команды по которым работает грейдер:

- **start** - запускает сам грейдер, и оно будет работать до тех пор пока принудительно не остановят ее
- **create** - создает задачи для студентов. Поддерживает ряд аргументов:
    - **--gmail** -  создает задачу для студента с заданным gmail
    - **--task-variant** - указывается вариант задачи
    - **--task-type** - указывает тип задач
    - **--group** - указывается группа для которых будет создано задачки (только образовательные группы МИЭМ)
    - **--limit** - указывается продолжительность отслеживания в миллисекундах. Время считается с даты создания проекта в гитлаб. По умолчанию лимит имеет отрицательное значение и проект будет отслеживаться до тех пор пока ее не удалят.
    - **--course-id** - идентификатор существующего курса в classroom
    - **--course-title** - создать курс с таким названием
    - **--cw-id** - идентификатор существующей курсовой работы
    - **--cw-title** - создать курсовую работу с заданным названием

***Примечания***
> - Если задан **gmail**, игнорируется группа.
> - Если вариант задан то для группы или студента создается задача с таким вариантом и игнорируется тип задач.
> - Если не указан тип задач, то по умолчанию задачи выбираются на юнит-тестах.
> - Если не указан лимит времени для отслеживания то, по умолчанию устанавливается на час (3600 * 1000 милисекунд).
> - Если идентификатор курса задан, то игнорируется названия курса и не создается новый курс. По умолчанию если не указан названия нового курса, устанавливается курс по умолчанию.
> - Если задан идентификатор существующего курсовой работы, то игнорируется название новой курсовой работы.
> - По умолчанию курсовая работа называется “Экзамен”
> - По умолчанию используется префикс “exam” для проектов в **gitlab**.

- **get** - получит список созданных задач. Поддерживает ряд аргументов:
    - **--gmail** - получает список проектов принадлежащих студенту с указанным gmail
    - **--task-variant** - список проектов по варианту
    - **--course-id** - идентификатор существующего курса в classroom
    - **--task-type** - список проектов по типу задач
    - **--group** - проекты для заданной группы
    - **--git-prefix** - проекты начинающийся с заданным префиксом
    - **--pr-ids** - проекты с заданными идентификаторами в гитлаб
    - **--cw-title** - проекты где название курсовой работы равняется заданному названию
    - **--cw-ids** - проекты где идентификатор курсовой работы входи в заданных идентификаторах (Пример --cw-ids=”1 2 3”)
    - **--active** - активные проекты. Активным проектом считается проект для которого выставляется оценки в classroom. 
    - **--not-active** - неактивные проекты. Проекты которые отслеживаются но для них не выставляется оценка в classroom. Общение происходит только с чатом zulip.
- **delete** - удалить созданные проекты. Поддерживает ряд аргументов:
    - **--gmail** - все проекты принадлежащие студенту по заданному gmail
    - **--git-prefix** - все проекты начинающийся с заданным префиксом
    - **--cw-id** - все проекты где идентификатор курсовой работы равно заданному
    - **--cw-title** - все проекты где название курсовой работы совпадает заданному
    - **--pr-ids** - все проекты с заданными идентификаторами в gitlab
    - **--all** - все проекты
    - **--not-active** - все неактивные проекты
    - **--active** - все активные проекты
