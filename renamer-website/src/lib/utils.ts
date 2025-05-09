import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


/**
 * Type pour les plateformes supportées
 */
type SupportedPlatform = 'mac os universal' | 'windows amd64' | 'windows arm64' | 'linux amd64';

/**
 * Détecte le système d'exploitation et l'architecture CPU pour télécharger la bonne version d'un logiciel
 * @returns {SupportedPlatform} La plateforme détectée
 */
function detectSystemForDownload(): SupportedPlatform {
	// Détection si on est dans un environnement Node.js ou navigateur
	const isNode = typeof window === 'undefined' && typeof process !== 'undefined';

	let os: string | null = null;
	let arch: string | null = null;

	// Détection dans un environnement Node.js
	if (isNode) {
		try {
			const nodeOs = require('os');

			// Détection du système d'exploitation
			const platform = nodeOs.platform();
			if (platform === 'darwin') os = 'mac os';
			else if (platform === 'win32') os = 'windows';
			else if (platform === 'linux') os = 'linux';

			// Détection de l'architecture
			const architecture = nodeOs.arch();
			if (['x64', 's390x', 'ppc64'].includes(architecture)) arch = 'amd64';
			else if (['arm64'].includes(architecture)) arch = 'arm64';
		} catch (error) {
			console.error('Erreur lors de la détection du système:', error);
		}
	}
	// Détection dans un environnement navigateur
	else {
		const userAgent = window.navigator.userAgent;
		const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;

		// Détection du système d'exploitation
		const macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
		const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

		if (macosPlatforms.indexOf(platform) !== -1) {
			os = 'mac os';
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
			os = 'windows';
		} else if (/Linux/.test(platform)) {
			os = 'linux';
		}

		// Détection de l'architecture (moins précis dans un navigateur)
		if (userAgent.indexOf('ARM') !== -1 || userAgent.indexOf('aarch64') !== -1) {
			arch = 'arm64';
		} else {
			// Par défaut, on suppose AMD64 pour la majorité des utilisateurs modernes
			arch = 'amd64';
		}
	}

	// Détermination du type de téléchargement approprié
	if (os === 'mac os') {
		return 'mac os universal';
	} else if (os === 'windows' && arch === 'amd64') {
		return 'windows amd64';
	} else if (os === 'windows' && arch === 'arm64') {
		return 'windows arm64';
	} else if (os === 'linux' && arch === 'amd64') {
		return 'linux amd64';
	} else {
		// Option par défaut si la détection échoue
		return 'windows amd64'; // Option la plus courante
	}
}
