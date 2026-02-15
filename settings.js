// System zarządzania ustawieniami

// Domyślne ustawienia
const DEFAULT_SETTINGS = {
	darkMode: true,
	animations: true,
	accentColor: '#8b5cf6',
}

// Załaduj ustawienia przy starcie
document.addEventListener('DOMContentLoaded', () => {
	loadAndApplySettings()
	initAccentColorPicker()
})

// Załaduj ustawienia z localStorage
function loadSettings() {
	const savedSettings = localStorage.getItem('emsSettings')
	if (savedSettings) {
		try {
			return JSON.parse(savedSettings)
		} catch (e) {
			console.error('Error loading settings:', e)
			return DEFAULT_SETTINGS
		}
	}
	return DEFAULT_SETTINGS
}

// Zapisz ustawienia do localStorage
function saveSettings(settings) {
	localStorage.setItem('emsSettings', JSON.stringify(settings))
}

// Załaduj i zastosuj ustawienia
function loadAndApplySettings() {
	const settings = loadSettings()

	// Zastosuj dark mode
	if (settings.darkMode) {
		document.body.classList.remove('light-mode')
	} else {
		document.body.classList.add('light-mode')
	}

	// Zastosuj animacje
	if (!settings.animations) {
		document.body.classList.add('no-animations')
	} else {
		document.body.classList.remove('no-animations')
	}

	// Zastosuj kolor accent'u
	applyAccentColor(settings.accentColor)
}

// Zmieni kolor accent'u
function applyAccentColor(color) {
	console.log('Applying accent color:', color)
	const rgb = hexToRgb(color)
	if (!rgb) {
		console.error('Invalid color format:', color)
		return
	}

	console.log('RGB values:', rgb)
	document.documentElement.style.setProperty('--accent-primary', color)
	generateAccentCSS(color, rgb)
	console.log('Accent color applied successfully')
}

// Generuj dynamiczny CSS dla accent koloru
function generateAccentCSS(hexColor, rgb) {
	let styleId = 'accent-color-style'
	let existingStyle = document.getElementById(styleId)

	if (existingStyle) {
		existingStyle.remove()
	}

	const style = document.createElement('style')
	style.id = styleId
	style.textContent = `
        :root {
            --accent-primary: ${hexColor} !important;
        }
        
        .user-profile-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .user-profile-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 6px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .user-profile-avatar-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .user-profile-btn:hover .user-profile-avatar-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        
        .add-topic-btn, .add-category-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .add-topic-btn:hover, .add-category-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 8px 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        
        .card {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 16px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
        }
        
        .card:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 10px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .topic-tile {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 24px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15) !important;
        }
        
        .topic-tile:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) !important;
            box-shadow: 0 8px 32px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .edit-topic-btn {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) !important;
        }
        
        .edit-topic-btn:hover {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) !important;
        }
        
        .modal-content {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .modal-header {
            border-bottom: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        .emoji-picker-container {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .emoji-option {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important; 
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) !important;
        }

        .emoji-picker-container span {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
            box-shadow: 0 2px 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
        }

        .emoji-picker-container span:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 6px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }

        .emoji-picker-container span.selected {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) !important;
            box-shadow: 0 8px 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6), inset 0 0 0 2px rgba(255,255,255,0.15) !important;
        }
        .modal-body input, .modal-body textarea, .modal-body select {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
            box-shadow: 0 2px 4px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) !important;
        }
        .topicDesc, #topicName, #topicCategory, #topicEmoji {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }

        .modal-body input:focus, .modal-body textarea:focus, .modal-body select:focus {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) !important;
            box-shadow: 0 0 0 4px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .btn-cancel, .btn-confirm {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 2px 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
        }
        
        .btn-cancel:hover, .btn-confirm:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 6px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        .modal-footer {
            border-top: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        .card-btn {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 2px 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
        }
        
        .card-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .theme-toggle-btn {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .theme-toggle-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 6px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }

        .knowledge-base-theme {
            background: radial-gradient(circle at 60% 68%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18) 0%, rgba(0, 0, 0, 0) 72%), #000000 !important;
        }

        .topics-search {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important;
        }

        .topics-search:focus-within {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 6px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35) !important;
        }

        .topics-search-clear {
            border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }

        .topics-search-clear:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }

        .discord-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            box-shadow: 0 8px 24px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important;
        }

        .discord-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85) !important;
            box-shadow: 0 12px 32px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45) !important;
        }
        
        #categoriesList::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        #categoriesList::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        .modal-body::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        .modal-body::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        /* Bardzo specyficzne selektory dla nadpisania bazowego CSS */
        html ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        html ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        html body::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        html body::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        /* Firefox scrollbar */
        html * {
            scrollbar-color: ${hexColor} var(--bg-primary) !important;
        }

        *::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }

        *::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        body::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        body::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        html::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        html::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        .content-area::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${hexColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%) !important;
            border: 2px solid var(--bg-primary) !important;
            border-radius: 10px !important;
        }
        
        .content-area::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, ${hexColor} 100%) !important;
        }
        
        .btn-secondary {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .btn-secondary:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .edit-topic-btn {
            background: linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75) 100%) !important;
            box-shadow: 0 2px 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .edit-topic-btn:hover {
            background: linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 100%) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .add-subtopic-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        
        .add-subtopic-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .btn-edit {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) !important;
        }
        
        .btn-edit:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }

        .category-card {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45) !important;
        }

        .category-card:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }

        .menu-btn {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            box-shadow: 0 2px 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
        }

        .menu-btn:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85) !important;
            box-shadow: 0 6px 18px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        .main-tile {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
            box-shadow: 0 8px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important;
        }
        
        .main-tile:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 12px 40px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35) !important;
        }
        
        .tile-button {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .tile-button:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) !important;
            box-shadow: 0 6px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        
        /* Bardzo specyficzne selektory dla presetów kolorów */
        .setting-card .accent-preset:hover,
        .accent-preset:hover {
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
            transform: scale(1.1) !important;
        }
        
        .setting-card .accent-preset.active,
        .accent-preset.active {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) !important;
            box-shadow: 0 0 0 3px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3), 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            transform: scale(1.15) !important;
        }
        
        #accentColorPicker:hover {
            box-shadow: 0 0 0 4px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        /* Kafelki podtematów na stronie temat */
        .subtopic-item {
            border: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
            box-shadow: 0 2px 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) !important;
        }
        
        .subtopic-item:hover {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) !important;
            box-shadow: 0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
        }
        
        .subtopic-item.active {
            background: linear-gradient(135deg, 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9) 0%, 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7) 100%) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) !important;
            box-shadow: 0 4px 16px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        
        /* Karta informacji o temacie */
        .topic-info-card {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
            box-shadow: 0 4px 16px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15) !important;
        }
        
        .topic-input,
        .topic-textarea {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        
        .topic-input:focus,
        .topic-textarea:focus {
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            box-shadow: 0 0 0 3px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) !important;
        }
    `

	// Dodaj na końcu head - z wyższą specyficznością CSS nadpisze bazowy plik
	document.head.appendChild(style)
}

// Konwertuj hex na RGB
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null
}

// Inicjalizuj color picker
function initAccentColorPicker() {
	const colorPicker = document.getElementById('accentColorPicker')
	const presets = document.querySelectorAll('.accent-preset')
	const settings = loadSettings()

	if (!colorPicker) return

	// Ustaw aktualny kolor
	colorPicker.value = settings.accentColor
	updateActivePreset(settings.accentColor)

	// Obsługa change'u color pickera
	colorPicker.addEventListener('change', e => {
		const color = e.target.value
		settings.accentColor = color
		saveSettings(settings)
		applyAccentColor(color)
		updateActivePreset(color)
		showToast('Kolor obramowania zmieniony! 🎨', 'success', 3000)
	})

	colorPicker.addEventListener('input', e => {
		const color = e.target.value
		applyAccentColor(color)
		updateActivePreset(color)
	})

	// Obsługa preset buttonów
	presets.forEach(preset => {
		preset.addEventListener('click', e => {
			e.preventDefault()
			const color = preset.dataset.color
			colorPicker.value = color
			settings.accentColor = color
			saveSettings(settings)
			applyAccentColor(color)
			updateActivePreset(color)
			showToast('Kolor obramowania zmieniony! 🎨', 'success', 3000)
		})
	})
}

// Zaktualizuj active preset
function updateActivePreset(color) {
	const presets = document.querySelectorAll('.accent-preset')
	presets.forEach(preset => {
		if (preset.dataset.color === color) {
			preset.classList.add('active')
		} else {
			preset.classList.remove('active')
		}
	})
}

// Przełącz dark mode
function toggleDarkMode() {
	const settings = loadSettings()
	settings.darkMode = !settings.darkMode
	saveSettings(settings)

	if (settings.darkMode) {
		document.body.classList.remove('light-mode')
		animateTransition()
	} else {
		document.body.classList.add('light-mode')
		animateTransition()
	}
}

// Przełącz animacje
function toggleAnimations() {
	const settings = loadSettings()
	settings.animations = !settings.animations
	saveSettings(settings)

	if (settings.animations) {
		document.body.classList.remove('no-animations')
	} else {
		document.body.classList.add('no-animations')
	}
}

// Animacja przejścia przy zmianie motywu
function animateTransition() {
	const settings = loadSettings()
	if (!settings.animations) return

	document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease'

	setTimeout(() => {
		document.body.style.transition = ''
	}, 500)
}
// ===== TOAST NOTIFICATION SYSTEM =====
// Inicjalizuj kontener notyfikacji
function initToastContainer() {
	if (!document.getElementById('toast-container')) {
		const container = document.createElement('div')
		container.id = 'toast-container'
		container.className = 'toast-container'
		document.body.appendChild(container)
	}
}

// Pokaż toast notyfikację
function showToast(message, type = 'success', duration = 4000) {
	initToastContainer()

	const container = document.getElementById('toast-container')
	const toast = document.createElement('div')

	// Mapuj typy na ikony i kolory
	const icons = {
		success: '✓',
		error: '❌',
		warning: '⚠',
		info: 'ℹ',
	}

	const icon = icons[type] || '◆'

	toast.className = `toast ${type}`
	toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">×</button>
        <div class="toast-progress" style="width: 100%;"></div>
    `

	container.appendChild(toast)

	// Obsługa zamykania
	const closeBtn = toast.querySelector('.toast-close')
	const removeToast = () => {
		toast.classList.add('removing')
		setTimeout(() => {
			toast.remove()
		}, 300)
	}

	closeBtn.addEventListener('click', removeToast)

	// Auto-remove po duration
	if (duration > 0) {
		const progressBar = toast.querySelector('.toast-progress')
		progressBar.style.animation = `none`
		progressBar.style.transition = `width ${duration}ms linear`

		// Trigger animation
		setTimeout(() => {
			progressBar.style.width = '0'
		}, 10)

		setTimeout(removeToast, duration)
	}

	return toast
}

// Króćsze wersje dla różnych typów
window.showSuccessToast = (msg, duration = 3000) => showToast(msg, 'success', duration)
window.showErrorToast = (msg, duration = 4000) => showToast(msg, 'error', duration)
window.showWarningToast = (msg, duration = 3500) => showToast(msg, 'warning', duration)
window.showInfoToast = (msg, duration = 3000) => showToast(msg, 'info', duration)
window.showToast = showToast
// Eksportuj funkcje dla użycia w innych plikach
window.emsSettings = {
	load: loadSettings,
	save: saveSettings,
	toggleDarkMode,
	toggleAnimations,
	loadAndApply: loadAndApplySettings,
}
