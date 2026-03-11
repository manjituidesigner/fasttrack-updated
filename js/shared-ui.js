(function () {
    var FONT_DELTA_KEY = 'ft_font_delta_px';
    var ZOOM_SCALE_KEY = 'ft_zoom_scale';
    var LANG_KEY = 'ft_lang';
    var THEME_KEY = 'ft_theme';
    var BASE_FONT_SIZE_PX = 16;

    var langDocBound = false;
    var a11yResizeBound = false;

    function getAssetPrefix() {
        var path = window.location.pathname || '';
        if (path.indexOf('/Home/') !== -1) return '../';
        if (path.indexOf('/My-Project/') !== -1) return '../';
        if (path.indexOf('/My-Application/') !== -1) return '../';
        return '';
    }

    function getStoredLang() {
        try {
            return localStorage.getItem(LANG_KEY) || 'en';
        } catch (e) {
            return 'en';
        }
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || 'light';
        } catch (e) {
            return 'light';
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, String(theme));
        } catch (e) {
        }
    }

    function applyTheme(theme) {
        var t = theme === 'dark' ? 'dark' : 'light';
        if (!document.documentElement) return;
        if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
    }

    function setStoredLang(lang) {
        try {
            localStorage.setItem(LANG_KEY, String(lang));
        } catch (e) {
        }
    }

    function getLangShortLabel(lang) {
        if (lang === 'hi') return 'HI';
        if (lang === 'pa') return 'PA';
        return 'EN';
    }

    function getAutoTranslateMap() {
        return {
            'Other Service Projects': 'value.sector.other_service_projects',
            'Manufacturing': 'value.sector.manufacturing',
            'S.A.S Nagar': 'value.district.sas_nagar',
            'Ludhiana': 'value.district.ludhiana',
            'Amritsar': 'value.district.amritsar',
            'Patiala': 'value.district.patiala',
            'Jalandhar': 'value.district.jalandhar',
            'Bathinda': 'value.district.bathinda'
        };
    }

    function applyAutoTranslations() {
        if (!window.i18next || !window.i18next.isInitialized) return;

        var map = getAutoTranslateMap();
        var keys = Object.keys(map);
        if (!keys.length) return;

        var nodes = document.querySelectorAll('td, th, .proj-card-title, .proj-pin, .kv-row .k, .kv-row .v');
        nodes.forEach(function (el) {
            if (!el) return;
            if (el.hasAttribute('data-i18n')) return;

            // Only translate leaf nodes (avoid touching nodes that contain links/icons)
            if (el.children && el.children.length) return;

            var txt = (el.textContent || '').trim();
            if (!txt) return;

            // Translate honorifics in applicant names while keeping name unchanged
            // Examples: "Mr Sunny Kumar" -> "श्री Sunny Kumar" (hi)
            //           "Ms Neha Jain"   -> "सुश्री Neha Jain" (hi)
            var mrMatch = txt.match(/^Mr\s+(.+)$/);
            if (mrMatch) {
                el.textContent = window.i18next.t('value.honorific.mr') + ' ' + mrMatch[1];
                return;
            }

            var msMatch = txt.match(/^Ms\s+(.+)$/);
            if (msMatch) {
                el.textContent = window.i18next.t('value.honorific.ms') + ' ' + msMatch[1];
                return;
            }

            var key = map[txt];
            if (!key) return;

            el.textContent = window.i18next.t(key);
        });
    }

    function applyTranslations() {
        if (!window.i18next || !window.i18next.isInitialized) return;

        var nodes = document.querySelectorAll('[data-i18n]');
        nodes.forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (!key) return;
            el.textContent = window.i18next.t(key);
        });

        var phNodes = document.querySelectorAll('[data-i18n-placeholder]');
        phNodes.forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (!key) return;
            el.setAttribute('placeholder', window.i18next.t(key));
        });

        applyAutoTranslations();
    }

    function initI18n() {
        if (!window.i18next || window.i18next.isInitialized) {
            applyTranslations();
            return;
        }

        var initialLang = getStoredLang();

        window.i18next.init({
            lng: initialLang,
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: {
                        portal: { name: 'Fasttrack Portal' },
                        common: {
                            home: 'HOME',
                            click_here: 'Click here',
                            view_all: 'View All',
                            search: 'Search',
                            status: 'Status',
                            comments: 'Comments',
                            to: 'To',
                            on: 'On'
                        },
                        value: {
                            honorific: {
                                mr: 'Mr',
                                ms: 'Ms'
                            },
                            sector: {
                                other_service_projects: 'Other Service Projects',
                                manufacturing: 'Manufacturing'
                            },
                            district: {
                                sas_nagar: 'S.A.S Nagar',
                                ludhiana: 'Ludhiana',
                                amritsar: 'Amritsar',
                                patiala: 'Patiala',
                                jalandhar: 'Jalandhar',
                                bathinda: 'Bathinda'
                            }
                        },
                        nav: {
                            home: 'Home',
                            my_projects: 'My Projects',
                            my_applications: 'My Applications',
                            fiscal_incentives: 'Fiscal Incentives',
                            fiscal_registrations: 'Fiscal Registrations',
                            know_approvals: 'Know your Approvals',
                            my_account: 'My Account',
                            logout: 'Logout'
                        },
                        page: {
                            home_title: 'Home',
                            my_projects_title: 'My Projects',
                            my_applications_title: 'My Applications'
                        },
                        header: {
                            shortcut: {
                                fill_caf: 'Fill CAF',
                                fill_scaf: 'Fill S-CAF',
                                applied_application: 'Applied Application',
                                issued_application: 'Issued Application',
                                rejected_application: 'Rejected Application',
                                withdrawn_application: 'Withdrawn Application',
                                view_logs: 'View Logs'
                            },
                            user: {
                                my_account: 'My Account',
                                change_password: 'Change Password',
                                logout: 'Logout'
                            }
                        },
                        lang: {
                            english: 'English',
                            punjabi: 'Punjabi',
                            hindi: 'Hindi'
                        },
                        home: {
                            cards: {
                                invest_title: 'INVESTMENT PROJECT',
                                invest_sub: 'Apply New Project / Expansion',
                                manage_title: 'MANAGE PROJECT APPLICATIONS',
                                manage_sub: 'Apply Regulatory Clearances | Incentive / Service',
                                myapps_title: 'MY APPLICATIONS',
                                myapps_sub: 'View And Share Project Document',
                                approvals_title: 'KNOW YOUR APPROVALS',
                                approvals_sub: 'View Status and Progress of Application',
                                vault_title: 'ENTITY VAULT',
                                vault_sub: 'View And Share Project Document',
                                dashboard_title: 'PROJECT DASHBOARD',
                                dashboard_sub: 'View Status and Progress of Application'
                            },
                            action_alerts: 'ACTION ALERTS',
                            chip_pending: 'Pending',
                            chip_approval_issued: 'Approval issued',
                            investors_walkthrough: 'INVESTORS WALKTHROUGH',
                            logs: 'LOGS'
                        },
                        chatbot: {
                            title: 'Ease Punjab AI',
                            label_app_id: 'Please provide Application ID or PIN',
                            placeholder_app_id: 'Enter application ID',
                            label_help: 'How can I assist you today?',
                            pill_status: 'What is the status of my application?',
                            placeholder_message: 'Write your message here...'
                        },
                        projects: {
                            actions: {
                                add_new_project_caf: 'Add New Project with CAF',
                                apply_new_services: 'Apply for New Services'
                            },
                            accordion: {
                                rtba: 'Right To Business Act (RTBA -CAF)',
                                caf: 'Common Application Form (CAF)',
                                scaf: 'Service - Common Application Form (S-CAF)'
                            },
                            table: {
                                pin: 'PIN Number',
                                date: 'Date',
                                applicant: 'Applicant Name',
                                mobile: 'Mobile',
                                project_name: 'Project Name',
                                sector: 'Project Sector',
                                district: 'District',
                                status: 'Status',
                                action: 'Action'
                            },
                            card: {
                                pin_prefix: 'PIN:',
                                kv: {
                                    applicant: 'Applicant Name',
                                    mobile: 'Mobile',
                                    sector: 'Sector',
                                    district: 'District'
                                },
                                menu: {
                                    know_approvals: 'Know your Approvals',
                                    add_clearance: 'Add Clearance',
                                    update_applicant: 'Update Applicant',
                                    update_partners: 'Update Partners',
                                    update_pan: 'Update Company Pan Details'
                                }
                            },
                            status: {
                                pending_verification: 'Pending For Verification',
                                filling_in_process: 'Filling In Process',
                                accepted: 'Accepted',
                                verified: 'Verified',
                                cleared: 'Clearance Issued',
                                objection_resolved: 'Objection Resolved',
                                objection_raised: 'Objection Raised'
                            }
                        },
                        applications: {
                            regulatory_clearances: 'Regulatory Clearances',
                            table: {
                                pin_no: 'Pin No.',
                                applicant_name: 'Applicant Name',
                                mobile_no: 'Mobile No.',
                                project_name: 'Project Name',
                                district: 'District',
                                project_sector: 'Project Sector',
                                action: 'Action',
                                pin_date: 'PIN & Date',
                                applicant_mobile: 'Applicant Name & Mobile No',
                                project_district: 'Project Name\nDistrict'
                            },
                            tabs: {
                                apply_new: 'Apply New',
                                applied: 'Applied',
                                pending: 'Pending',
                                issued: 'Issued',
                                rejected: 'Rejected',
                                withdrawn: 'Withdrawn'
                            },
                            note: {
                                line1: 'To avail Services, filing of Service-Common Application Form (S-CAF) is a must for Existing Projects.',
                                click_here_apply: 'Click here to Apply',
                                line2: 'To view list of Services'
                            },
                            apply_new: 'Apply New',
                            rtba_label: 'Right To Business Act (RTBA-CAF)'
                        },
                        a11y: {
                            change_language: 'Change Language'
                        }
                    }
                },
                hi: {
                    translation: {
                        portal: { name: 'फास्टट्रैक पोर्टल' },
                        common: {
                            home: 'होम',
                            click_here: 'यहाँ क्लिक करें',
                            view_all: 'सभी देखें',
                            search: 'खोजें',
                            status: 'स्थिति',
                            comments: 'टिप्पणियाँ',
                            to: 'को',
                            on: 'दिनांक'
                        },
                        value: {
                            honorific: {
                                mr: 'श्री',
                                ms: 'सुश्री'
                            },
                            sector: {
                                other_service_projects: 'अन्य सेवा परियोजनाएँ',
                                manufacturing: 'विनिर्माण'
                            },
                            district: {
                                sas_nagar: 'एस.ए.एस. नगर',
                                ludhiana: 'लुधियाना',
                                amritsar: 'अमृतसर',
                                patiala: 'पटियाला',
                                jalandhar: 'जालंधर',
                                bathinda: 'बठिंडा'
                            }
                        },
                        applications: {
                            regulatory_clearances: 'नियामक मंज़ूरियाँ',
                            table: {
                                pin_no: 'पिन नं.',
                                applicant_name: 'आवेदक का नाम',
                                mobile_no: 'मोबाइल नं.',
                                project_name: 'प्रोजेक्ट नाम',
                                district: 'जिला',
                                project_sector: 'प्रोजेक्ट सेक्टर',
                                action: 'कार्यवाही',
                                pin_date: 'PIN और तारीख',
                                applicant_mobile: 'आवेदक का नाम और मोबाइल',
                                project_district: 'प्रोजेक्ट नाम\nजिला'
                            },
                            tabs: {
                                apply_new: 'नया आवेदन',
                                applied: 'आवेदित',
                                pending: 'लंबित',
                                issued: 'जारी',
                                rejected: 'अस्वीकृत',
                                withdrawn: 'वापस लिया'
                            },
                            note: {
                                line1: 'सेवाओं का लाभ लेने के लिए, मौजूदा परियोजनाओं हेतु सर्विस- कॉमन एप्लिकेशन फॉर्म (S-CAF) भरना अनिवार्य है।',
                                click_here_apply: 'आवेदन करने हेतु यहाँ क्लिक करें',
                                line2: 'सेवाओं की सूची देखने के लिए'
                            },
                            apply_new: 'नया आवेदन',
                            rtba_label: 'राइट टू बिजनेस एक्ट (RTBA-CAF)'
                        },
                        nav: {
                            home: 'होम',
                            my_projects: 'मेरे प्रोजेक्ट',
                            my_applications: 'मेरे आवेदन',
                            fiscal_incentives: 'वित्तीय प्रोत्साहन',
                            fiscal_registrations: 'वित्तीय पंजीकरण',
                            know_approvals: 'अपने अनुमोदन जानें',
                            my_account: 'मेरा खाता',
                            logout: 'लॉगआउट'
                        },
                        page: {
                            home_title: 'होम',
                            my_projects_title: 'मेरे प्रोजेक्ट',
                            my_applications_title: 'मेरे आवेदन'
                        },
                        header: {
                            shortcut: {
                                fill_caf: 'CAF भरें',
                                fill_scaf: 'S-CAF भरें',
                                applied_application: 'आवेदित आवेदन',
                                issued_application: 'जारी आवेदन',
                                rejected_application: 'अस्वीकृत आवेदन',
                                withdrawn_application: 'वापस लिया गया',
                                view_logs: 'लॉग देखें'
                            },
                            user: {
                                my_account: 'मेरा खाता',
                                change_password: 'पासवर्ड बदलें',
                                logout: 'लॉगआउट'
                            }
                        },
                        lang: {
                            english: 'अंग्रेज़ी',
                            punjabi: 'पंजाबी',
                            hindi: 'हिंदी'
                        },
                        home: {
                            cards: {
                                invest_title: 'निवेश परियोजना',
                                invest_sub: 'नई परियोजना / विस्तार के लिए आवेदन करें',
                                manage_title: 'परियोजना आवेदन प्रबंधित करें',
                                manage_sub: 'नियामक स्वीकृतियाँ | प्रोत्साहन / सेवा',
                                myapps_title: 'मेरे आवेदन',
                                myapps_sub: 'दस्तावेज़ देखें और साझा करें',
                                approvals_title: 'अपने अनुमोदन जानें',
                                approvals_sub: 'आवेदन की स्थिति और प्रगति देखें',
                                vault_title: 'एंटिटी वॉल्ट',
                                vault_sub: 'दस्तावेज़ देखें और साझा करें',
                                dashboard_title: 'परियोजना डैशबोर्ड',
                                dashboard_sub: 'आवेदन की स्थिति और प्रगति देखें'
                            },
                            action_alerts: 'एक्शन अलर्ट',
                            chip_pending: 'लंबित',
                            chip_approval_issued: 'अनुमोदन जारी',
                            investors_walkthrough: 'निवेशकों का वॉकथ्रू',
                            logs: 'लॉग्स'
                        },
                        chatbot: {
                            title: 'ईज़ पंजाब एआई',
                            label_app_id: 'कृपया आवेदन आईडी या PIN प्रदान करें',
                            placeholder_app_id: 'आवेदन आईडी दर्ज करें',
                            label_help: 'मैं आपकी कैसे मदद कर सकता हूँ?',
                            pill_status: 'मेरे आवेदन की स्थिति क्या है?',
                            placeholder_message: 'अपना संदेश लिखें...'
                        },
                        projects: {
                            actions: {
                                add_new_project_caf: 'CAF के साथ नया प्रोजेक्ट जोड़ें',
                                apply_new_services: 'नई सेवाओं के लिए आवेदन करें'
                            },
                            accordion: {
                                rtba: 'राइट टू बिज़नेस एक्ट (RTBA -CAF)',
                                caf: 'कॉमन एप्लिकेशन फॉर्म (CAF)',
                                scaf: 'सेवा - कॉमन एप्लिकेशन फॉर्म (S-CAF)'
                            },
                            table: {
                                pin: 'PIN नंबर',
                                date: 'तारीख',
                                applicant: 'आवेदक का नाम',
                                mobile: 'मोबाइल',
                                project_name: 'प्रोजेक्ट नाम',
                                sector: 'प्रोजेक्ट सेक्टर',
                                district: 'जिला',
                                status: 'स्थिति',
                                action: 'कार्यवाही'
                            },
                            card: {
                                pin_prefix: 'PIN:',
                                kv: {
                                    applicant: 'आवेदक का नाम',
                                    mobile: 'मोबाइल',
                                    sector: 'सेक्टर',
                                    district: 'जिला'
                                },
                                menu: {
                                    know_approvals: 'अपने अनुमोदन जानें',
                                    add_clearance: 'क्लीयरेंस जोड़ें',
                                    update_applicant: 'आवेदक अपडेट करें',
                                    update_partners: 'पार्टनर्स अपडेट करें',
                                    update_pan: 'कंपनी PAN विवरण अपडेट करें'
                                }
                            },
                            status: {
                                pending_verification: 'सत्यापन हेतु लंबित',
                                filling_in_process: 'प्रक्रिया में भरना',
                                accepted: 'स्वीकृत',
                                verified: 'सत्यापित',
                                cleared: 'क्लीयरेंस जारी',
                                objection_resolved: 'आपत्ति सुलझाई गई',
                                objection_raised: 'आपत्ति उठाई गई'
                            }
                        },
                        a11y: {
                            change_language: 'भाषा बदलें'
                        }
                    }
                },
                pa: {
                    translation: {
                        portal: { name: 'ਫਾਸਟਟ੍ਰੈਕ ਪੋਰਟਲ' },
                        common: {
                            home: 'ਹੋਮ',
                            click_here: 'ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ',
                            view_all: 'ਸਭ ਵੇਖੋ',
                            search: 'ਖੋਜੋ',
                            status: 'ਸਥਿਤੀ',
                            comments: 'ਟਿੱਪਣੀਆਂ',
                            to: 'ਨੂੰ',
                            on: 'ਤਾਰੀਖ'
                        },
                        value: {
                            honorific: {
                                mr: 'ਸ਼੍ਰੀ',
                                ms: 'ਕੁਮਾਰੀ'
                            },
                            sector: {
                                other_service_projects: 'ਹੋਰ ਸੇਵਾ ਪ੍ਰੋਜੈਕਟ',
                                manufacturing: 'ਉਤਪਾਦਨ'
                            },
                            district: {
                                sas_nagar: 'ਐਸ.ਏ.ਐਸ. ਨਗਰ',
                                ludhiana: 'ਲੁਧਿਆਣਾ',
                                amritsar: 'ਅੰਮ੍ਰਿਤਸਰ',
                                patiala: 'ਪਟਿਆਲਾ',
                                jalandhar: 'ਜਲੰਧਰ',
                                bathinda: 'ਬਠਿੰਡਾ'
                            }
                        },
                        applications: {
                            regulatory_clearances: 'ਨਿਯਾਮਕ ਕਲੀਅਰੈਂਸ',
                            table: {
                                pin_no: 'ਪਿਨ ਨੰ.',
                                applicant_name: 'ਆਵੇਦਕ ਦਾ ਨਾਮ',
                                mobile_no: 'ਮੋਬਾਇਲ ਨੰ.',
                                project_name: 'ਪ੍ਰੋਜੈਕਟ ਨਾਮ',
                                district: 'ਜ਼ਿਲ੍ਹਾ',
                                project_sector: 'ਪ੍ਰੋਜੈਕਟ ਸੈਕਟਰ',
                                action: 'ਕਾਰਵਾਈ',
                                pin_date: 'PIN ਅਤੇ ਤਾਰੀਖ',
                                applicant_mobile: 'ਆਵੇਦਕ ਦਾ ਨਾਮ ਅਤੇ ਮੋਬਾਈਲ',
                                project_district: 'ਪ੍ਰੋਜੈਕਟ ਨਾਮ\nਜ਼ਿਲ੍ਹਾ'
                            },
                            tabs: {
                                apply_new: 'ਨਵੀਂ ਅਰਜ਼ੀ',
                                applied: 'ਅਰਜ਼ੀ ਕੀਤੀ',
                                pending: 'ਲੰਬਿਤ',
                                issued: 'ਜਾਰੀ',
                                rejected: 'ਰੱਦ',
                                withdrawn: 'ਵਾਪਸ ਲਈ'
                            },
                            note: {
                                line1: 'ਸੇਵਾਵਾਂ ਲਈ, ਮੌਜੂਦਾ ਪ੍ਰੋਜੈਕਟਾਂ ਵਾਸਤੇ ਸਰਵਿਸ-ਕਾਮਨ ਐਪਲੀਕੇਸ਼ਨ ਫਾਰਮ (S-CAF) ਭਰਨਾ ਲਾਜ਼ਮੀ ਹੈ।',
                                click_here_apply: 'ਅਰਜ਼ੀ ਕਰਨ ਲਈ ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ',
                                line2: 'ਸੇਵਾਵਾਂ ਦੀ ਸੂਚੀ ਵੇਖਣ ਲਈ'
                            },
                            apply_new: 'ਨਵੀਂ ਅਰਜ਼ੀ',
                            rtba_label: 'ਰਾਈਟ ਟੂ ਬਿਜ਼ਨਸ ਐਕਟ (RTBA-CAF)'
                        },
                        nav: {
                            home: 'ਹੋਮ',
                            my_projects: 'ਮੇਰੇ ਪ੍ਰੋਜੈਕਟ',
                            my_applications: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ',
                            fiscal_incentives: 'ਵਿੱਤੀ ਪ੍ਰੋਤਸਾਹਨ',
                            fiscal_registrations: 'ਵਿੱਤੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
                            know_approvals: 'ਆਪਣੀਆਂ ਮਨਜ਼ੂਰੀਆਂ ਜਾਣੋ',
                            my_account: 'ਮੇਰਾ ਖਾਤਾ',
                            logout: 'ਲੋਗਆਉਟ'
                        },
                        page: {
                            home_title: 'ਹੋਮ',
                            my_projects_title: 'ਮੇਰੇ ਪ੍ਰੋਜੈਕਟ',
                            my_applications_title: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ'
                        },
                        header: {
                            shortcut: {
                                fill_caf: 'CAF ਭਰੋ',
                                fill_scaf: 'S-CAF ਭਰੋ',
                                applied_application: 'ਲਾਗੂ ਕੀਤੀ ਅਰਜ਼ੀ',
                                issued_application: 'ਜਾਰੀ ਅਰਜ਼ੀ',
                                rejected_application: 'ਰੱਦ ਅਰਜ਼ੀ',
                                withdrawn_application: 'ਵਾਪਸ ਲਈ ਗਈ',
                                view_logs: 'ਲਾਗ ਵੇਖੋ'
                            },
                            user: {
                                my_account: 'ਮੇਰਾ ਖਾਤਾ',
                                change_password: 'ਪਾਸਵਰਡ ਬਦਲੋ',
                                logout: 'ਲੋਗਆਉਟ'
                            }
                        },
                        lang: {
                            english: 'ਅੰਗਰੇਜ਼ੀ',
                            punjabi: 'ਪੰਜਾਬੀ',
                            hindi: 'ਹਿੰਦੀ'
                        },
                        home: {
                            cards: {
                                invest_title: 'ਨਿਵੇਸ਼ ਪ੍ਰੋਜੈਕਟ',
                                invest_sub: 'ਨਵਾਂ ਪ੍ਰੋਜੈਕਟ / ਵਿਸਥਾਰ ਲਈ ਅਰਜ਼ੀ ਦਿਓ',
                                manage_title: 'ਪ੍ਰੋਜੈਕਟ ਅਰਜ਼ੀਆਂ ਸੰਭਾਲੋ',
                                manage_sub: 'ਨਿਯਮਕ ਮਨਜ਼ੂਰੀਆਂ | ਪ੍ਰੋਤਸਾਹਨ / ਸੇਵਾ',
                                myapps_title: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ',
                                myapps_sub: 'ਦਸਤਾਵੇਜ਼ ਵੇਖੋ ਤੇ ਸਾਂਝੇ ਕਰੋ',
                                approvals_title: 'ਆਪਣੀਆਂ ਮਨਜ਼ੂਰੀਆਂ ਜਾਣੋ',
                                approvals_sub: 'ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਅਤੇ ਤਰੱਕੀ ਵੇਖੋ',
                                vault_title: 'ਐਂਟੀਟੀ ਵਾਲਟ',
                                vault_sub: 'ਦਸਤਾਵੇਜ਼ ਵੇਖੋ ਤੇ ਸਾਂਝੇ ਕਰੋ',
                                dashboard_title: 'ਪ੍ਰੋਜੈਕਟ ਡੈਸ਼ਬੋਰਡ',
                                dashboard_sub: 'ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਅਤੇ ਤਰੱਕੀ ਵੇਖੋ'
                            },
                            action_alerts: 'ਐਕਸ਼ਨ ਅਲਰਟ',
                            chip_pending: 'ਲੰਬਿਤ',
                            chip_approval_issued: 'ਮਨਜ਼ੂਰੀ ਜਾਰੀ',
                            investors_walkthrough: 'ਨਿਵੇਸ਼ਕਾਂ ਦਾ ਵਾਕਥਰੂ',
                            logs: 'ਲਾਗਸ'
                        },
                        chatbot: {
                            title: 'ਈਜ਼ ਪੰਜਾਬ ਏਆਈ',
                            label_app_id: 'ਕਿਰਪਾ ਕਰਕੇ ਐਪਲੀਕੇਸ਼ਨ ਆਈਡੀ ਜਾਂ PIN ਦਿਓ',
                            placeholder_app_id: 'ਐਪਲੀਕੇਸ਼ਨ ਆਈਡੀ ਦਰਜ ਕਰੋ',
                            label_help: 'ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
                            pill_status: 'ਮੇਰੀ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?',
                            placeholder_message: 'ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...'
                        },
                        projects: {
                            actions: {
                                add_new_project_caf: 'CAF ਨਾਲ ਨਵਾਂ ਪ੍ਰੋਜੈਕਟ ਜੋੜੋ',
                                apply_new_services: 'ਨਵੀਆਂ ਸੇਵਾਵਾਂ ਲਈ ਅਰਜ਼ੀ ਦਿਓ'
                            },
                            accordion: {
                                rtba: 'ਰਾਈਟ ਟੂ ਬਿਜ਼ਨਸ ਐਕਟ (RTBA -CAF)',
                                caf: 'ਕਾਮਨ ਐਪਲੀਕੇਸ਼ਨ ਫਾਰਮ (CAF)',
                                scaf: 'ਸੇਵਾ - ਕਾਮਨ ਐਪਲੀਕੇਸ਼ਨ ਫਾਰਮ (S-CAF)'
                            },
                            table: {
                                pin: 'PIN ਨੰਬਰ',
                                date: 'ਤਾਰੀਖ',
                                applicant: 'ਆਵੇਦਕ ਦਾ ਨਾਮ',
                                mobile: 'ਮੋਬਾਇਲ',
                                project_name: 'ਪ੍ਰੋਜੈਕਟ ਨਾਮ',
                                sector: 'ਪ੍ਰੋਜੈਕਟ ਸੈਕਟਰ',
                                district: 'ਜ਼ਿਲ੍ਹਾ',
                                status: 'ਸਥਿਤੀ',
                                action: 'ਕਾਰਵਾਈ'
                            },
                            card: {
                                pin_prefix: 'PIN:',
                                kv: {
                                    applicant: 'ਆਵੇਦਕ ਦਾ ਨਾਮ',
                                    mobile: 'ਮੋਬਾਇਲ',
                                    sector: 'ਸੈਕਟਰ',
                                    district: 'ਜ਼ਿਲ੍ਹਾ'
                                },
                                menu: {
                                    know_approvals: 'ਆਪਣੀਆਂ ਮਨਜ਼ੂਰੀਆਂ ਜਾਣੋ',
                                    add_clearance: 'ਕਲੀਅਰੈਂਸ ਜੋੜੋ',
                                    update_applicant: 'ਆਵੇਦਕ ਅਪਡੇਟ ਕਰੋ',
                                    update_partners: 'ਪਾਰਟਨਰਜ਼ ਅਪਡੇਟ ਕਰੋ',
                                    update_pan: 'ਕੰਪਨੀ PAN ਵੇਰਵੇ ਅਪਡੇਟ ਕਰੋ'
                                }
                            },
                            status: {
                                pending_verification: 'ਤਸਦੀਕ ਲਈ ਲੰਬਿਤ',
                                filling_in_process: 'ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਭਰਨਾ',
                                accepted: 'ਸਵੀਕਾਰਿਆ ਗਿਆ',
                                verified: 'ਤਸਦੀਕ ਹੋਈ',
                                cleared: 'ਕਲੀਅਰੈਂਸ ਜਾਰੀ',
                                objection_resolved: 'ਆਪੱਤੀ ਹੱਲ ਹੋਈ',
                                objection_raised: 'ਆਪੱਤੀ ਉਠਾਈ ਗਈ'
                            }
                        },
                        a11y: {
                            change_language: 'ਭਾਸ਼ਾ ਬਦਲੋ'
                        }
                    }
                }
            }
        }, function () {
            applyTranslations();
        });
    }

    function isSmallScreen() {
        return window.matchMedia('(max-width: 575.98px)').matches;
    }

    function clampDelta(value) {
        var n = parseInt(value, 10);
        if (!isFinite(n)) return 0;
        if (n < -3) return -3;
        if (n > 3) return 3;
        return n;
    }

    function getStoredDelta() {
        try {
            return clampDelta(localStorage.getItem(FONT_DELTA_KEY) || 0);
        } catch (e) {
            return 0;
        }
    }

    function setStoredDelta(delta) {
        try {
            localStorage.setItem(FONT_DELTA_KEY, String(delta));
        } catch (e) {
        }
    }

    function applyFontDelta(delta) {
        var d = clampDelta(delta);
        document.documentElement.style.fontSize = (BASE_FONT_SIZE_PX + d) + 'px';
        setStoredDelta(d);
    }

    function clampZoom(value) {
        var n = Number(value);
        if (!isFinite(n)) return 1;
        if (n < 0.85) return 0.85;
        if (n > 1.15) return 1.15;
        return Math.round(n * 100) / 100;
    }

    function getStoredZoom() {
        try {
            return clampZoom(localStorage.getItem(ZOOM_SCALE_KEY) || 1);
        } catch (e) {
            return 1;
        }
    }

    function setStoredZoom(zoom) {
        try {
            localStorage.setItem(ZOOM_SCALE_KEY, String(zoom));
        } catch (e) {
        }
    }

    function applyPageZoom(zoom) {
        var z = clampZoom(zoom);
        setStoredZoom(z);
        if (!document.body) return;
        if (isSmallScreen()) {
            document.body.style.zoom = String(z);
        } else {
            document.body.style.zoom = '';
        }
    }

    function getHeaderTemplate(activePage) {
        var dashboardActive = activePage === 'dashboard' ? 'active' : '';
        var projectsActive = activePage === 'projects' ? 'active' : '';

        var assetPrefix = getAssetPrefix();
        var langShort = getLangShortLabel(getStoredLang());
        var theme = getStoredTheme();
        var themeIcon = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
        var themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

        return (
            '<div class="header-left">' +
            '  <button class="icon-btn mobile-menu-btn d-lg-none" type="button" aria-label="Menu" id="mobileMenuBtn">' +
            '    <i class="bi bi-list"></i>' +
            '    <i class="bi bi-x-lg"></i>' +
            '  </button>' +
            '  <div class="header-logos">' +
            '    <img class="header-gov-logo" src="' + assetPrefix + 'assets/images/govt-logo-dark.png" alt="Government logo">' +
            '    <img class="header-ft-logo" src="' + assetPrefix + 'assets/images/fasttrack-logo-dark.png" alt="FastTrack logo">' +
            '  </div>' +
            '</div>' +
            '<div class="header-center">' +
            '  <div class="helpline">' +
            '    <div class="helpline-ic"><i class="fa-solid fa-headset"></i></div>' +
            '    <div class="helpline-txt">' +
            '      <div class="small text-muted fw-semibold">HELP LINE : 0172-4866999</div>' +
            '      <div class="small text-muted">9:00 AM TO 5:00 PM</div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="header-right">' +
            '  <div class="a11y-wrapper d-flex">' +
            '    <div class="a11y-label">Screen Visibility</div>' +
            '    <div class="a11y-controls" role="group" aria-label="Text size">' +
            '      <button class="a11y-btn" type="button" id="a11yFontDown" aria-label="Decrease text size">A-</button>' +
            '      <button class="a11y-btn" type="button" id="a11yFontUp" aria-label="Increase text size">A+</button>' +
            '      <button class="a11y-btn" type="button" id="a11yReset" aria-label="Reset"><i class="bi bi-arrow-clockwise"></i></button>' +
            '    </div>' +
            '  </div>' +
            '  <button class="icon-btn d-none d-lg-grid" type="button" aria-label="' + themeLabel + '" id="themeToggleBtn">' +
            '    <i class="' + themeIcon + '" id="themeToggleIcon"></i>' +
            '  </button>' +
            '  <div class="dropdown">' +
            '    <button class="icon-btn shortcut-btn" type="button" aria-label="Shortcut" data-bs-toggle="dropdown" aria-expanded="false">' +
            '      <i class="fa-solid fa-plus"></i>' +
            '    </button>' +
            '    <ul class="dropdown-menu dropdown-menu-end shortcut-menu">' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-file-earmark-text"></i><span data-i18n="header.shortcut.fill_caf">Fill CAF</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-file-earmark-richtext"></i><span data-i18n="header.shortcut.fill_scaf">Fill S-CAF</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-clock-history"></i><span data-i18n="header.shortcut.applied_application">Applied Application</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-patch-check"></i><span data-i18n="header.shortcut.issued_application">Issued Application</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-x-circle"></i><span data-i18n="header.shortcut.rejected_application">Rejected Application</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-arrow-counterclockwise"></i><span data-i18n="header.shortcut.withdrawn_application">Withdrawn Application</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-list-ul"></i><span data-i18n="header.shortcut.view_logs">View Logs</span></a></li>' +
            '    </ul>' +
            '  </div>' +
            '  <div class="dropdown">' +
            '    <button class="user-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
            '      <span class="user-ic"><i class="fa-solid fa-user"></i></span>' +
            '      <span class="user-name">Welcome Ankit Kumar</span>' +
            '      <span class="user-caret"><i class="fa-solid fa-chevron-down"></i></span>' +
            '    </button>' +
            '    <ul class="dropdown-menu dropdown-menu-end user-menu">' +
            '      <li>' +
            '        <div class="lang-switch" id="langSwitch">' +
            '          <button class="lang-switch-head" type="button" aria-expanded="false">' +
            '            <span class="lang-switch-title" data-i18n="a11y.change_language">Change Language</span>' +
            '            <span class="lang-switch-right">' +
            '              <span class="lang-switch-code" id="langSwitchCode">' + langShort + '</span>' +
            '              <i class="bi bi-chevron-down" id="langSwitchCaret"></i>' +
            '            </span>' +
            '          </button>' +
            '          <div class="lang-switch-menu" id="langSwitchMenu" hidden>' +
            '            <button class="lang-switch-item" type="button" data-lang="en"><span data-i18n="lang.english">English</span> <i class="bi bi-check2 lang-check" data-lang-check="en"></i></button>' +
            '            <button class="lang-switch-item" type="button" data-lang="pa"><span data-i18n="lang.punjabi">Punjabi</span> <i class="bi bi-check2 lang-check" data-lang-check="pa"></i></button>' +
            '            <button class="lang-switch-item" type="button" data-lang="hi"><span data-i18n="lang.hindi">Hindi</span> <i class="bi bi-check2 lang-check" data-lang-check="hi"></i></button>' +
            '          </div>' +
            '        </div>' +
            '      </li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-person"></i><span data-i18n="header.user.my_account">My Account</span></a></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-key"></i><span data-i18n="header.user.change_password">Change Password</span></a></li>' +
            '      <li><hr class="dropdown-divider"></li>' +
            '      <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right"></i><span data-i18n="header.user.logout">Logout</span></a></li>' +
            '    </ul>' +
            '  </div>' +
            '</div>'
        );
    }

    function setupLanguageSwitcher() {
        var head = document.querySelector('#langSwitch .lang-switch-head');
        var menu = document.getElementById('langSwitchMenu');
        var codeEl = document.getElementById('langSwitchCode');
        var caret = document.getElementById('langSwitchCaret');

        if (!head || !menu) return;

        if (head.getAttribute('data-bound') === '1') {
            setSelected(getStoredLang());
            return;
        }

        function setSelected(lang) {
            if (codeEl) codeEl.textContent = getLangShortLabel(lang);

            var checks = document.querySelectorAll('#langSwitch [data-lang-check]');
            checks.forEach(function (c) {
                c.style.visibility = c.getAttribute('data-lang-check') === lang ? 'visible' : 'hidden';
            });
        }

        function openMenu() {
            menu.hidden = false;
            if (caret) caret.classList.add('rot');
            head.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            menu.hidden = true;
            if (caret) caret.classList.remove('rot');
            head.setAttribute('aria-expanded', 'false');
        }

        head.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (menu.hidden) openMenu(); else closeMenu();
        });

        menu.addEventListener('click', function (e) {
            var btn = e.target && e.target.closest('[data-lang]');
            if (!btn) return;
            var lang = btn.getAttribute('data-lang') || 'en';
            setStoredLang(lang);
            if (window.i18next && window.i18next.isInitialized) {
                window.i18next.changeLanguage(lang, function () {
                    applyTranslations();
                });
            }
            setSelected(lang);
            closeMenu();
        });

        if (!langDocBound) {
            document.addEventListener('click', function (e) {
                var inControl = e.target && (e.target.closest('#langSwitch') || e.target.closest('#langSwitchMenu'));
                if (!inControl) closeMenu();
            });
            langDocBound = true;
        }

        head.setAttribute('data-bound', '1');

        setSelected(getStoredLang());
    }

    function mountHeader() {
        var header = document.querySelector('.app-header');
        if (!header) return;

        var activePage = header.getAttribute('data-active-page') || '';
        header.innerHTML = getHeaderTemplate(activePage);
    }

    function setupThemeToggle() {
        var btn = document.getElementById('themeToggleBtn');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var next = getStoredTheme() === 'dark' ? 'light' : 'dark';
            setStoredTheme(next);
            applyTheme(next);
            mountHeader();
            setupLanguageSwitcher();
            applyTranslations();
            setupAccessibilityControls();
            setupThemeToggle();
        });
    }

    function setupAccessibilityControls() {
        applyFontDelta(getStoredDelta());
        applyPageZoom(getStoredZoom());

        var down = document.getElementById('a11yFontDown');
        var up = document.getElementById('a11yFontUp');
        var reset = document.getElementById('a11yReset');

        if (down && down.getAttribute('data-bound') !== '1') {
            down.addEventListener('click', function () {
                applyFontDelta(getStoredDelta() - 1);
                if (isSmallScreen()) applyPageZoom(getStoredZoom() - 0.05);
            });
            down.setAttribute('data-bound', '1');
        }

        if (up && up.getAttribute('data-bound') !== '1') {
            up.addEventListener('click', function () {
                applyFontDelta(getStoredDelta() + 1);
                if (isSmallScreen()) applyPageZoom(getStoredZoom() + 0.05);
            });
            up.setAttribute('data-bound', '1');
        }

        if (reset && reset.getAttribute('data-bound') !== '1') {
            reset.addEventListener('click', function () {
                applyFontDelta(0);
                applyPageZoom(1);
            });
            reset.setAttribute('data-bound', '1');
        }

        if (!a11yResizeBound) {
            window.addEventListener('resize', function () {
                applyPageZoom(getStoredZoom());
            });
            a11yResizeBound = true;
        }
    }

    function setupMobileCardNavigation() {
        var cards = document.querySelectorAll('.dash-card');
        if (!cards.length) return;

        function shouldNavigate() {
            return window.matchMedia('(max-width: 991.98px)').matches;
        }

        cards.forEach(function (card) {
            card.addEventListener('click', function (e) {
                if (!shouldNavigate()) return;

                var target = e.target;
                if (target && (target.closest('a') || target.closest('button') || target.closest('input') || target.closest('select'))) return;

                var link = card.querySelector('a.pill-btn[href]');
                if (!link) return;

                var href = link.getAttribute('href');
                if (!href || href === '#') return;

                window.location.href = href;
            });
        });
    }

    function setupMobileSidebar() {
        var menuBtn = document.getElementById('mobileMenuBtn');
        var backdrop = document.getElementById('sidebarBackdrop');

        function closeSidebar() { document.body.classList.remove('sidebar-open'); }
        function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }

        if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
        if (backdrop) backdrop.addEventListener('click', closeSidebar);
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 992) closeSidebar();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyTheme(getStoredTheme());
            initI18n();
            mountHeader();
            setupLanguageSwitcher();
            applyTranslations();
            setupAccessibilityControls();
            setupThemeToggle();
            setupMobileCardNavigation();
            setupMobileSidebar();
        });
    } else {
        applyTheme(getStoredTheme());
        initI18n();
        mountHeader();
        setupLanguageSwitcher();
        applyTranslations();
        setupAccessibilityControls();
        setupThemeToggle();
        setupMobileCardNavigation();
        setupMobileSidebar();
    }
})();
