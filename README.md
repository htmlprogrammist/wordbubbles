# Word Bubbles
Игра, в которой пользователь проверяет свой словарный запас. Дано первые две буквы, необходимо ввести как можно больше слов. Чем слово больше, тем больше очков он получает. Правильный и неправильный ввод слов сопровождается соответствующими звуками. 

Ограничение во времени: 1 минута

Валидация слов осуществляется через **API Яндекс.Спеллер**, который работает криво:

Если пользователь ввёл *"asdfasdfasf"* - Спеллер не понимает, что это за слово и возвращает пустой массив. Это не единственный случай, когда он возвращает пустой массив: если слово написано верно, возвращается пустой массив. 

Именно эта крайность и не позволяет адекватно проверить знание языка. 

Мне очень дорого это приложение, потому что с его помощью я очень круто прокачался в знаниях JavaScript'а, поэтому я решил воскресить его из проекта [RSLang](https://github.com/htmlprogrammist/rslang), который сейчас пребывает в состоянии мертвеца из-за переехавшего API.

В папке [wordBubbles](/wordBubbles) можно найти оригинальный код из проекта. Сохранил так, чисто для истории.