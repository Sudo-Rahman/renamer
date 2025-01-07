import lang from './lang.json';


export const fr = {
    lang,
    drag_drop_zone: "Cliquez ici pour sélectionner un répertoire ou faites glisser et déposez des fichiers",
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
        add_btn: "Ajouter un formateur",
        panel: {
            title: "Formateurs",
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
            select_language: {
                title: "Langue",
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
            }
        },
        about: {
            title: "À propos",
            update: {
                label: "Mise à jour",
                available: "Nouvelle version trouvée %s",
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
            max_licence: "Le nombre de fichiers pouvant être importés est de 5 pour la version gratuite",
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
        title: 'Mise à jour disponible',
        yes_btn: 'Mettre à jour',
        cancel_btn: 'Annuler',
        message: 'Une mise à jour est disponible pour la version %s. Voulez-vous mettre à jour ?'
    },
    bottom_info: {
        files_infos: "{0} fichier(s) sélectionné(s) - {1} erreur(s)",
    }
}