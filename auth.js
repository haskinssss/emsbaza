// Discord OAuth Configuration
const DISCORD_CONFIG = {
    clientId: '1470943686744342783',
    redirectUri: 'http://localhost:3000/callback',
    guildId: '1066019542591082557',
    requiredRole: '1066019542804987970'
};

// ===== OBSŁUGA URL PARAMS - WYKONAJ TO ZARAZ NA START =====
// Nie czekaj na DOMContentLoaded - zrób to szybko!
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const auth = urlParams.get('auth');
    const userDataParam = urlParams.get('userData');
    const token = urlParams.get('token');
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log(`[Auth Init] Page: ${currentPage}`);
    console.log(`[Auth Init] Auth param: ${auth}, Has userData: ${!!userDataParam}, Has token: ${!!token}`);
    
    if (auth === 'success' && userDataParam && token) {
        try {
            const userData = JSON.parse(decodeURIComponent(userDataParam));
            
            console.log(`[Auth Init] ✅ Auth success! User: ${userData.username}`);
            
            // Zapisz dane użytkownika ZARAZ
            localStorage.setItem('emsUserData', JSON.stringify(userData));
            localStorage.setItem('emsAccessToken', token);
            
            // Wyczyść URL z parametrów
            window.history.replaceState({}, document.title, window.location.pathname);
            
            console.log(`[Auth Init] ✅ Data saved to localStorage`);
        } catch (error) {
            console.error('[Auth Init] ❌ Error parsing user data:', error);
        }
    } else {
        console.log(`[Auth Init] No auth params found, checking localStorage...`);
    }
})();

// Sprawdzenie autoryzacji na każdej stronie (oprócz strony logowania)
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Jeśli to nie strona logowania, sprawdź czy użytkownik jest zalogowany
    if (currentPage !== 'index.html' && currentPage !== '') {
        checkAuth();
    }
    
    // Obsługa przycisku logowania
    const loginBtn = document.getElementById('discordLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', initiateDiscordLogin);
    }
    
    // Obsługa wylogowania
    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
    
    // Wyświetl nazwę użytkownika
    displayUserName();
    
    // Załaduj kolor accent'u
    if (typeof loadAndApplySettings === 'function') {
        loadAndApplySettings();
    }
    
    // Obsługa parametrów URL z backendu (dla błędów)
    handleURLParams();
});

// Inicjuj logowanie przez Discord
function initiateDiscordLogin() {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CONFIG.clientId}&redirect_uri=${encodeURIComponent(DISCORD_CONFIG.redirectUri)}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
    
    // Sprawdź czy są skonfigurowane dane Discord
    if (DISCORD_CONFIG.clientId === 'YOUR_CLIENT_ID') {
        // Tryb demo - symulacja logowania
        alert('Tryb demo: Wybierz rolę do symulacji\n1 - MR\n2 - HIC\n3 - Command\n0 - Brak dostępu');
        simulateLogin();
    } else {
        // Prawdziwe logowanie przez Discord
        window.location.href = authUrl;
    }
}

// Obsługa parametrów URL po przekierowaniu z backendu (błędy)
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obsługa błędów autoryzacji
    const error = urlParams.get('error');
    if (error) {
        let errorMessage = 'Wystąpił błąd podczas logowania';
        let errorDetails = '';
        
        switch (error) {
            case 'not_in_guild':
                errorMessage = 'Nie jesteś członkiem wymaganego serwera Discord';
                errorDetails = 'Dołącz do serwera EMS i spróbuj ponownie.';
                break;
            case 'no_access':
                errorMessage = 'Nie posiadasz wymaganych uprawnień';
                errorDetails = `Upewnij się, że posiadasz wymaganą rolę na serwerze Discord.`;
                break;
            case 'auth_failed':
                errorMessage = 'Autoryzacja nie powiodła się';
                errorDetails = 'Spróbuj ponownie. Jeśli problem się powtarza, skontaktuj się z administratorem.';
                break;
            case 'no_code':
                errorMessage = 'Brak kodu autoryzacyjnego';
                errorDetails = 'Anulowano logowanie lub wystąpił błąd Discord.';
                break;
        }
        
        showAccessDenied(errorMessage, errorDetails);
        
        // Wyczyść URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Zastosuj theme na podstawie roli użytkownika (usunięte - tylko jeden motyw)
function applyTheme(role) {
    // Funkcja pozostawiona dla zgodności, ale nie robi nic
}

// Symulacja logowania (dla testów)
function simulateLogin() {
    const hasAccess = confirm('Symuluj dostęp? OK = Tak (dostęp przyznany), Anuluj = Nie (brak dostępu)');
    
    let userData;
    
    if (hasAccess) {
        userData = {
            id: 'demo123',
            username: 'Demo User',
            roles: [DISCORD_CONFIG.requiredRole],
            hasAccess: true
        };
        
        // Zapisz dane użytkownika
        localStorage.setItem('emsUserData', JSON.stringify(userData));
        localStorage.setItem('emsAccessToken', 'demo_token_' + Date.now());
        
        // Pokaż loading toast
        showToast('Logowanie...', 'info', -1);
        
        // Przekieruj do strony bazy wiedzy (z opóźnieniem dla animacji)
        setTimeout(() => {
            window.location.href = 'baza-wiedzy.html';
        }, 800);
    } else {
        userData = {
            id: 'demo000',
            username: 'Demo No Access',
            roles: [],
            hasAccess: false
        };
        
        // Pokaż błąd
        showAccessDenied();
    }
}

// Sprawdzenie autoryzacji
function checkAuth() {
    const userData = localStorage.getItem('emsUserData');
    const accessToken = localStorage.getItem('emsAccessToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log(`[checkAuth] On page: ${currentPage} | Has userData: ${!!userData} | Has token: ${!!accessToken}`);
    
    if (!userData || !accessToken) {
        // Brak autoryzacji - przekieruj do logowania
        console.log(`[checkAuth] ❌ No auth data, redirecting to index.html`);
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(userData);
    console.log(`[checkAuth] ✅ Found user: ${user.username}`);
}

// Funkcje uproszczone - nie potrzebne z jedną stroną
function hasAccessToPage(userRole, page) {
    return true; // Jedna strona - zawsze dostęp
}

function redirectBasedOnRole(role) {
    window.location.href = 'baza-wiedzy.html';
}

// Wyświetl błąd braku dostępu
function showAccessDenied(customMessage = null, customDetails = null) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        // Jeśli jest niestandardowa wiadomość, zaktualizuj tekst
        if (customMessage) {
            const errorText = errorMessage.querySelector('p');
            if (errorText) {
                errorText.innerHTML = `❌ ${customMessage}`;
            }
        }
        
        // Jeśli są szczegóły, zaktualizuj je
        if (customDetails) {
            const errorDetailsEl = errorMessage.querySelector('.error-details');
            if (errorDetailsEl) {
                errorDetailsEl.textContent = customDetails;
            }
        }
        
        errorMessage.style.display = 'block';
        
        // Animacja
        setTimeout(() => {
            errorMessage.style.animation = 'slideDown 0.3s ease';
        }, 10);
    }
}

// Wylogowanie
function logout() {
    showLogoutConfirm();
}

// Modal potwierdzenia wylogowania
function showLogoutConfirm() {
    const modal = document.createElement('div');
    modal.className = 'logout-confirm-modal';
    modal.innerHTML = `
        <div class="logout-confirm-content">
            <div class="logout-confirm-header">
                <h2>Wylogowanie</h2>
            </div>
            <div class="logout-confirm-body">
                <p>Czy na pewno chcesz się wylogować?</p>
            </div>
            <div class="logout-confirm-footer">
                <button class="btn-cancel" onclick="this.closest('.logout-confirm-modal').remove()">Anuluj</button>
                <button class="btn-confirm" onclick="performLogout()">Wyloguj się</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function performLogout() {
    // Pokaż loading toast
    const loadingToast = showToast('Wylogowywanie...', 'info', -1);
    
    // Wyczyść sesję na backendzie
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(() => {
        // Wyczyść localStorage
        localStorage.removeItem('emsUserData');
        localStorage.removeItem('emsAccessToken');
        
        console.log('[Logout] Session cleared');
        
        // Pokaż success toast
        loadingToast.remove();
        showSuccessToast('✓ Wylogowano pomyślnie!', 2000);
        
        // Przekieruj na stronę logowania (z opóźnieniem dla animacji)
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }).catch(error => {
        console.error('[Logout] Error:', error);
        // Nawet jeśli błąd, wyczyść frontendowo i idź do logowania
        localStorage.removeItem('emsUserData');
        localStorage.removeItem('emsAccessToken');
        
        loadingToast.remove();
        showSuccessToast('✓ Wylogowano', 1500);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Wyświetl nazwę użytkownika
function displayUserName() {
    const userNameElement = document.getElementById('userName');
    const userProfileBtn = document.getElementById('userProfileBtn');
    
    if (!userNameElement || !userProfileBtn) return;
    
    const userData = localStorage.getItem('emsUserData');
    if (userData) {
        const user = JSON.parse(userData);
        
        // Zbuduj URL avatara
        let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
        if (user.avatar) {
            const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
            avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}`;
        }
        
        // Clear existing content and add avatar + username
        userNameElement.innerHTML = '';
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = user.username;
        img.className = 'user-profile-avatar-btn';
        img.onerror = function() { this.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; };
        
        const span = document.createElement('span');
        span.textContent = user.username;
        
        userNameElement.appendChild(img);
        userNameElement.appendChild(span);
        
        // Add click handler to navigate to settings
        userProfileBtn.addEventListener('click', () => {
            window.location.href = 'ustawienia.html';
        });
    }
}

// Modal profilu użytkownika
function openUserProfileModal() {
    const userData = localStorage.getItem('emsUserData');
    if (!userData) return;
    
    const user = JSON.parse(userData);
    
    // Zbuduj URL avatara
    let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (user.avatar) {
        const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
        avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}`;
    }
    
    // Dane profilu (demo data)
    const joinDate = new Date();
    joinDate.setMonth(joinDate.getMonth() - 3); // 3 miesiące temu
    const formattedDate = joinDate.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const roleNames = {
        'mr': 'Medical Response',
        'hic': 'Hospital Intensive Care',
        'command': 'Command Center'
    };
    
    const hourlyRates = {
        'mr': '50 zł',
        'hic': '65 zł',
        'command': '80 zł'
    };
    
    const modal = document.createElement('div');
    modal.className = 'user-profile-modal';
    modal.innerHTML = `
        <div class="user-profile-modal-content">
            <button class="modal-close-btn" onclick="this.closest('.user-profile-modal').remove()">✕</button>
            
            <div class="user-profile-header">
                <img src="${avatarUrl}" alt="Avatar" class="user-profile-avatar" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                <h2>${user.username}</h2>
                <div class="user-profile-badge">${roleNames[user.role]}</div>
            </div>
            
            <div class="user-profile-info">
                <div class="info-row">
                    <span class="info-label">Data dołączenia do EMS:</span>
                    <span class="info-value">${formattedDate}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Stanowisko:</span>
                    <span class="info-value">${roleNames[user.role]}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Stawka godzinowa:</span>
                    <span class="info-value">${hourlyRates[user.role]}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">ID Discord:</span>
                    <span class="info-value">${user.id}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Rola systemowa:</span>
                    <span class="info-value">${user.role.toUpperCase()}</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Funkcja pomocnicza do weryfikacji roli na backendzie
async function verifyUserRoles(accessToken, guildId) {
    try {
        // Pobierz dane użytkownika
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userData = await userResponse.json();
        
        // Pobierz członkostwo w serwerze
        const memberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        if (!memberResponse.ok) {
            // Użytkownik nie jest członkiem serwera
            return { hasAccess: false };
        }
        
        const memberData = await memberResponse.json();
        const userRoles = memberData.roles;
        
        // Sprawdź role
        let role = 'none';
        let hasAccess = false;
        
        if (userRoles.includes(DISCORD_CONFIG.roles.commandEMS)) {
            role = 'command';
            hasAccess = true;
        } else if (userRoles.includes(DISCORD_CONFIG.roles.medicalResponse)) {
            role = 'mr';
            hasAccess = true;
        } else if (userRoles.includes(DISCORD_CONFIG.roles.hospitalIntensiveCare)) {
            role = 'hic';
            hasAccess = true;
        }
        
        return {
            hasAccess,
            user: {
                id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator,
                role,
                roles: userRoles
            }
        };
    } catch (error) {
        console.error('Role verification error:', error);
        return { hasAccess: false };
    }
}
