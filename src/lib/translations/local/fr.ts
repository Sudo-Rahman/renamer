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
        viewOptions: {
            title: "Basculer les colonnes",
        }
    },
    menu_bar: {
        file: {
            title: "Fichier",
            settings: "Paramètres",
            import_files: "Importer des fichiers",
            import_files_from_dir: "Importer depuis un répertoire",
        }
    },
    formatter : {
        add_btn : {
            title : "Ajouter un formateur"
        },
        panel : {
            title : "Formateurs",
        },
        number : {
            title : "Numéro",
            input1 : {
                label : "Texte",
                info : "Texte facultatif, respecter le format : texte{%}texte"
            },
            input2 : {
                label : "Numéro",
                info : "Le premier est le numéro de départ, le deuxième est le pas, le troisième est le caractère de remplissage, le quatrième est le nombre de caractères de remplissage"
            },
        },
        regex : {
            title : "Regex",
            input1 : {
                label : "Regex",
                placeholder: "Insérer le motif regex",
            },
            input2 : {
                label : "Remplacement",
                placeholder: "Insérer le motif de remplacement",
            },
            switch : "Remplacer toutes les occurrences",
            start_pos : "Position de départ",
            end_pos : "Position de fin",
        },
        remove : {
            title : "Supprimer les caractères",
        },
        file_name : {
            title : "Nom d'origine",
            switch: "Avec l'extension",
        },
        case : {
            title : "Casse",
            name_switch: {
                on_file_name: "Appliquer sur le nom de fichier",
                on_formatted_name: "Appliquer sur le nom formaté",
            },
            space_switch: {
                space: "Laisser l'espace",
                no_space: "Supprimer l'espace",
            },
            lowercase: "minuscules",
            uppercase: "MAJUSCULES",
            title_case: "Majuscule au Début",
            pascal_case: "PascalCase",
            camel_case: "camelCase",
            snake_case: "snake_case",
            kebab_case: "kebab-case",
        },
        basic_text : {
            title : "Texte de base",
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
            }
        },
        creation_date : {
            title : "Date de création",
            input1 : {
                label : "Format",
            },
        }
    }
}