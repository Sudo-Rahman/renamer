import lang from './lang.json';


export const en = {
    lang,
    drag_drop_zone: "Click here to select a directory or drag and drop files",
    data_table: {
        filter: {
            placeholder: "Filter files ..."
        },
        pagination: {
            rows_per_page: "Rows per page",
            of: "of",
            rows_selected: "row(s) selected.",
            page: "Page"
        },
        table_header: {
            status: "Status",
            name: "Name",
            new_name: "New Name",
            size: "Size",
            mode_date: "Modified Date",
        },
        viewOptions: {
            title: "Toggle Columns",
        }
    },
    menu_bar: {
        file: {
            title: "File",
            settings: "Settings",
            import_files: "Import Files",
            import_files_from_dir: "Import from Directory",
        }
    },
    formatter : {
        add_btn : {
            title : "Add Formatter"
        },
        panel : {
            title : "Formatters",
        },
        number : {
            title : "Number",
            input1 : {
                label : "Text",
                info : "Optional text, respect the format : text{%}text"
            },
            input2 : {
                label : "Number",
                info : "First is start number, second is step, third is fill char, fourth is number of fill chars"
            },
        },
        regex : {
            title : "Regex",
            input1 : {
                label : "Regex",
                placeholder: "Insert regex pattern",
            },
            input2 : {
                label : "Replacement",
                placeholder: "Insert replacement pattern",
            },
            switch : "Replace all occurences",
            start_pos : "Start Position",
            end_pos : "End Position",
        },
        remove : {
            title : "Remove Characters",
        },
        file_name : {
            title : "Original Name",
            switch: "With Extension",
        },
        case : {
            title : "Case",
            name_switch: {
                on_file_name: "Apply on File Name",
                on_formatted_name: "Apply On Formatted Name",
            },
            space_switch: {
                space: "Leave Space",
                no_space: "Remove Space",
            },
            lowercase: "lowercase",
            uppercase: "UPPERCASE",
            title_case: "Title Case",
            pascal_case: "PascalCase",
            camel_case: "camelCase",
            snake_case: "snake_case",
            kebab_case: "kebab-case",
        },
        basic_text : {
            title : "Basic Text",
            input1 : {
                label : "Text",
                placeholder: "Insert text",
            },
        },
        extension : {
            title : "Extension",
            switch  : {
                file : "Original extension",
                custom : "Custom extension",
            }
        },
        creation_date : {
            title : "Creation Date",
            input1 : {
                label : "Format",
            },
        }
    }
}