import lang from './lang.json';


export const fr = {
    lang,
    nav : {
        download : "Télécharger",
        docs : "Documentation",
        theme : {
            light : "Clair",
            dark : "Sombre",
            system : "Système"
        }
    },
    footer : {
        privacy : "Politique de confidentialité",
        legal : "Mentions légales",
        licences : "Licences et Outils Utilisés",
        all : "Tous droits réservés."
    },
    home : {
        title : [
            "Renommez",
            "des centaines",
            "de fichiers",
            "en un clic."
        ],
        subtitle : "Gagnez du temps avec notre outil puissant de renommage par lots"
    },
    remove : {
        title : "Supprimer un appareil",
        description : "Entrez votre adresse e-mail et votre clé de licence, puis cliquez sur le bouton pour supprimer un appareil de votre licence.",
        input : {
            email : {
                label : "Email",
                placeholder : "Entrez votre adresse e-mail"
            },
            key : {
                label : "Clé de licence",
            }
        },
        find_btn : "Chercher des appareils",
        remove_btn : "Supprimer l'appareil",
        error : {
            message : "Une erreur est survenue lors de la suppression de l'appareil.",
        },
        success : {
            title: "Appareil supprimé",
            message : "{{device}} a été supprimé de votre licence.",
        }
    },
    pricing : {
        title : "Tarification",
        plan : {
            0 : {
                title : "Essai",
                price : "Gratuit",
                description : "Idéal pour les utilisateurs qui souhaitent essayer l'application avant de s'engager.",
                features: [
                    "Importation limitée à 5 fichiers",
                ],
                btnText: "Télécharger"
            },
            1 : {
                title: "Pro",
                description: "Accédez à toutes les fonctionnalités avancées pour gérer efficacement vos renommages de fichiers en masse.",
                features: [
                    "Importation illimitée de fichiers",
                    "Utilisation sur 1 appareil",
                    "Mises à jour à vie",
                    "Sauvegarde de préréglages",
                ],
                btnText: "Acheter Pro"
            },
            2 : {
                title: "Team",
                description: "Accédez à toutes les fonctionnalités avancées pour gérer efficacement vos renommages de fichiers en masse sur <span class='text-card-foreground font-semibold'>plusieurs appareils.</span>",
                features: [
                    "Importation illimitée de fichiers",
                    "Utilisation sur 5 appareils",
                    "Mises à jour à vie",
                    "Sauvegarde de préréglages",
                ],
                btnText: "Acheter Team"
            }
        },
    },
    download : {
        title : "Télécharger Renamer",
        description : "Sélectionnez l'architecture de votre appareil avant de télécharger l'installateur de Renamer.",
        btn : "Télécharger"
    },
    licenses : {
        title : "Licences et outils utilisés",
        subtitle : "Découvrez les technologies qui ont permis de développer ce site.",
        sveltekit : "Framework moderne pour le développement d'applications web. Licence MIT.",
        shadcn : "Bibliothèque de composants UI pour Svelte. Licence MIT.",
        tailwindcss : "Cadre CSS utilitaire pour la création d'interfaces utilisateur. Licence MIT.",
        lucide : "Bibliothèque d'icônes SVG pour Svelte. Licence MIT.",
        nodejs : "Environnement d'exécution JavaScript côté serveur. Licence MIT.",
        tauri : "Framework pour créer des applications de bureau avec Rust. Licence MIT.",
        icon : {
            label : "Attribution de l'icône",
            author : "L'icône utilisée sur ce site, ainsi que sur le logiciel Renamer provient de",
        },
        last_update : "Dernière mise à jour le {date}",
    },
    legal: {
        title: "Mentions légales",
        subtitle: "Mentions légales et informations sur l'éditeur du site.",
        last_update: "Dernière mise à jour le {date}",
        content: [
            {
                title: "1. Présentation du Site",
                text: "Ce site est édité par <strong>Rahman Yilmaz</strong>, société immatriculée au Registre du Commerce et des Sociétés sous le numéro <strong>[Numéro RCS]</strong>. Le siège social est situé au <strong>[Adresse complète]</strong>."
            },
            {
                title: "2. Directeur de la publication",
                text: "Le directeur de la publication est <strong>Rahman Yilmaz</strong>, en qualité de <strong>[Fonction]</strong>."
            },
            {
                title: "3. Hébergement",
                text: "Le site est hébergé par <strong><a href=\"https://pulseheberg.com/\">Pulseheberg</a></strong>, dont le siège social est situé au <strong>9, Boulevard de Strasbourg 83000 Toulon</strong>. Pour toute question technique, vous pouvez contacter l'hébergeur au <strong><a href=\"tel: +33 (0) 4 22 14 13 60\">+33 (0) 4 22 14 13 60</a></strong>."
            },
            {
                title: "4. Propriété Intellectuelle",
                text: "L'ensemble des éléments présents sur ce site (textes, images, graphismes, logos, icônes, etc.) est la propriété exclusive de <strong>[Nom de l'entreprise]</strong> ou de ses partenaires. Toute reproduction, totale ou partielle, sans autorisation préalable, est strictement interdite."
            },
            {
                title: "5. Conditions d'Utilisation",
                text: "L'accès et l'utilisation du site impliquent l'acceptation pleine et entière des conditions générales d'utilisation. Nous nous réservons le droit de modifier ces mentions légales à tout moment."
            },
            {
                title: "6. Contact",
                text: "Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse suivante : contact@renamer.pro."
            }
        ]
    },
    privacy: {
        title: "Politique de Confidentialité",
        subtitle: "Notre engagement : sécurité, transparence et respect de votre vie privée.",
        last_update: "Dernière mise à jour le {date}",
        content: [
            {
                title: "1. Collecte de Données",
                text: "Nous collectons uniquement votre adresse e-mail ainsi que les informations strictement nécessaires au bon fonctionnement de notre logiciel. Ces données sont recueillies lors du paiement via Stripe Checkout."
            },
            {
                title: "2. Utilisation des Données",
                text: "Les informations collectées servent à : <ul class=\"list-disc ml-6 mt-2\"><li>Valider et sécuriser votre transaction via Stripe.</li><li>Vous envoyer par e-mail votre clé de licence pour le logiciel \"Renamer\".</li><li>Assurer le bon fonctionnement et la maintenance de nos services.</li></ul>"
            },
            {
                title: "3. Paiement Sécurisé",
                text: "Pour vos paiements, nous utilisons <strong>Stripe Checkout</strong>, une solution de paiement certifiée conforme aux normes PCI-DSS, garantissant ainsi la sécurité de vos données financières."
            },
            {
                title: "4. Conformité et Sécurité",
                text: "Notre entreprise, située en France, respecte l'ensemble des réglementations en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD) et les recommandations de la CNIL."
            },
            {
                title: "5. Vos Droits",
                text: "Conformément à la réglementation, vous disposez des droits suivants concernant vos données personnelles : <ul class=\"list-disc ml-6 mt-2\"><li>Droit d'accès</li><li>Droit de rectification</li><li>Droit à l'effacement</li><li>Droit d'opposition</li></ul> Pour exercer ces droits, veuillez nous contacter via l'adresse e-mail figurant dans nos mentions légales."
            },
            {
                title: "6. Modifications de la Politique",
                text: "Nous nous réservons le droit de mettre à jour cette politique de confidentialité. Toute modification sera immédiatement publiée sur cette page."
            }
        ]
    }
}