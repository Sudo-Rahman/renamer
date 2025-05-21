import lang from './lang.json';


export const fr = {
    lang,
    drag_drop_zone: "Cliquez ici pour importer un répertoire ou des fichiers ou faites glisser et déposez des fichiers",
    "drag_drop_zone.files": "Fichiers",
    "drag_drop_zone.folder": "Répertoire",
    list_view: {
        filter: {
            placeholder: "Filtrer les fichiers..."
        },
        header: {
            status: "Statut",
            name: "Nom",
            new_name: "Nouveau nom",
            size: "Taille",
            mode_date: "Date de modification",
        },
        view_options: {
            btn: "Colonnes",
            title: "Basculer les colonnes",
        },
        item_context_menu: {
            remove: "enlever",
        }
    },
    menu_bar: {
        file: {
            title: "Fichier",
            settings: "Paramètres",
            import_files: "Importer des fichiers",
            import_files_from_dir: "Importer depuis un répertoire",
        },
        preset: {
            title: "Préréglages",
            save: "Enregistrer",
            save_as: "Enregistrer sous",
            show: "Afficher",
            save_as_dialog: {
                title: "Enregistrer le préréglage",
                input: "Nom",
                placeholder: "Insérer le nom du préréglage",
                save_btn: "Enregistrer",
                cancel_btn: "Annuler",
                warning: "Un minimum de 3 caractères est requis",
            },
            list_dialog: {
                title: "Préréglages",
                load: "Charger",
                delete: "Supprimer",
            }
        }
    },
    formatter: {
        add_btn: "Ajouter une règle",
        panel: {
            title: "Règles",
        },
        number: {
            title: "Nombre",
            text_input: {
                label: "Texte",
                info: "Texte facultatif, respecter le format : texte{%}texte"
            },
            number_input: {
                label: "Nombre",
                info: "Le premier est le nombre de départ, le deuxième est le pas, le troisième est le caractère de remplissage, le quatrième est le nombre de caractères de remplissage"
            },
        },
        regex: {
            title: "Regex",
            regex_input: {
                label: "Regex",
                placeholder: "Insérer le motif regex",
            },
            replace_input: {
                label: "Remplacement",
                placeholder: "Insérer le motif de remplacement",
            },
            switch: "Remplacer toutes les occurrences",
            start_pos: "Position de départ",
            end_pos: "Position de fin",
        },
        remove: {
            title: "Suppression de texte",
            input_placeholder: "Insérer le texte à supprimer",
        },
        file_name: {
            title: "Nom d'origine",
            switch_on: "Avec l'extension",
            switch_off: "Sans l'extension"
        },
        case: {
            title: "Casse",
            name_switch: {
                on_file_name: "Appliquer sur le nom de fichier",
                on_formatted_name: "Appliquer sur le nom formaté",
            },
            space_switch: {
                space: "Laisser les espaces",
                no_space: "Supprimer les espaces",
            },
            lowercase: "minuscules",
            uppercase: "MAJUSCULES",
            title_case: "Titre",
            pascal_case: "PascalCase",
            camel_case: "camelCase",
            snake_case: "snake_case",
            kebab_case: "kebab-case",
        },
        basic_text: {
            title: "Texte",
            input1: {
                label: "Texte",
                placeholder: "Insérer le texte",
            },
        },
        extension: {
            title: "Extension",
            switch: {
                file: "Extension d'origine",
                custom: "Extension personnalisée",
            },
            input: {
                label: "Extension",
                placeholder: "Insérer l'extension",
            }
        },
        creation_date: {
            title: "Date de création",
            input1: {
                label: "Format",
            },
        },
        size: {
            title: "Taille",
            unit: {
                Byte: "Octet",
                KB: "Ko",
                MB: "Mo",
                GB: "Go",
            },
            unit_label: "Unité",
            text_input: {
                label: "Texte",
                placeholder: "Texte ajouté après la taille",
            },
            digits_of_precision_label: "Chiffres après la virgule",
        },
    },
    settings: {
        title: "Paramètres",
        general: {
            title: "Général",
            language: {
                title: "Langue",
            },
            theme: {
                title: "Thème",
                light: "Clair",
                dark: "Sombre",
                system: "Système",
            },
        },
        license: {
            title: "Licence",
            key: {
                label: "Clé de licence",
                activate_btn: "Activer",
            },
            valid: {
                message: "Licence active",
                desactivate_btn: "Désactiver sur cet ordinateur",
            },
            manage_machines: "Pour gérer et désactiver votre licence sur d'autres appareils, ",
            manage_machines_link: "cliquer ici",
        },
        about: {
            title: "À propos",
            update: {
                label: "Mise à jour",
                available: "Nouvelle version trouvée {version}",
                not_available: "Vous avez la dernière version",
                btn: "Télécharger et installer",
                check: "Vérifier les mises à jour au démarrage",
            },
            others: {
                label: "Autres informations",
                website: "Site web",
            }
        }
    },
    toast: {
        save_as_preset: {
            success: "Préréglage %s enregistré avec succès",
            error: "Erreur lors de l'enregistrement du préréglage %s",
            error_license_free: "Vous devez disposer d'une licence pour enregistrer des préréglages",
        },
        load_preset: {
            success: "Préréglage %s chargé avec succès",
            error: "Erreur lors du chargement du préréglage %s",
        },
        delete_preset: {
            success: "Préréglage %s supprimé avec succès",
            error: "Erreur lors de la suppression du préréglage %s",
        },
        rename_files: {
            success: "Fichiers renommés avec succès",
            error: "Erreur lors du renommage des fichiers",
        },
        import_files: {
            success: "Fichiers importés avec succès",
            error: "Erreur lors de l'importation des fichiers",
        },
        desactivate_license: {
            success: "Licence désactivée avec succès",
            error: "Erreur lors de la désactivation de la licence",
        }
    },
    file_status: {
        error: {
            0: "Fichié renommé avec succès",
            1: "Le nom du fichier existe déjà dans le répertoire.",
            2: "Le fichier n'existe pas.",
        }
    },
    ask_dialog: {
        delete_preset: {
            title: "Supprimer le préréglage",
            message: "Êtes-vous sûr de vouloir supprimer le préréglage %s ?",
            ok_btn: "Oui",
            cancel_btn: "Non",
        }
    },
    message: {
        no_license: {
            title: "Licence non trouvée",
            message: "Veuillez activer votre licence pour utiliser l'application."
        },
        activate_license: {
            error: "Erreur lors de l'activation de la licence",
            no_valid_or_used: "La clé de licence n'est pas valide ou est déjà utilisée sur un autre appareil",
        },
        check_license: {
            error: "Erreur lors de la vérification de la licence",
        }
    },
    updater: {
        progress: 'Mise à jour en cours',
        finished: 'Mise à jour terminée',
        relaunch: "Relancer l'application",
        not_close: "Ne pas fermer l'application",
    },
    bottom_info: {
        files_infos: "{0} fichier(s) sélectionné(s) - {1} erreur(s)",
    },
    terms: {
        title: "Conditions d'Utilisation - Renamer",
        subtitle: "Veuillez lire attentivement les conditions suivantes avant d'utiliser le logiciel",
        last_update: "Dernière mise à jour : {date}",
        accept_label: "J'ai lu et j'accepte les conditions d'utilisation",
        accept_btn: "Accepter et Continuer",
        sections: [
            {
                "id": "section1",
                "title": "1. Introduction et Définitions",
                "content": [
                    "Le présent Contrat de Licence Utilisateur Final (« CLUF ») constitue un accord légal entre vous (« l'Utilisateur ») et Rahman YILMAZ, dont le siège social est situé en France (« le Concédant ») concernant l'utilisation du logiciel Renamer (« le Logiciel »).",
                    "En installant, en accédant ou en utilisant le Logiciel, vous acceptez d'être lié par les termes de ce CLUF. Si vous n'acceptez pas ces termes, vous ne devez pas installer, accéder ou utiliser le Logiciel."
                ]
            },
            {
                "id": "section2",
                "title": "2. Octroi de Licence",
                "content": [
                    "Sous réserve du paiement des frais de licence applicables et du respect des termes de ce CLUF, le Concédant vous accorde une licence non exclusive, non transférable et révocable pour utiliser le Logiciel conformément à la documentation associée.",
                    "Cette licence permet d'installer et d'utiliser le Logiciel sur un nombre d'appareils conforme au type de licence achetée :",
                    "<ul>",
                    "<li>Licence Professionnelle : installation sur jusqu'à un (1) appareil au sein d'une même organisation</li>",
                    "<li>Licence Team : installation sur jusqu'à cinq (5) appareils au sein d'une même organisation</li>",
                    "</ul>",
                ]
            },
            {
                "id": "section3",
                "title": "3. Droits de Propriété Intellectuelle",
                "content": [
                    "Le Logiciel est protégé par les lois sur le droit d'auteur et autres lois et traités sur la propriété intellectuelle. Le Concédant détient tous les droits, titres et intérêts relatifs au Logiciel, y compris tous les droits d'auteur, brevets, secrets commerciaux, marques commerciales et autres droits de propriété intellectuelle.",
                    "Vous reconnaissez que la licence accordée ne vous confère aucun titre ou droit de propriété sur le Logiciel et ne constitue pas une vente de droits sur le Logiciel."
                ]
            },
            {
                "id": "section4",
                "title": "4. Restrictions",
                "content": [
                    "Vous vous engagez à ne pas :",
                    "<ul>",
                    "<li>Copier, modifier, adapter ou traduire le Logiciel</li>",
                    "<li>Décompiler, désassembler ou tenter de découvrir le code source du Logiciel</li>",
                    "<li>Créer des œuvres dérivées basées sur le Logiciel</li>",
                    "<li>Louer, prêter, vendre, distribuer ou sous-licencier le Logiciel</li>",
                    "<li>Supprimer ou modifier toute mention de droit d'auteur ou de propriété du Logiciel</li>",
                    "<li>Utiliser le Logiciel à des fins illégales ou non autorisées</li>",
                    "<li>Contourner les mesures techniques de protection intégrées au Logiciel</li>",
                    "</ul>"
                ]
            },
            {
                "id": "section5",
                "title": "5. Mises à Jour et Support",
                "content": [
                    "Le Concédant peut, à sa discrétion, fournir des mises à jour, des améliorations ou de nouvelles versions du Logiciel. Les termes de ce CLUF s'appliqueront à ces mises à jour, sauf si elles sont accompagnées de conditions distinctes.",
                    "Le support technique est fourni selon les modalités définies dans le type de licence acheté et pour la durée spécifiée lors de l'achat."
                ]
            },
            {
                "id": "section6",
                "title": "6. Collecte et Protection des Données",
                "content": [
                    "Le Logiciel peut collecter certaines données d'utilisation pour améliorer les performances, diagnostiquer des problèmes ou fournir des mises à jour. Ces données incluent des informations sur votre système d'exploitation, la configuration matérielle, et les fonctionnalités utilisées au sein du Logiciel.",
                    "Ces données sont collectées de manière anonyme et traitées conformément à notre Politique de Confidentialité disponible sur notre site web. Toutes les données collectées sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et aux autres lois applicables sur la protection des données.",
                    "Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en contactant le Concédant à l'adresse email indiquée sur le site web."
                ]
            },
            {
                "id": "section7",
                "title": "7. Résiliation",
                "content": [
                    "Cette licence est valable jusqu'à sa résiliation. Vous pouvez la résilier à tout moment en désinstallant le Logiciel et en détruisant toutes ses copies.",
                    "Le Concédant peut résilier cette licence immédiatement si vous ne respectez pas l'une des conditions du présent CLUF. Dans ce cas, vous devez cesser toute utilisation du Logiciel et détruire toutes ses copies."
                ]
            },
            {
                "id": "section8",
                "title": "8. Exclusion de Garantie",
                "content": [
                    "DANS LA MESURE PERMISE PAR LA LOI APPLICABLE, LE LOGICIEL EST FOURNI « TEL QUEL » SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU IMPLICITE, Y COMPRIS, MAIS SANS S'Y LIMITER, LES GARANTIES DE QUALITÉ MARCHANDE, D'ADÉQUATION À UN USAGE PARTICULIER ET DE NON-VIOLATION.",
                    "LE CONCÉDANT NE GARANTIT PAS QUE LE LOGICIEL RÉPONDRA À VOS EXIGENCES OU QUE SON FONCTIONNEMENT SERA ININTERROMPU OU EXEMPT D'ERREURS.",
                    "Cette exclusion de garantie ne s'applique pas dans les juridictions où de telles exclusions sont limitées par la loi. Dans ces cas, les garanties minimales requises par la loi applicable restent en vigueur."
                ]
            },
            {
                "id": "section9",
                "title": "9. Limitation de Responsabilité",
                "content": [
                    "DANS LA MESURE PERMISE PAR LA LOI APPLICABLE, EN AUCUN CAS LE CONCÉDANT NE SERA RESPONSABLE DE DOMMAGES PARTICULIERS, ACCESSOIRES, INDIRECTS OU CONSÉCUTIFS, Y COMPRIS, MAIS SANS S'Y LIMITER, LES PERTES DE BÉNÉFICES, DE DONNÉES OU D'UTILISATION, DÉCOULANT DE L'UTILISATION OU DE L'IMPOSSIBILITÉ D'UTILISER LE LOGICIEL.",
                    "LA RESPONSABILITÉ TOTALE DU CONCÉDANT POUR TOUTE RÉCLAMATION EN VERTU DE CE CLUF NE DÉPASSERA PAS LE MONTANT QUE VOUS AVEZ PAYÉ POUR LE LOGICIEL.",
                    "Certaines juridictions n'autorisent pas l'exclusion ou la limitation de responsabilité pour certains types de dommages. Dans ces juridictions, les limitations ci-dessus pourraient ne pas s'appliquer à vous."
                ]
            },
            {
                "id": "section10",
                "title": "10. Droit Applicable et Juridiction",
                "content": [
                    "Ce CLUF est régi par les lois de la France, sans égard aux principes de conflit de lois. Tout litige découlant de ce CLUF sera soumis à la compétence exclusive des tribunaux de Chalon-sur-Saône, France.",
                    "Si vous êtes un consommateur résidant dans l'Union européenne, vous bénéficiez également de la protection des dispositions obligatoires de la loi de votre pays de résidence."
                ]
            },
            {
                "id": "section11",
                "title": "11. Conformité aux Réglementations Internationales",
                "content": [
                    "Contrôle des exportations : Vous acceptez de vous conformer à toutes les lois et réglementations internationales et nationales applicables, y compris les restrictions d'exportation et de réexportation applicables au Logiciel. Ces lois peuvent inclure des restrictions concernant les destinations, les utilisateurs finaux et l'utilisation finale.",
                    "Fiscalité internationale : Si vous utilisez le Logiciel en dehors de la France, vous êtes responsable du respect de toutes les lois fiscales applicables dans votre juridiction. Le Concédant se conforme aux réglementations fiscales françaises et européennes pour toutes les ventes de licences.",
                    "Protection des données : Le Logiciel est conçu pour respecter les principales réglementations internationales en matière de protection des données, y compris le RGPD dans l'Union européenne, le CCPA en Californie et d'autres réglementations similaires dans d'autres juridictions."
                ]
            },
            {
                "id": "section12",
                "title": "12. Dispositions Générales",
                "content": [
                    "Divisibilité : Si une disposition de ce CLUF est jugée inapplicable ou invalide, cette disposition sera limitée ou éliminée dans la mesure minimale nécessaire, et les autres dispositions de ce CLUF resteront pleinement en vigueur.",
                    "Intégralité de l'accord : Ce CLUF constitue l'intégralité de l'accord entre vous et le Concédant concernant l'utilisation du Logiciel et remplace toutes les communications, propositions et représentations antérieures ou contemporaines, qu'elles soient électroniques, orales ou écrites, entre vous et le Concédant concernant le Logiciel.",
                    "Modifications : Le Concédant se réserve le droit de modifier les termes de ce CLUF à tout moment. Les modifications prendront effet dès leur publication. L'utilisation continue du Logiciel après la publication des modifications constitue votre acceptation de ces modifications.",
                    "Contact : Pour toute question concernant ce CLUF, veuillez contacter le Concédant à l'adresse email fournie sur le site web."
                ]
            }
        ]
    }
}