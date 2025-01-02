import lang from './lang.json';


export const en = {
    lang,
    drag_drop_zone: "Click here to select a directory or drag and drop files",
    list_view: {
        filter: {
            placeholder: "Filter files ..."
        },
        header: {
            status: "Status",
            name: "Name",
            new_name: "New Name",
            size: "Size",
            mode_date: "Modified Date",
        },
        view_options: {
            btn: "Columns",
            title: "Switch Columns",
        },
        item_context_menu: {
            remove: "Remove",
        }
    },
    menu_bar: {
        file: {
            title: "File",
            settings: "Settings",
            import_files: "Import Files",
            import_files_from_dir: "Import from Directory",
        },
        preset: {
            title: "Presets",
            save: "Save",
            save_as: "Save As",
            show: "Show",
            save_as_dialog: {
                title: "Save Preset",
                input: "Name",
                placeholder: "Insert preset name",
                save_btn: "Save",
                cancel_btn: "Cancel",
                warning: "Minimum 3 characters required",
            },
            list_dialog: {
                title: "Presets",
                load: "Load",
                delete: "Delete",
            }
        }
    },
    formatter: {
        add_btn: "Add Formatter",
        panel: {
            title: "Formatters",
        },
        number: {
            title: "Number",
            text_input: {
                label: "Text",
                info: "Optional text, respect the format : text{%}text"
            },
            number_input: {
                label: "Number",
                info: "First is start number, second is step, third is fill char, fourth is number of fill chars"
            },
        },
        regex: {
            title: "Regex",
            regex_input: {
                label: "Regex",
                placeholder: "Insert regex pattern",
            },
            replace_input: {
                label: "Replacement",
                placeholder: "Insert replacement pattern",
            },
            switch: "Replace all occurences",
            start_pos: "Start Position",
            end_pos: "End Position",
        },
        remove: {
            title: "Remove text",
            input_placeholder: "Insert text to remove",
        },
        file_name: {
            title: "Original Name",
            switch_on: "With Extension",
            switch_off: "Without Extension"
        },
        case: {
            title: "Case",
            name_switch: {
                on_file_name: "Apply on File Name",
                on_formatted_name: "Apply On Formatted Name",
            },
            space_switch: {
                space: "Leave Spaces",
                no_space: "Remove Spaces",
            },
            lowercase: "lowercase",
            uppercase: "UPPERCASE",
            title_case: "Title Case",
            pascal_case: "PascalCase",
            camel_case: "camelCase",
            snake_case: "snake_case",
            kebab_case: "kebab-case",
        },
        basic_text: {
            title: "Basic Text",
            input1: {
                label: "Text",
                placeholder: "Insert text",
            },
        },
        extension: {
            title: "Extension",
            switch: {
                file: "Original extension",
                custom: "Custom extension",
            },
            input: {
                label: "Extension",
                placeholder: "Insert extension",
            }
        },
        creation_date: {
            title: "Creation Date",
            input1: {
                label: "Format",
            },
        },
        size: {
            title: "Size",
            unit: {
                Byte: "Byte",
                KB: "KB",
                MB: "MB",
                GB: "GB",
            },
            unit_label: "Unit",
            text_input: {
                label: "Text",
                placeholder: "Text after the size",
            },
            digits_of_precision_label: "Digits after the decimal",
        },
    },
    settings: {
        title: "Settings",
        general: {
            title: "General",
            select_language: {
                title: "Language",
            },
        },
        license: {
            title: "License",
            key: {
                label: "License Key",
                activate_btn: "Activate",
            },
            valid: {
                message: "Active License",
                desactivate_btn: "Deactivate on this computer",
            }
        },
        about: {
            title: "About",
            update: {
                label: "Software Update",
                available: "Found a new version %s",
                not_available: "You have the latest version",
                btn: "Download and install",
                check: "Check for updates at startup",
            },
            others: {
                label: "Other informations",
                website: "Website",
            }
        }
    },
    toast: {
        save_as_preset: {
            success: "Preset %s saved successfully",
            error: "Error saving preset %s",
        },
        load_preset: {
            success: "Preset %s loaded successfully",
            error: "Error loading preset %s",
        },
        delete_preset: {
            success: "Preset %s deleted successfully",
            error: "Error deleting preset %s",
        },
        rename_files: {
            success: "Files renamed successfully",
            error: "Error renaming files",
        },
        import_files: {
            success: "Files imported successfully",
            error: "Error importing files",
        },
        desactivate_license: {
            success: "License desactivated successfully",
            error: "Error desactivating license",
        }
    },
    file_status: {
        error: {
            0: "File renamed successfully",
            1: "The file name already exists in the directory.",
            2: "The file does not exist.",
        }
    },
    ask_dialog: {
        delete_preset: {
            title: "Delete Preset",
            message: "Are you sure you want to delete the preset %s ?",
            ok_btn: "Yes",
            cancel_btn: "No",
        }
    },
    message: {
        no_license: {
            title: "No License",
            message: "Please activate your license to use the application."
        },
        activate_license: {
            error: "Error activating license",
            no_valid_or_used: "The license key is not valid or has already been used",
        },
        check_license: {
            error: "Error checking license",
        }
    },
    updater: {
        title: "Update Available",
        yes_btn: 'Update',
        cancel_btn: 'Cancel',
        message: "A new version of the application is available. Do you want to update to version %s ?"
    },
    bottom_info: {
        files_infos: "{0} file(s) selected - {1} error(s)",
    }
}