import lang from './lang.json';


export const fr = {
    lang,
    drag_drop_zone: "Cliquez ici pour sélectionner un répertoire ou faites glisser et déposez des fichiers",
    data_table: {
        filter: {
            placeholder: "Filtrer les fichiers..."
        },
        pagination: {
            rows_per_page: "Lignes par page",
            of: "sur",
            rows_selected: "ligne(s) sélectionnée(s).",
            page: "Page"
        },
        table_header: {
            status: "Statut",
            name: "Nom",
            new_name: "Nouveau nom",
            size: "Taille",
            mode_date: "Date de modification",
        },
        view_options: {
            btn : "Colonnes",
            title: "Basculer les colonnes",
        }
    },
    menu_bar: {
        file: {
            title: "Fichier",
            settings: "Paramètres",
            import_files: "Importer des fichiers",
            import_files_from_dir: "Importer depuis un répertoire",
        },
        preset : {
            title : "Préréglages",
            save : "Enregistrer",
            save_as : "Enregistrer sous",
            show : "Afficher",
            save_as_dialog : {
                title : "Enregistrer le préréglage",
                input : "Nom",
                placeholder : "Insérer le nom du préréglage",
                save_btn : "Enregistrer",
                cancel_btn : "Annuler",
            },
            list_dialog : {
                title : "Préréglages",
                load : "Charger",
                delete : "Supprimer",
            }
        }
    },
    formatter : {
        add_btn : "Ajouter un formateur",
        panel : {
            title : "Formateurs",
        },
        number : {
            title : "Nombre",
            text_input : {
                label : "Texte",
                info : "Texte facultatif, respecter le format : texte{%}texte"
            },
            number_input : {
                label : "Nombre",
                info : "Le premier est le nombre de départ, le deuxième est le pas, le troisième est le caractère de remplissage, le quatrième est le nombre de caractères de remplissage"
            },
        },
        regex : {
            title : "Regex",
            regex_input : {
                label : "Regex",
                placeholder: "Insérer le motif regex",
            },
            replace_input : {
                label : "Remplacement",
                placeholder: "Insérer le motif de remplacement",
            },
            switch : "Remplacer toutes les occurrences",
            start_pos : "Position de départ",
            end_pos : "Position de fin",
        },
        remove : {
            title : "Suppression de texte",
            input_placeholder : "Insérer le texte à supprimer",
        },
        file_name : {
            title : "Nom d'origine",
            switch_on: "Avec l'extension",
            switch_off: "Sans l'extension"
        },
        case : {
            title : "Casse",
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
        basic_text : {
            title : "Texte",
            input1 : {
                label : "Texte",
                placeholder: "Insérer le texte",
            },
        },
        extension : {
            title : "Extension",
            switch  : {
                file : "Extension d'origine",
                custom : "Extension personnalisée",
            },
            input : {
                label : "Extension",
                placeholder: "Insérer l'extension",
            }
        },
        creation_date : {
            title : "Date de création",
            input1 : {
                label : "Format",
            },
        }
    },
    settings : {
        title : "Paramètres",
        select_language : {
            title : "Langue",
        },
        save_btn : "Enregistrer",
    },
    toast : {
        save_as_preset : {
            success : "Préréglage %s enregistré avec succès",
            error : "Erreur lors de l'enregistrement du préréglage %s",
        },
        load_preset : {
            success : "Préréglage %s chargé avec succès",
            error : "Erreur lors du chargement du préréglage %s",
        },
        delete_preset : {
            success : "Préréglage %s supprimé avec succès",
            error : "Erreur lors de la suppression du préréglage %s",
        },
        rename_files : {
            success : "Fichiers renommés avec succès",
            error : "Erreur lors du renommage des fichiers",
        },
        import_files : {
            success : "Fichiers importés avec succès",
            error : "Erreur lors de l'importation des fichiers",
        }
    },
    file_status: {
        error: {
            0 : "",
            1: "Le nom du fichier existe déjà dans le répertoire.",
            2: "Le fichier n'existe pas.",
        }
    },
    ask_dialog : {
        delete_preset : {
            title : "Supprimer le préréglage",
            message : "Êtes-vous sûr de vouloir supprimer le préréglage %s ?",
            ok_btn : "Oui",
            cancel_btn : "Non",
        }
    },
    updater : {
        title : 'Mise à jour disponible',
        yes_btn: 'Mettre à jour',
        cancel_btn: 'Annuler',
        message : 'Une mise à jour est disponible pour la version %s. Voulez-vous mettre à jour ?'
    }
}