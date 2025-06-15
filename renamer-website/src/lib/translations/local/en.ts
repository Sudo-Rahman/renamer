import lang from './lang.json';


export default {
    lang,
    meta: { // Keeping the first meta block, assuming it's the correct one
        title: "Batch File Renamer | Rename Multiple Files Easily | Renamer App",
        description: "Save time with Renamer App, the powerful batch file renamer. Rename multiple files in one click with our intuitive tool. Try it now!"
    },
    nav: {
        logo_alt: "Renamer App Logo",
        download: "Download",
        docs: "Documentation",
        theme: {
            light: "Light",
            dark: "Dark",
            system: "System"
        }
    },
    footer: {
        privacy: "Privacy Policy",
        legal: "Legal Notice",
        licences: "Licenses and Tools Used",
        all: "All rights reserved."
    },
    home: {
        title: [
            "Rename",
            "hundreds",
            "of files",
            "in one click."
        ],
        subtitle: "Save time with our powerful batch renaming software, the perfect tool for renaming multiple files at once.",
        video_title: "Renamer App in Action: See How to Batch Rename Files"
    },
    manage_machines: {
        title: "Remove a device",
        description: "Enter your email and license key, then click on the button to remove a device from your license.",
        input: {
            email: {
                label: "Email",
                placeholder: "Enter your email"
            },
            key: {
                label: "License Key",
            },
            fill_all: "Please fill in all fields.",
        },
        find_btn: "Find devices",
        remove_btn: "Remove device",
        error: {
            message: "An error occurred while removing the device.",
        },
        success: {
            title: "Device removed",
            message: "{{device}} has been removed from your license.",
        }
    },
    pricing: {
        title: "Pricing",
        plan: {
            0: {
                title: "Trial",
                price: "Free",
                description: "Ideal for users who want to try the app before committing.",
                features: [
                    "Import limited to 5 files",
                ],
                btnText: "Download"
            },
            1: {
                title: "Pro",
                description: "Access all advanced features to effectively manage your bulk file renames.",
                features: [
                    "Unlimited file import",
                    "Use on 1 device",
                    "Lifetime updates",
                    "Priority support"
                ],
                btnText: "Get Pro"
            },
            2: {
                title: "Team",
                description: "Access all advanced features to effectively manage your bulk file renames on <span class='text-card-foreground font-semibold'>multiple devices.</span>",
                features: [
                    "Unlimited file import",
                    "Use on up to 5 devices",
                    "Lifetime updates",
                    "Priority support"
                ],
                btnText: "Get Team"
            }
        }
    },
    download: {
        title: "Download Renamer",
        description: "Select your cpu architecture below to download the Renamer installer.",
        btn: "Download",
    },
    licenses: {
        title: "Licenses and Tools Used",
        subtitle: "Renamer is built using the following tools and libraries.",
        sveltekit: "Framework for building web applications. License MIT.",
        shadcn: "UI component library for Svelte. License MIT.",
        tailwindcss: "Utility-first CSS framework. License MIT.",
        lucide: "SVG icon library for Svelte. License MIT.",
        nodejs: "JavaScript runtime built on Chrome's V8 engine. License MIT.",
        tauri: "Framework for building desktop applications with Rust. License MIT.",
        icon: {
            label: "Icon attribution",
            author: "The icon used on this site, as well as in the Renamer software comes from",
        },
        last_update: "Last update on {date}",
    },
    legal: {
        title: "Legal Notice",
        subtitle: "Legal notice and information about the website publisher.",
        last_update: "Last update on {date}",
        content: [
            {
                title: "1. Website Presentation",
                text: "This website is published by <strong>Rahman Yilmaz</strong>, a company registered with the Trade and Companies Register under the number <strong>RCS Chalon-sur-Saône 943775767</strong>. The registered office is located at <strong>25 D RUE des Clairières 71880 Châtenoy-le-Royal FRANCE</strong>."
            },
            {
                title: "2. Publication Director",
                text: "The publication director is <strong>Rahman Yilmaz</strong>, in the capacity of <strong>Founder and CEO</strong> of the company."
            },
            {
                title: "3. Hosting",
                text: "The website is hosted by <strong><a href=\"https://pulseheberg.com/\">Pulseheberg</a></strong>, whose registered office is located at <strong>9, Boulevard de Strasbourg 83000 Toulon</strong>. For any technical questions, you can contact the host at <strong><a href=\"tel: +33 (0) 4 22 14 13 60\">+33 (0) 4 22 14 13 60</a></strong>."
            },
            {
                title: "4. Intellectual Property",
                text: "All elements present on this website (texts, images, graphics, logos, icons, etc.) are the exclusive property of <strong>Rahman Yilmaz</strong> or its partners. Any reproduction, in whole or in part, without prior authorization, is strictly prohibited."
            },
            {
                title: "5. Terms of Use",
                text: "Access to and use of the website implies full and complete acceptance of the general terms of use. We reserve the right to modify these legal notices at any time."
            },
            {
                title: "6. Contact",
                text: "For any questions regarding these legal notices, you can contact us at the following address: contact@renamer.pro."
            },
        ]
    },
    privacy: {
        title: "Privacy Policy",
        subtitle: "Our commitment: security, transparency, and respect for your privacy.",
        last_update: "Last update on {date}",
        content: [
            {
                title: "1. Data Collection",
                text: "We only collect your email address and the information strictly necessary for the proper functioning of our software. This data is collected during payment via Stripe Checkout."
            },
            {
                title: "2. Use of Data",
                text: "The collected information is used to: <ul class=\"list-disc ml-6 mt-2\"><li>Validate and secure your transaction via Stripe.</li><li>Send you your license key for the \"Renamer\" software by email.</li><li>Ensure the proper functioning and maintenance of our services.</li></ul>"
            },
            {
                title: "3. Secure Payment",
                text: "For your payments, we use <strong>Stripe Checkout</strong>, a payment solution certified compliant with PCI-DSS standards, thus guaranteeing the security of your financial data."
            },
            {
                title: "4. Compliance and Security",
                text: "Our company, located in France, complies with all applicable regulations, including the General Data Protection Regulation (GDPR) and the recommendations of the CNIL."
            },
            {
                title: "5. Your Rights",
                text: "In accordance with the regulations, you have the following rights regarding your personal data: <ul class=\"list-disc ml-6 mt-2\"><li>Right of access</li><li>Right of rectification</li><li>Right to erasure</li><li>Right to object</li></ul> To exercise these rights, please contact us via the email address provided in our legal notice."
            },
            {
                title: "6. Policy Updates",
                text: "We reserve the right to update this privacy policy. Any changes will be immediately published on this page."
            }
        ]
    }
}