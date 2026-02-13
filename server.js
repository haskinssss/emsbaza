require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Discord Configuration
const DISCORD_CONFIG = {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    botToken: process.env.DISCORD_BOT_TOKEN,
    redirectUri: process.env.DISCORD_REDIRECT_URI || `http://localhost:${PORT}/callback`,
    guildId: process.env.DISCORD_GUILD_ID || '1066019542591082557',
    requiredRole: process.env.REQUIRED_ROLE || '1066019542804987970'
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache-Control middleware dla zapobiegania cacheowaniu
app.use((req, res, next) => {
    if (req.path.endsWith('.html') || req.path === '/') {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
    next();
});

app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: process.env.SESSION_SECRET || 'ems-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Ustaw na true jeśli używasz HTTPS
}));

// Routing - Strona główna
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// OAuth Callback endpoint
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.redirect('/?error=no_code');
    }
    
    try {
        // Wymiana kodu na access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
            new URLSearchParams({
                client_id: DISCORD_CONFIG.clientId,
                client_secret: DISCORD_CONFIG.clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: DISCORD_CONFIG.redirectUri,
                scope: 'identify guilds guilds.members.read'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const { access_token } = tokenResponse.data;
        
        // Pobierz dane użytkownika
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const userData = userResponse.data;
        
        console.log(`[AUTH] User ${userData.username}#${userData.discriminator} (${userData.id}) logging in...`);
        
        // Sprawdź członkostwo i role używając Bot Token
        let memberData;
        try {
            const memberResponse = await axios.get(
                `https://discord.com/api/guilds/${DISCORD_CONFIG.guildId}/members/${userData.id}`,
                {
                    headers: {
                        Authorization: `Bot ${DISCORD_CONFIG.botToken}`
                    }
                }
            );
            memberData = memberResponse.data;
        } catch (error) {
            console.error('[AUTH] Failed to fetch member data:', error.response?.status, error.response?.data);
            
            if (error.response?.status === 404) {
                return res.redirect('/?error=not_in_guild');
            }
            
            return res.redirect('/?error=auth_failed');
        }
        
        const userRoles = memberData.roles || [];
        console.log(`[AUTH] User roles:`, userRoles);
        
        // Sprawdź czy użytkownik ma wymaganą rolę
        const hasRequiredRole = userRoles.includes(DISCORD_CONFIG.requiredRole);
        
        console.log(`[AUTH] Checking required role: ${DISCORD_CONFIG.requiredRole} - Has: ${hasRequiredRole}`);
        
        if (!hasRequiredRole) {
            console.log(`[AUTH] User doesn't have required role - access denied`);
            return res.redirect('/?error=no_access');
        }
        
        console.log(`[AUTH] User granted access`);
        
        // Zapisz dane w sesji
        const userDataToSave = {
            id: userData.id,
            username: memberData.nick || userData.username,
            avatar: userData.avatar,
            roles: userRoles,
            hasAccess: true
        };
        
        req.session.user = userDataToSave;
        req.session.accessToken = access_token;
        
        // Zapisz sesję przed przekierowaniem
        req.session.save((err) => {
            if (err) {
                console.error('[AUTH] Session save error:', err);
                return res.redirect('/?error=auth_failed');
            }
            
            // Przekieruj do strony bazy wiedzy
            const userDataEncoded = encodeURIComponent(JSON.stringify(userDataToSave));
            const timestamp = Date.now(); // Cache buster
            
            console.log(`[AUTH] Redirecting to baza-wiedzy.html`);
            res.redirect(`/baza-wiedzy.html?auth=success&userData=${userDataEncoded}&token=${access_token}&t=${timestamp}`);
        });
        
    } catch (error) {
        console.error('[AUTH] OAuth Error:', error.response?.data || error.message);
        console.error('[AUTH] Error stack:', error.stack);
        res.redirect('/?error=auth_failed');
    }
});

// API endpoint do weryfikacji sesji
app.get('/api/auth/verify', (req, res) => {
    if (req.session.user && req.session.accessToken) {
        res.json({
            success: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// API endpoint do wylogowania
app.post('/api/auth/logout', (req, res) => {
    console.log('[Logout] User logging out, clearing session...');
    
    req.session.user = null;
    req.session.accessToken = null;
    
    req.session.destroy((err) => {
        if (err) {
            console.error('[Logout] Error destroying session:', err);
            return res.status(500).json({ success: false });
        }
        
        console.log('[Logout] Session destroyed successfully');
        
        // Wyczyść cookie sesji
        res.clearCookie('connect.sid');
        
        res.json({ success: true });
    });
});

// Middleware do sprawdzania autoryzacji dla chronionych stron
function requireAuth(req, res, next) {
    if (!req.session.user || !req.session.accessToken) {
        return res.redirect('/');
    }
    next();
}

// Serwuj stronę bazy wiedzy
app.get('/baza-wiedzy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'baza-wiedzy.html'));
});

app.get('/kompendium-medyczne.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'kompendium-medyczne.html'));
});

app.get('/temat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'temat.html'));
});

app.get('/ustawienia.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ustawienia.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Coś poszło nie tak!');
});

// Start serwera
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║     EMS Discord Auth Server               ║
╠═══════════════════════════════════════════╣
║  Port: ${PORT}                            ║
║  URL: http://localhost:${PORT}            ║
║                                           ║
║  Status: ✓ Serwer działa                 ║
╚═══════════════════════════════════════════╝
    `);
    
    if (!DISCORD_CONFIG.clientId || !DISCORD_CONFIG.clientSecret) {
        console.log(`
⚠️  UWAGA: Brak konfiguracji Discord!
Stwórz plik .env i dodaj:
  DISCORD_CLIENT_ID=twoj_client_id
  DISCORD_CLIENT_SECRET=twoj_client_secret
        `);
    }
});
