import lang from './lang.json';


export const en = {
    lang,
    drag_drop_zone: "Click here to import a directory or files or drag and drop files",
    "drag_drop_zone.files": "Files",
    "drag_drop_zone.folder": "Folder",
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
        add_btn: "Add Rules",
        panel: {
            title: "Rules",
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
            theme: {
                title: "Theme",
                light: "Light",
                dark: "Dark",
                system: "System",
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
            },
            manage_machines: "To manage and deactivate your license on other devices, ",
            manage_machines_link: "click here",
        },
        about: {
            title: "About",
            update: {
                label: "Software Update",
                available: "Found a new version {version}",
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
            error_license_free: "You need a license to save presets",
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
        progress: 'Updating',
        finished: 'Update finished',
        relaunch: "Relaunch the application",
        not_close: "Do not close the application",
    },
    bottom_info: {
        files_infos: "{0} file(s) selected - {1} error(s)",
    },
    terms: {
        title: "Terms of Use - Renamer",
        subtitle: "Please read the following terms carefully before using the software",
        last_update: "Last update : {date}",
        accept_label: "I have read and accept the terms of use",
        accept_btn: "Accept",
        sections: [
            {
                "id": "section1",
                "title": "1. Introduction and Definitions",
                "content": [
                    "This End-User License Agreement (\"EULA\") is a legal agreement between you (\"User\") and Rahman YILMAZ, with headquarters located in France (\"Licensor\") regarding the use of the Renamer software (\"Software\").",
                    "By installing, accessing, or using the Software, you agree to be bound by the terms of this EULA. If you do not accept these terms, you must not install, access, or use the Software."
                ]
            },
            {
                "id": "section2",
                "title": "2. License Grant",
                "content": [
                    "Subject to payment of applicable license fees and compliance with the terms of this EULA, the Licensor grants you a non-exclusive, non-transferable, revocable license to use the Software in accordance with the associated documentation.",
                    "This license allows installation and use of the Software on a number of devices consistent with the type of license purchased:",
                    "<ul>",
                    "<li>Professional License: installation on up to one (1) device within a single organization</li>",
                    "<li>Team License: installation on up to five (5) devices within a single organization</li>",
                    "</ul>",
                ]
            },
            {
                "id": "section3",
                "title": "3. Intellectual Property Rights",
                "content": [
                    "The Software is protected by copyright laws and other intellectual property laws and treaties. The Licensor owns all rights, title, and interest in the Software, including all copyrights, patents, trade secrets, trademarks, and other intellectual property rights.",
                    "You acknowledge that the license granted does not give you any title or ownership rights to the Software and does not constitute a sale of rights to the Software."
                ]
            },
            {
                "id": "section4",
                "title": "4. Restrictions",
                "content": [
                    "You agree not to:",
                    "<ul>",
                    "<li>Copy, modify, adapt, or translate the Software</li>",
                    "<li>Decompile, disassemble, or attempt to discover the source code of the Software</li>",
                    "<li>Create derivative works based on the Software</li>",
                    "<li>Rent, lend, sell, distribute, or sublicense the Software</li>",
                    "<li>Remove or modify any copyright or proprietary notices from the Software</li>",
                    "<li>Use the Software for illegal or unauthorized purposes</li>",
                    "<li>Circumvent any technical protection measures embedded in the Software</li>",
                    "</ul>",
                ]
            },
            {
                "id": "section5",
                "title": "5. Updates and Support",
                "content": [
                    "The Licensor may, at its discretion, provide updates, improvements, or new versions of the Software. The terms of this EULA will apply to such updates unless they are accompanied by separate terms.",
                    "Technical support is provided according to the terms defined in the purchased license type and for the duration specified at the time of purchase."
                ]
            },
            {
                "id": "section6",
                "title": "6. Data Collection and Protection",
                "content": [
                    "The Software may collect certain usage data to improve performance, diagnose problems, or provide updates. This data includes information about your operating system, hardware configuration, and features used within the Software.",
                    "This data is collected anonymously and processed in accordance with our Privacy Policy available on our website. All collected data is processed in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.",
                    "You have the right to access, rectify, erase, and port your personal data. You can exercise these rights by contacting the Licensor at the email address indicated on the website."
                ]
            },
            {
                "id": "section7",
                "title": "7. Termination",
                "content": [
                    "This license is valid until terminated. You may terminate it at any time by uninstalling the Software and destroying all copies of it.",
                    "The Licensor may terminate this license immediately if you fail to comply with any of the terms of this EULA. In that case, you must cease all use of the Software and destroy all copies of it."
                ]
            },
            {
                "id": "section8",
                "title": "8. Disclaimer of Warranty",
                "content": [
                    "TO THE EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE IS PROVIDED \"AS IS\" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.",
                    "THE LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL MEET YOUR REQUIREMENTS OR THAT ITS OPERATION WILL BE UNINTERRUPTED OR ERROR-FREE.",
                    "This disclaimer of warranty does not apply in jurisdictions where such exclusions are limited by law. In such cases, the minimum warranties required by applicable law remain in effect."
                ]
            },
            {
                "id": "section9",
                "title": "9. Limitation of Liability",
                "content": [
                    "TO THE EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE LICENSOR BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES, INCLUDING, BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE.",
                    "THE LICENSOR'S TOTAL LIABILITY FOR ANY CLAIM UNDER THIS EULA SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SOFTWARE.",
                    "Some jurisdictions do not allow the exclusion or limitation of liability for certain types of damages. In such jurisdictions, the above limitations may not apply to you."
                ]
            },
            {
                "id": "section10",
                "title": "10. Governing Law and Jurisdiction",
                "content": [
                    "This EULA is governed by the laws of France, without regard to its conflict of law principles. Any dispute arising out of this EULA will be subject to the exclusive jurisdiction of the courts of Chalon-sur-Saône, France.",
                    "If you are a consumer residing in the European Union, you also benefit from the protection of the mandatory provisions of the law in your country of residence."
                ]
            },
            {
                "id": "section11",
                "title": "11. Compliance with International Regulations",
                "content": [
                    "Export Controls: You agree to comply with all applicable international and national laws and regulations, including export and re-export restrictions applicable to the Software. These laws may include restrictions on destinations, end users, and end use.",
                    "International Taxation: If you use the Software outside of France, you are responsible for complying with all applicable tax laws in your jurisdiction. The Licensor complies with French and European tax regulations for all license sales.",
                    "Data Protection: The Software is designed to comply with major international data protection regulations, including the GDPR in the European Union, the CCPA in California, and similar regulations in other jurisdictions."
                ]
            },
            {
                "id": "section12",
                "title": "12. General Provisions",
                "content": [
                    "Severability: If any provision of this EULA is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the other provisions of this EULA will remain in full force and effect.",
                    "Entire Agreement: This EULA constitutes the entire agreement between you and the Licensor regarding the use of the Software and supersedes all prior or contemporaneous communications, proposals, and representations, whether electronic, oral, or written, between you and the Licensor regarding the Software.",
                    "Modifications: The Licensor reserves the right to modify the terms of this EULA at any time. Modifications will take effect upon posting. Continued use of the Software after posting of modifications constitutes your acceptance of such modifications.",
                    "Contact: For any questions regarding this EULA, please contact the Licensor at the email address provided on the website."
                ]
            }
        ]
    }
}