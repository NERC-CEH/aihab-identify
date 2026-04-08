let deferredInstallPrompt = null;

// Apply Config
document.addEventListener('DOMContentLoaded', () => {
    // Titles and Meta
    document.title = CONFIG.appName;
    document.getElementById('apple-title').content = CONFIG.appName;
    document.getElementById('theme-color').content = CONFIG.themeColor;
    
    // Icons
    document.getElementById('favicon').href = CONFIG.appIcon;
    document.getElementById('apple-icon').href = CONFIG.appIcon;
    
    // iframe
    const iframe = document.getElementById('main-iframe');
    iframe.src = CONFIG.iframeUrl;
    
    // Body Background
    document.body.style.backgroundColor = CONFIG.backgroundColor;
    document.getElementById('offline-overlay').style.backgroundColor = CONFIG.backgroundColor;

    setupInstallPrompt();
    updateInstallBanner();
    updateOnlineStatus();
});

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallBanner();
});

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    updateInstallBanner();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js', { scope: './' }).then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function isRunningAsPwa() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function updateInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (!banner) {
        return;
    }

    banner.hidden = isRunningAsPwa();
}

function setupInstallPrompt() {
    const installLink = document.getElementById('install-link');
    if (!installLink) {
        return;
    }

    installLink.addEventListener('click', async (event) => {
        event.preventDefault();

        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
            updateInstallBanner();
            return;
        }

        window.alert('To install this app, open your browser menu and choose "Install app" or "Add to Home Screen".');
    });
}

// Online/Offline Handler
function updateOnlineStatus() {
    const overlay = document.getElementById('offline-overlay');
    if (navigator.onLine) {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
