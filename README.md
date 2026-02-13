# System EMS z Discord OAuth 🚑

Profesjonalny system Bazy Wiedzy dla Emergency Medical Services z autoryzacją przez Discord.

## 🎨 Funkcje

- ✅ Logowanie przez Discord OAuth 2.0
- ✅ Weryfikacja członkostwa na serwerze Discord
- ✅ Weryfikacja wymaganej roli Discord
- ✅ Baza wiedzy medycznej
- ✅ Responsywny interfejs
- ✅ Dark/Light mode
- ✅ Konfigurowalne animacje
- ✅ Premium design

## 🚀 Instalacja

### Wymagania

- Node.js (wersja 16 lub nowsza)
- Konto Discord Developer
- Serwer Discord z odpowiednimi rolami

### Krok 1: Sklonuj repozytorium

```bash
cd bazapracownika
```

### Krok 2: Zainstaluj zależności

```bash
npm install
```

### Krok 3: Konfiguracja Discord Application

1. Przejdź do [Discord Developer Portal](https://discord.com/developers/applications)
2. Kliknij "New Application"
3. Podaj nazwę aplikacji (np. "EMS System")
4. Przejdź do zakładki **OAuth2**
5. Skopiuj:
   - **Client ID**
   - **Client Secret** (kliknij "Reset Secret" jeśli nie widzisz)

### Krok 4: Dodaj Redirect URL

W Discord Developer Portal → OAuth2 → Redirects:
```
http://localhost:3000/callback
```

### Krok 5: Wybierz Scopes

W OAuth2 URL Generator zaznacz:
- ✅ `identify`
- ✅ `guilds`
- ✅ `guilds.members.read`

### Krok 6: Konfiguracja środowiska

Stwórz plik `.env` (skopiuj z `.env.example`):

```env
DISCORD_CLIENT_ID=twoj_client_id
DISCORD_CLIENT_SECRET=twoj_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/callback
DISCORD_GUILD_ID=1066019542591082557
REQUIRED_ROLE=1066019542804987970
PORT=3000
SESSION_SECRET=wygeneruj-losowy-klucz-tutaj
```

**Jak znaleźć ID roli:**
1. W Discord włącz Developer Mode (User Settings → Advanced → Developer Mode)
2. Kliknij prawym na rolę → Copy ID

### Krok 7: Uruchom serwer

```bash
npm start
```

Dla trybu deweloperskiego (auto-restart):
```bash
npm run dev
```

### Krok 8: Otwórz w przeglądarce

```
http://localhost:3000
```

## 📋 Struktura Projektu

```
bazapracownika/
├── index.html           # Strona logowania
├── baza-wiedzy.html     # Baza wiedzy medycznej
├── styles.css           # Style CSS
├── auth.js              # Logika autoryzacji Discord
├── settings.js          # System ustawień (dark/light mode)
├── server.js            # Backend Express.js
├── package.json         # Zależności Node.js
├── .env                 # Konfiguracja (NIE commitować!)
└── README.md            # Ten plik
```

## 🎭 Dostęp

### Wymagana Rola
- **ID Roli:** `1066019542804987970`
- **Dostęp:** Baza Wiedzy EMS
- **Motyw:** Dark mode z niebieskimi akcentami

## 🔧 Konfiguracja

### Zmiana ID Serwera Discord

W pliku `.env`:
```env
DISCORD_GUILD_ID=twoje_id_serwera
```

### Zmiana ID Wymaganej Roli

W pliku `.env`:
```env
REQUIRED_ROLE=id_wymaganej_roli
```

### Zmiana Portu

W pliku `.env`:
```env
PORT=3000
```

## 🎨 Personalizacja

### Zmiana kolorów

Edytuj zmienne CSS w pliku `styles.css`:

```css
:root {
    --bg-primary: #000000;
    --bg-secondary: #0a0a0a;
    --text-primary: #ffffff;
}
```

### Włączenie/wyłączenie animacji

Użytkownicy mogą to zrobić w ustawieniach, ale domyślnie:

W pliku `settings.js`:
```javascript
const DEFAULT_SETTINGS = {
    darkMode: true,
    animations: true  // false aby wyłączyć
};
```

## 🛠️ Tryb Deweloperski

### Symulacja logowania (bez Discord)

W pliku `auth.js` funkcja `initiateDiscordLogin()` zawiera tryb symulacji. 
Wystarczy kliknąć "Zaloguj przez Discord" i wybrać rolę do testów.

### Debug mode

Otwórz konsolę przeglądarki (F12) aby zobaczyć logi debugowania.

## 🔒 Bezpieczeństwo

- ✅ Sesje użytkowników z express-session
- ✅ Weryfikacja członkostwa na serwerze
- ✅ Sprawdzanie ról przy każdym żądaniu
- ✅ Redirect dla nieautoryzowanych użytkowników
- ⚠️ **NIE** commituj pliku `.env` do repozytorium!
- ⚠️ Zmień `SESSION_SECRET` na losowy klucz

## 📱 Responsywność

System jest w pełni responsywny i działa na:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🐛 Rozwiązywanie problemów

### OAuth błąd "redirect_uri_mismatch"
- Sprawdź czy URL callback w Discord Developer Portal jest identyczny z `.env`

### "Not in guild" error
- Upewnij się że użytkownik jest na serwerze o podanym `DISCORD_GUILD_ID`
- Sprawdź czy aplikacja Discord ma dostęp do `guilds.members.read`

### "No access" error
- Sprawdź czy użytkownik ma wymaganą rolę
- Zweryfikuj ID roli w pliku `.env`

### Serwer nie startuje
```bash
# Sprawdź czy port jest wolny
netstat -ano | findstr :3000

# Zabij proces jeśli potrzeba (Windows)
taskkill /PID <process_id> /F
```

### Nie ładują się style
- Sprawdź czy `styles.css` jest w głównym folderze
- Otwórz Developer Tools (F12) → Network i sprawdź błędy

## 📄 Licencja

MIT License - możesz swobodnie używać i modyfikować.

## 👨‍💻 Wsparcie

W razie problemów sprawdź:
1. Logi serwera w terminalu
2. Konsolę przeglądarki (F12)
3. Konfigurację Discord Developer Portal

## 🔄 Aktualizacje

Aby zaktualizować zależności:
```bash
npm update
```

---

**Stworzone z ❤️ dla EMS**

*System zaprojektowany dla profesjonalnych służb medycznych*
