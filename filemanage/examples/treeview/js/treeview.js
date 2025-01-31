/**
 *
 * Treeview is created to select the single file to edit the file,
 * or multi files to upload, or the single directory to move/copy files.
 *
 * Treeview is recreated based on jstree library.
 * http://www.jstree.com/
 *
 * Spec:    http://produce.corp.miiicasa.com/spec/TREEVIEW_V2/
 * Mockup:
 * PSD:
 *
 * @author  Vivian Huang
 * @created 2013/06/19
 *
 *
 * Usage:
 *
 * var treeview = new Treeview({
 *  gid         : 0,                  // List tree from this group id. if 0, list from root node.
 *  isDirMulti  : false,              // Allow directories to be multiple selected.
 *  isFileMulti : true,               // Allow files to be multiple selected.
 *  isDirOnly   : false,              // List directories only, no files.
 *  isCreateDir : false,              // Show the button of create folder.
 *  isShow      : false,              // Show the modal on the initial.
 *  title       : '從檔案櫃選擇',     // The title of treeview.
 *  subtitle    : '',                 // The subtitle of treeview.
 *  desc        : '',                 // The description of treeview.
 *  buttonLabel : '確定',             // The button label of treeview.
 *  langs       : {},                 // The lang object of treeview.
 *  callback    : function (data) {}  // The callback function is triggered when closing the treeview modal.
 * });
 *
 * treeview.reset();   // Uncheck the checkbox and close all directories.
 * treeview.show();    // Show treeview modal.
 * treeview.hide();    // Hide treeview modal.
 * // Show the error messages.
 * treeview.showErrors('Error Message', function () {
 * });
 *
 */

(function ($) {
    window.Treeview = function (opts) {
        var apiFileListUrl     = '/filemanage/samples/treeview/api/files/getFileList',
            apiFileListUrl     = '/filemanage/samples/treeview/api/getFileList.php',
            apiCreateFolderUrl = '/filemanage/samples/treeview/api/files/createFolder',
            folderIconSrc      = '/filemanage/samples/libs/jstree-v.pre1.0/themes/miii/ico_folder.png',
            userFolderIconSrc  = '/filemanage/samples/libs/jstree-v.pre1.0/themes/miii/ico_folder_user.png',
            currentPath        = '',
            isInitialQuery     = false,
            hideClass          = 'hide',
            defaultDirName,
            treeviewModal,
            treeview,
            treeviewId,
            config             = {},
            result             = {},
            scroller           = null,
            handleLoad,
            handleSelect,
            handleChangeState,
            handleCreate,
            handleCreateDir,
            handleOk,
            getCount,
            validateName,
            validateExisted,
            enableButton,
            createModal,
            reset,
            showErrors,
            show,
            hide;

        /**
         * Handles when tree selectors have been loaded.
         * Hide the checkboxes of the directories when multiple dir is disabled.
         * Customize thescroll bar.
         *
         * @event handleLoad
         * @private
         * @param e {Event} The event instance
         * @param data {Object} The jstree data
         * @return void
         */
        handleLoad = function (e, data) {
            if (!config.isDirMulti) {
                // Hide checkboxes of the directories.
                $(this).find('li.folder').children('a').children('.jstree-checkbox').hide();
            }

            // Customize the scroll bar.
            if ($.fn.niceScroll) {
                if (scroller) {
                    scroller.resize();
                } else {
                    scroller = treeviewModal.find('.inner-content').niceScroll({
                        cursoropacitymax  : 0.6,
                        mousescrollstep   : 20,
                        bouncescroll      : false,
                        cursorwidth       : 10
                    });
                }
            }
        };

        /**
         * Handles to select the directory selector or the file selector.
         * Bind event select_node to open the directories to load children selectors.
         * The default behavior of checkbox opening the directories is to check all children selectors.
         *
         * @event handleSelect
         * @private
         * @param e {Event} The event instance
         * @param data {Object} The jstree data
         * @return void
         */
        handleSelect = function (e, data) {
            var liSelector = data.rslt.obj;

            if (liSelector.hasClass('folder')) {
                if (config.isDirMulti) {
                    // Check or uncheck the folder selector.
                    if (treeview.jstree('is_checked')) {
                        treeview.jstree('uncheck_node');
                    } else {
                        treeview.jstree('check_node');
                    }
                    liSelector.children('a').removeClass('jstree-clicked');
                } else {
                    // Open or close the selected node.
                    treeview.jstree('toggle_node');
                }
            }

            if (liSelector.hasClass('file') && config.isFileMulti) {
                // Check or uncheck the file selector.
                if (treeview.jstree('is_checked')) {
                    treeview.jstree('uncheck_node');
                } else {
                    treeview.jstree('check_node');
                }
                liSelector.children('a').removeClass('jstree-clicked');
            }

            enableButton();
        };

        /**
         * Handles when the user clicks on the checkbox.
         *
         * @event handleChangeState
         * @private
         * @param node
         * @param uncheck
         * @return void
         */
        handleChangeState = function (node, uncheck) {
            enableButton();
        };

        /**
         * Handles to create the directory.
         *
         * @event handleCreate
         * @private
         * @param e {Event} The event instance
         * @param data {Object} The jstree data
         * @return void
         */
        handleCreate = function (e, data) {
            var liSelector = data.rslt.obj,
                name       = data.rslt.name,
                gid,
                pattern    = new RegExp(defaultDirName, 'g'),
                msgSelector,
                parentSelector;

            msgSelector    = treeviewModal.find('.msg');
            parentSelector = liSelector.parents('li').eq(0);

            // Validate the directory name.
            name = $.trim(name);
            // Remove tailing spaces and dots.
            name = name.replace(/[.\s]+$/, '');
            if (!name) {
                msgSelector.html('<i class="icon-error"></i>' + config.langs['treeview-dir_name_empty_msg'])
                           .removeClass(hideClass);
                $.jstree.rollback(data.rlbk);
                return;
            } else if (name.indexOf('.') === 0) {
                msgSelector.html('<i class="icon-error"></i>' + config.langs['treeview-dir_name_beginning_msg'])
                           .removeClass(hideClass);
                $.jstree.rollback(data.rlbk);
                return;
            } else if (!validateName(name)) {
                msgSelector.html('<i class="icon-error"></i>' + config.langs['treeview-dir_name_illegal_msg'])
                           .removeClass(hideClass);
                $.jstree.rollback(data.rlbk);
                return;
            } else if (name.length > 70) {
                msgSelector.html('<i class="icon-error"></i>' + config.langs['treeview-dir_name_too_long_msg'])
                           .removeClass(hideClass);
                $.jstree.rollback(data.rlbk);
                return;
            }

            // Validate name of the directory to see if the name has been existed.
            if (parentSelector.length) {
                if (!validateExisted(parentSelector, name)) {
                    msgSelector.html('<i class="icon-error"></i>' + config.langs['treeview-same_name_msg'])
                               .removeClass(hideClass);
                    $.jstree.rollback(data.rlbk);
                    return;
                }
            }

            gid  = liSelector.attr('data-gid');
            // Post to create the directory.
            $.ajax({
                url: apiCreateFolderUrl,
                data: {
                    crumb    : liSelector.attr('data-crumb'),
                    gid      : liSelector.attr('data-gid'),
                    path     : currentPath,
                    filename : name,
                    desc     : '',
                    type     : 'jstree'
                }
            }).done(function (data, status, jqXHR) {
                if (data.status === 'ok') {
                    liSelector.attr({
                        'data-crumb' : data.crumb,
                        'data-name'  : name,
                        'data-path'  : currentPath + '/' + name
                    });
                    treeview.jstree('deselect_all');
                    $.jstree._focused().select_node(liSelector);
                    result.createdData.push({
                        'gid'      : gid,
                        'path'     : currentPath,
                        'filesize' : 0,
                        'filename' : name
                    });
                } else {
                    console.log('Create Folder Failed');
                }
            }).fail(function (jqXHR, status, errorThrown) {
                console.log('Create Folder Fail : ' + errorThrown);
            });
        };

        /**
         * Handles to create the directory when clicking on the create button.
         *
         * @event handleCreateDir
         * @private
         * @param e {Event} The event instance
         * @return void
         */
        handleCreateDir = function (e) {
            // Prevent from triggering form submit event.
            // This would happen on Chrome, Firefox, and IE.
            e.preventDefault();

            var selectedSelector = treeview.jstree('get_selected'),
                msgSelector      = treeviewModal.find('.msg'),
                name  = '',
                count = 0;

            // Clear .msg selector.
            msgSelector.addClass(hideClass).html('');

            if (selectedSelector.length) {
                currentPath = selectedSelector.attr('data-path');
                count = getCount(selectedSelector);
                name  = (count > 0) ? defaultDirName + '(' + count + ')' : defaultDirName;
                // Create the directory.
                // Pass null to use the currently selected item.
                treeview.jstree('create', null, 'last', {
                    'data': {
                        'title': name,
                        'attr': {
                            'href'  : '#'
                        }
                    },
                    'attr': {
                        'data-crumb': selectedSelector.attr('data-crumb'),
                        'data-gid'  : selectedSelector.attr('data-gid'),
                        'data-path' : currentPath + '/' + name,
                        'data-name' : name,
                        'data-size' : 0,
                        'class'     : 'folder',
                        'rel'       : selectedSelector.attr('rel') ? selectedSelector.attr('rel') : 'folder'
                    },
                    'state': 'closed'
                });
            } else {
                msgSelector.html('<i class="icon-error"></i>' + config.langs['treeview-pick_dir_msg'])
                           .removeClass(hideClass);
            }
        };

        /**
         * Handles to execute callback function when clicking on the ok button.
         *
         * @event handleOk
         * @private
         * @param e {Event} The event instance
         * @return void
         */
        handleOk = function (e) {
            // Prevent from triggering form submit event.
            // This would happen on Chrome, Firefox, and IE.
            e.preventDefault();

            var selectedSelectors = treeview.jstree('get_selected'),
                liSelectors       = [],
                childrenSelectors;

            treeviewModal.find('.msg')
                         .addClass(hideClass)
                         .html('');

            // Multiple checkboxes.
            if (config.isDirMulti || config.isFileMulti) {
                selectedSelectors = treeview.jstree('get_checked');
            }

            if (config.isDirOnly) {
                selectedSelectors.each(function (idx, element) {
                    if ($(element).hasClass('folder')) {
                        liSelectors.push($(element));
                    }
                });
            } else {
                // When check all file selectors, jstree will return the folder selector.
                selectedSelectors.each(function (idx, element) {
                    if ($(element).hasClass('folder')) {
                        childrenSelectors = $(element).children('ul').find('li.file');
                        childrenSelectors.each(function (i, ele) {
                            liSelectors.push($(ele));
                        });
                    } else if ($(element).hasClass('file')) {
                        liSelectors.push($(element));
                    }
                });
            }
            $(liSelectors).each(function (idx, element) {
                result.selectedData.push({
                    'gid'      : $(element).attr('data-gid'),
                    'path'     : $(element).attr('data-path'),
                    'filesize' : $(element).attr('data-size'),
                    'filename' : $(element).attr('data-name')
                });
            });

            result.action = 'ok';
            treeviewModal.modal('hide');
        };

        /**
         * Get the count number of the default directory name.
         *
         * @method getCount
         * @private
         * @param selector {jQuery Selector} Tree selected selector
         * @return count {Number}
         */
        getCount = function (selector) {
            var count = 0,
                liSelectors = selector.children('ul').children('li.folder');

            liSelectors.each(function (idx, element) {
                var name    = $(element).attr('data-name'),
                    pattern = new RegExp(defaultDirName, 'gi'),
                    start,
                    num;

                if (pattern.test(name)) {
                    start = name.indexOf('(');
                    if (start === -1) {
                        count = 2;
                    } else {
                        start = start + 1;
                        num   = parseInt(name.substring(start, name.length - 1), 10);
                        if (num >= count) {
                            count = num + 1;
                        }
                    }
                }
            });
            return count;
        };

        /**
         * Validate name of the directory to see if the name contains any characters disallowed.
         *
         * @method validateName
         * @private
         * @param str {String} The directory name
         * @return {Boolean}
         */
        validateName = function (str) {
            return !(/[\\\/:*?\"<>\|]/.test(str));
        };

        /**
         * Validate name of the directory to see if the name has been existed.
         *
         * @method validateName
         * @private
         * @param selector {jQuery Selector} Tree li selector
         * @param name {String} The directory name
         * @return {Boolean}
         */
        validateExisted = function (selector, name) {
            var isExisted = true,
                liSelectors;

            liSelectors = selector.children('ul').children('li.folder').not(':last');
            liSelectors.each(function (idx, element) {
                var filename = $(element).attr('data-name');
                if (filename === name) {
                    isExisted = false;
                    return false;
                }
            });
            return isExisted;
        };

        /**
         * Enable or disable the ok button.
         * Enable the ok button if there is any item selected. Otherwise, disable the ok button.
         *
         * @method enableButton
         * @private
         * @param selector {jQuery Selector} Tree li selector
         * @param name {String} The directory name
         * @return void
         */
        enableButton = function () {
            var selectedSelectors = treeview.jstree('get_selected');
            if (config.isDirMulti || config.isFileMulti) {
                // Get all checked selectors.
                selectedSelectors = treeview.jstree('get_checked');
            }
            // Enable or disable the ok button.
            if (selectedSelectors.length) {
                treeviewModal.find('.modal-footer .btn').prop('disabled', false);
            } else {
                treeviewModal.find('.modal-footer .btn').prop('disabled', true);
            }
        };

        /**
         * Create treeview modal.
         *
         * @method createModal
         * @private
         * @return void
         */
        createModal = function () {
            var timestamp  = new Date().getTime(),
                html = [];
            treeviewId = 'treeview-' + timestamp;

            html = [
                '<div id="treeview-modal-' + timestamp + '" class="modal fade">',
                    '<div class="modal-dialog">',
                        '<div class="modal-content">',
                            '<div class="modal-header">',
                                '<a href="#" class="close" data-dismiss="modal"><i class="icon-remove"></i></a>',
                                '<h3 class="modal-title">Treeview</h3>',
                            '</div>',
                            '<div class="modal-body">',
                                '<div class="miii-treeview">',
                                    '<div class="empty hide">',
                                        '<p class="main">' + config.langs['treeview-empty_main_msg'] + '</p>',
                                        '<p>' + config.langs['treeview-empty_msg'] + '</p>',
                                    '</div>',
                                    '<div class="outer-content hide">',
                                        '<div>',
                                            '<p class="desc"></p>',
                                            '<p class="msg hide"></p>',
                                            '<h4 class="pull-left"></h4>',
                                            '<button class="btn pull-right hide">' + config.langs['treeview-create_dir_label'] + '</button>',
                                        '</div>',
                                        '<div class="inner-content">',
                                            '<div id="' + treeviewId + '"></div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div class="modal-footer">',
                                '<button class="btn btn-primary">Ok</button>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ];

            treeviewModal = $(html.join('')).appendTo($('body')).modal({show: false});
        };

        /**
         * Reset treeview.
         * Uncheck the checkbox and close all directories.
         *
         * @method reset
         * @public
         * @return void
         */
        reset = function () {
            scroller       = null;
            currentPath    = '';
            isInitialQuery = false;
            result = {
                'action'       : '',
                'selectedData' : [],
                'createdData'  : []
            };
            treeview.jstree('refresh').jstree('deselect_all');
            treeviewModal.find('.msg')
                         .removeClass(hideClass)
                         .html('');
        };

        /**
         * Show the error messages.
         *
         * @method showErrors
         * @public
         * @return void
         */
        showErrors = function (str, callback) {
            treeviewModal.find('.msg')
                         .html('<i class="icon-error"></i>' + str)
                         .removeClass(hideClass);
            if ($.isFunction(callback)) {
                callback();
            }
        };

        /**
         * Show treeview modal.
         *
         * @method show
         * @public
         * @return void
         */
        show = function () {
            scroller    = null;
            currentPath = '';
            result = {
                'action'       : '',
                'selectedData' : [],
                'createdData'  : []
            };
            treeview.jstree('refresh').jstree('deselect_all');
            treeviewModal.find('.msg').addClass(hideClass);
            treeviewModal.find('.modal-footer .btn').prop('disabled', true);
            treeviewModal.modal('show');
        };

        /**
         * Hide treeview modal.
         *
         * @method hide
         * @public
         * @return void
         */
        hide = function () {
            treeviewModal.modal('hide');
        };

        /**
         * Initialize treeview modal.
         */
        (function () {
            var defaults,
                treeviewConfig,
                createDirBtnSelector;

            defaults = {
                gid           : 0,
                isDirMulti    : false,
                isFileMulti   : false,
                isDirOnly     : false,
                isCreateDir   : false,
                isShow        : false,
                title         : 'Treeview',
                subtitle      : '',
                dsec          : '',
                buttonLabel   : 'Ok',
                callback      : function () {},
                langs         : {
                    'treeview-empty_main_msg'         : 'Oops, sorry! This folder is empty.',
                    'treeview-empty_msg'              : 'Please choose another way to publish, or go to Cabinet to upload files.',
                    'treeview-pick_dir_msg'           : 'The folder you create is required to be inside my workspace or any selected groups.',
                    'treeview-dir_name_empty_msg'     : 'Please enter the folder name.',
                    'treeview-dir_name_beginning_msg' : 'The album name can not begin with the "." character.',
                    'treeview-dir_name_illegal_msg'   : 'These characters cannot be used in album names : \\ / : * ? " < > |',
                    'treeview-dir_name_too_long_msg'  : 'The folder name is too long.',
                    'treeview-same_name_msg'          : 'The folder name you create has been existed, please enter another name.',
                    'treeview-create_dir_label'       : 'Create Folder',
                    'treeview-dir_name'               : 'New Folder'
                }
            };

            $.jstree._themes = '/filemanage/samples/libs/jstree-v.pre1.0/themes/';
            treeviewConfig = {
                'plugins': [
                    'themes', 'json_data', 'ui', 'types', 'crrm'
                ],
                'themes': {
                    'theme' : 'miii',
                    'dots'  : true,
                    'icons' : true
                },
                'ui': {
                    'selected_parent_close': 'select_parent'
                },
                // This will prevent moving or creating any other type as a root node
                'valid_children': ['group'],
                'types' : {
                    // can have files and other folders inside of it
                    'valid_children': ['group'],
                    'types': {
                        'folder': {
                            'icon': {
                                'image': folderIconSrc
                            }
                        },
                        'user-folder': {
                            'icon': {
                                'image': userFolderIconSrc
                            }
                        }
                    }
                },
                'json_data': {
                    'ajax': {
                        'url': apiFileListUrl,
                        'correct_state': true,
                        // the `data` function is executed in the instance's scope
                        // the parameter is the node being loaded
                        // (may be -1, 0, or undefined when loading the root nodes)
                        'data': function (n) {
                            if (n === -1) {
                                isInitialQuery = true;
                                if (config.gid) {
                                    return {
                                        'gid'        : config.gid,
                                        'dironly'    : config.isDirOnly ? 1 : 0,
                                        'permission' : config.isCreateDir ? 2 : 1, // permission 1: viewable, permission 2: uploadable.
                                        'format'     : 'jstree',
                                    };
                                } else {
                                    return {
                                        'permission' : config.isCreateDir ? 2 : 1,
                                        'format'     : 'jstree',
                                        'dironly'    : config.isDirOnly ? 1 : 0
                                    };
                                }
                            } else {
                                isInitialQuery = false;
                                return {
                                    'gid'        : n.attr('data-gid'),
                                    'path'       : n.attr('data-path'),
                                    'dironly'    : config.isDirOnly ? 1 : 0,
                                    'permission' : config.isCreateDir ? 2 : 1,
                                    'format'     : 'jstree'
                                };
                            }
                        },
                        'success': function (data) {
                            if (isInitialQuery) {
                                if (data.length > 0) {
                                    treeviewModal.find('.outer-content').removeClass(hideClass);
                                } else {
                                    treeviewModal.find('.empty').removeClass(hideClass);
                                }
                            }
                        }
                    }
                }
            };

            config = $.extend(defaults, opts);
            if (opts.langs) {
                config.langs = $.extend(defaults.langs, opts.langs);
            }
            defaultDirName = config.langs['treeview-dir_name'];

            // Plug checkbox in.
            if (config.isDirMulti || config.isFileMulti) {
                treeviewConfig.plugins.push('checkbox');
                // If set to true all selection will be handled by checkboxes.
                // The checkbox plugin will map UI's get_selected function to its own get_checked function and overwrite the UI reselect function.
                // It will also disable the select_node, deselect_node and deselect_all functions.
                //$.extend(treeviewConfig, {'checkbox': {'override_ui': true}});
            }

            // Create treeview modal.
            createModal();

            // Create treeview.
            treeview = $('#'+treeviewId).jstree(treeviewConfig);

            // Bind event load_node.jstree to hide checkboxes of directories.
            treeview.bind('load_node.jstree', handleLoad);

            // Bind event select_node.jstree to open the directories to load children selectors.
            treeview.bind('select_node.jstree', handleSelect);
            // Bind event change_state.jstree to click on the checkbox.
            treeview.bind('change_state.jstree', handleChangeState);

            // Set title, subtitle, description, and button label.
            if (config.title) {
                treeviewModal.find('.modal-header h3').html(config.title);
            }
            if (config.subtitle) {
                treeviewModal.find('.outer-content h4').html(config.subtitle);
            }
            if (config.desc) {
                treeviewModal.find('.outer-content .desc').html(config.desc);
            }
            if (config.buttonLabel) {
                treeviewModal.find('.modal-footer .btn').text(config.buttonLabel);
            }

            // Show the button of create directory.
            // Bind event to create directory.
            createDirBtnSelector = treeviewModal.find('.outer-content .btn');
            if (config.isCreateDir) {
                createDirBtnSelector.removeClass(hideClass);
                createDirBtnSelector.on('click', handleCreateDir);
                treeview.bind('create.jstree', handleCreate);
            }

            // Bind event to the ok button.
            treeviewModal.find('.modal-footer .btn').on('click', handleOk);

            // Bind event to the modal when the modal is hidden.
            treeviewModal.bind('hidden', function () {
                if (!result.action) {
                    result.action = 'close';
                }
                if ($.isFunction(config.callback)) {
                    config.callback(result);
                }
            });

            if (config.isShow) {
                show();
            }
        })();

        this.reset    = reset;
        this.show     = show;
        this.hide     = hide;
        this.showErrors = showErrors;
    };
})(jQuery);

