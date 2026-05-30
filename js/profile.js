// ========== ПРОФИЛЬ И ВЫХОД ==========

async function loadProfile() {
    if (!window.supabaseClient) {
        console.warn('Supabase клиент не инициализирован');
        return;
    }
    
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    const profileEmailSpan = document.getElementById('profileEmail');
    const dropdownEmailDiv = document.getElementById('dropdownEmail');
    
    if (user) {
        const email = user.email;
        if (profileEmailSpan) {
            profileEmailSpan.textContent = email.length > 15 ? email.slice(0, 12) + '...' : email;
        }
        if (dropdownEmailDiv) {
            dropdownEmailDiv.textContent = email;
        }
    } else {
        // Пользователь не авторизован — перенаправляем на login.html
        window.location.href = '../login.html';
    }
}

// Переключение выпадающего меню
function initProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (!profileBtn || !profileDropdown) return;
    
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = profileDropdown.style.display === 'block';
        profileDropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    // Закрыть при клике вне меню
    document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.style.display = 'none';
        }
    });
}

// Сменить пароль
function initChangePassword() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (!changePasswordBtn) return;
    
    changePasswordBtn.addEventListener('click', async () => {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        const email = user?.email;
        if (email) {
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/update-password.html',
            });
            if (error) {
                alert('Ошибка: ' + error.message);
            } else {
                alert('Ссылка для сброса пароля отправлена на вашу почту');
                document.getElementById('profileDropdown').style.display = 'none';
            }
        }
    });
}

// Выйти
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', async () => {
        await window.supabaseClient.auth.signOut();
        window.location.href = '../login.html';
    });
}

// Инициализация всего профиля
function initProfile() {
    loadProfile();
    initProfileDropdown();
    initChangePassword();
    initLogout();
}

// Запускаем после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfile);
} else {
    initProfile();
}