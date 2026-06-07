Fuel Tracker PWA Ready v17

Това е готова папка за качване в GitHub Pages / Netlify / Vercel.
Основният файл за телефон е index.html.

Съдържание:
- index.html — мобилна версия
- desktop.html — desktop версия
- manifest.webmanifest — PWA manifest
- service-worker.js — offline/cache основа
- icon-192.png и icon-512.png — икони за Android
- fuel_tracker_google_drive_apps_script_v11.gs — Apps Script код за Drive JSON

Google Drive /exec URL вече е вграден в index.html и desktop.html.


Промени v17:
- Километрите в историята вече се смятат отделно по тип гориво.
- LPG запис гледа до следващ LPG запис.
- A95 запис гледа до следващ A95 запис.
- Бензиновият пробег не се брои към газта.
