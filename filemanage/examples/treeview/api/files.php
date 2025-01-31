<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Files API
 */
class Files extends Base_Controller {

    const PERMISSION_VIEW = 1;
    const PERMISSION_UPLOAD = 2;

    public $storage_default_path;

    function __construct()
    {
        parent::__construct();
        $this->storage_default_path = $this->config->item('storage_default_path');

        $lang = $this->load->get_var('lang');
        $this->lang->load('miiicloud_files', $lang);
        $this->load->model(array('files_model', 'userlog_model'));
    }

    /**
     *  getFileList
     *  getFileList?gid=0
     *  getFileList?gid=0&path=/sub
     *  getFileList?gid=0&dironly=1
     *  getFileList?gid=0&permission=[1|2] // 1: viewable, 2: uploadable
     */
    public function getFileList()
    {
        $gid = $this->input->get_post('gid');
        if ($gid === FALSE)
        {
            // list all groups (by permission)
            $permission = $this->input->get_post('permission');
            $file_list = $this->_get_group_list($permission);
            $access_full_path = '';
        }
        else
        {
            // check permission
            $this->_check_group_permission();
            $access_full_path = $this->_get_access_full_path();
            $sortby           = $this->input->get_post('sortby') ?: '+name';
            $file_list        = $this->files_model->get_file_list($access_full_path, $sortby);
        }

        $format = $this->input->get_post('format');
        if ($format === 'jstree')
        {
            //$path = '/' . trim($this->input->get_post('path') ?: '', '/');
            $path    = $this->input->get_post('path');
            $path    = $path ? $path : '';
            $dironly = $this->input->get_post('dironly');
            $tree    = array();
            foreach ($file_list as $file)
            {
                if ($dironly && $file['type'] === Files_model::FILE_TYPE_FILE)
                {
                    continue;
                }
                // Give different directory icons based directories.
                $is_my_workspace = 0;
                if ($gid)
                {
                    $is_my_workspace = $this->_is_my_workspace($gid);
                }
                else
                {
                    $is_my_workspace = $this->_is_my_workspace($file['gid']);
                }
                $access_full_subpath = $access_full_path .'/'. $file['name'];

                $data_path = $file['type'] === Files_model::FILE_TYPE_FOLDER ? $path . '/' . $file['name'] : $path;
                if ($gid !== FALSE && $path === '' && $file['type'] === Files_model::FILE_TYPE_FOLDER)
                {
                    $file['show_name'] = $this->files_model->get_system_folder_name($file['name']);
                }
                $tree[] = array(
                    'data' => array(
                        'title' => isset($file['show_name']) ? $file['show_name'] : $file['name'],
                        'attr'  => array(
                            'href'  => '#',
                        ),
                    ),
                    'attr' => array(
                        'data-name' => $file['name'],
                        'data-gid'  => $gid === FALSE ? $file['gid'] : $gid,
                        'data-path' => $gid === FALSE ? '' : $data_path,
                        'data-size' => $file['size'],
                        'data-crumb'=> $file['type'] == Files_model::FILE_TYPE_FOLDER ? $this->login->get_crumb($access_full_subpath) : '',
                        'class'     => $file['type'] == Files_model::FILE_TYPE_FOLDER ? 'folder' : 'file',
                        'rel'       => $is_my_workspace ? 'user-folder' : 'folder',
                    ),
                    'state' => $file['type'] == Files_model::FILE_TYPE_FOLDER ? 'closed' : '',
                );
            }
            $this->_outputJSON($tree);
        }

        $resp['status'] = 'ok';
        $resp['errno'] = $resp['errmsg'] = '';
        $resp['list'] = $file_list;
        $this->_outputJSON($resp);
    }

    public function getFreeSpace()
    {
        // check permission
        $this->_check_group_permission();

        $data['group_role'] = $this->_get_group_permission();
        if ($data['group_role'] >= Groups_model::ROLE_VIEWER)
        {
            $output = array(
                'status' => 'fail',
                'errmsg' => lang('miiicloud-common-access_denied'),
            );
            $this->_outputJSON($output);
        }

        $this->load->library('FolderQuota');
        try
        {
            $folder_name = $this->_get_group_name();
            $ugc_folder_path = $this->config->item('storage_default_path') .'/'. $folder_name;
            $quota_info = $this->folderquota->get_quota($ugc_folder_path);

            if (isset($quota_info['quota']) && $quota_info['quota'] == 0)
            {
                $free_space = -1;
            }
            else
            {
                $free_space = max(0, $quota_info['quota'] - $quota_info['used']);
            }
            $output = array(
                'status' => 'ok',
                'freeSpace' => $free_space,
            );
            $this->_outputJSON($output);
        }
        catch(Exception $e)
        {
            log_message('error', $e->getMessage());
            $output = array(
                'status' => 'fail',
                'errmsg' => $e->getMessage(),
            );
            $this->_outputJSON($output);
        }
    }

    /**
     * uploadFile?gid=-1    # tmp file, gen token for future validation
     * uploadFile?gid=0     # personal folder
     * uploadFile?gid=1     # specified group
     * uploadFile?gid=1&path=/subfolder
     */
    public function uploadFile()
    {
        $gid = $this->input->get_post('gid');
        if ($gid === '-1')
        {
            $rtn = $this->files_model->upload_tmp_file();
            $this->_outputJSON($rtn);
        }

        // upload to specified folder

        // get free space
        $free_space_in_kb = 0;
        $this->load->library('FolderQuota');
        try
        {
            $folder_name     = $this->_get_group_name();
            $ugc_folder_path = $this->storage_default_path .'/'. $folder_name;
            $quota_info      = $this->folderquota->get_quota($ugc_folder_path);
            if (isset($quota_info['quota']) && $quota_info['quota'] != 0 && isset($quota_info['used']))
            {
                $free_space_in_mb = $quota_info['quota'] - $quota_info['used'];
                if ($free_space_in_mb < 1)
                {
                    $output = array(
                        'status' => 'fail',
                        'errmsg' => lang('miiicloud-files-quota_exceeded'),
                    );
                    $this->_outputJSON($output);
                }
                $free_space_in_kb = $free_space_in_mb * 1024;
            }
        }
        catch(Exception $e)
        {
            log_message('error', $e->getMessage());
        }

        // check permission
        $this->_check_group_permission();

        $access_full_path = $this->_get_access_full_path();
        $rtn              = $this->files_model->upload_file($access_full_path, $free_space_in_kb);

        // insert userlog
        if (isset($rtn['status']) && $rtn['status'] == 'ok')
        {
            if (substr($gid, 0, 1) === 's')
            {
                $b36_sid     = substr($gid, 1);
                $share       = $this->login->get_share_access($b36_sid);
                $gid         = $share['gid'];
                $folder_name = $share['name'];
            }
            else
            {
                $folder_name = $this->login->get_group_name($gid);
            }
            $user = $this->login->get_user();
            $this->userlog_model->insert(
                $user['id'],
                $user['name'],
                Userlog_model::FILE_UPLOAD,
                $gid,
                $folder_name,
                $rtn['inode'],
                $access_full_path .'/'. $rtn['filename']
            );
        }

        $this->_outputJSON($rtn);
    }

    /**
     * saveFile?gid=1&path=/subfolder&new=1
     */
    public function saveFile()
    {
        // check permission
        $this->_check_group_permission();

        $this->_check_path_crumb();

        $gid             = $this->input->get_post('gid');
        $new             = $this->input->get_post('new');
        $filename        = $_POST['filename-input'];
        $content         = $_POST['content'];

        $access_full_path = $this->_get_access_full_path();
        $filename_html = $filename . ".html";

        $rtn = $this->files_model->save_file($gid, $access_full_path, $filename_html, $content, $new);
        $this->_insert_userlog(Userlog_model::FILE_SAVE);
        $this->_outputJSON($rtn);
    }


    public function uploadNotify()
    {
        // check permission
        $this->_check_group_permission();

        // check crumb
        $this->_check_path_crumb();

        // check data
        $num = $this->input->get_post('num');
        if ($num === FALSE || $num < 0)
        {
            $output = array(
                'status' => 'fail',
                'errmsg' => lang('miiicloud-common-access_denied'),
            );
            $this->_outputJSON($output);
        }

        $this->load->model('messages_model');
        $gid                 = $this->input->get_post('gid');
        $path                = $this->_get_path();
        $cabinet_folder_name = $this->_is_my_workspace($gid) ? lang('miiicloud-common-functions_my_files') : lang('miiicloud-common-functions_files');
        $folder = ($path === FALSE || $path === '') ? $cabinet_folder_name : $this->files_model->get_utf8_basename($path);
        if (substr_count($path, '/') === 1)
        {
            $folder = $this->files_model->get_system_folder_name($folder);
        }
        $params = array(
            'n' => $num,
            'folder' => '<a href="/files?gid='. $gid .'&path='. urlencode($path) .'">'. htmlspecialchars($folder) .'</a>'
        );
        $content = lang('miiicloud-files-upload_message', null, $params);

        $user = $this->load->get_var('user_session');
        $insert_id = $this->messages_model->add($user['id'], $gid, $content);

        if ($insert_id)
        {
            $output = array(
                'status' => 'ok',
            );
            $this->_outputJSON($output);
        }
        $output = array(
            'status' => 'fail',
            'status' => 'Can not insert message data.',
        );
        $this->_outputJSON($output);
    }

    // create folder
    public function createFolder()
    {
        // check permission
        $this->_check_group_permission();

        // check crumb
        $this->_check_path_crumb();

        // check folder name
        $filename = $this->input->get_post('filename');
        if ( ! $this->files_model->is_valid_folder_name($filename))
        {
            $rtn = array(
                'status' => 'fail',
                'errmsg' => lang('miiicloud-files-invalid_folder_name'),
            );
            $this->_outputJSON($rtn);
        }

        $access_full_path     = $this->_get_access_full_path();
        $access_full_filename = $access_full_path . '/' . $filename;
        $desc                 = $this->input->get_post('desc');
        $rtn                  = $this->files_model->create_folder($access_full_filename, $desc);
        $rtn['crumb']         = $this->login->get_crumb($access_full_filename);
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest')
        {
            $this->_outputJSON($rtn);
        }

        // success, redirect to new folder
        if (isset($rtn['status']) && $rtn['status'] == 'ok')
        {
            // insert userlog
            $this->_insert_userlog(Userlog_model::FILE_CREATE);

            $current_path = $this->_get_path();
            $new_path = $current_path . '/' . $filename;
            $subfolder_url = '/files?' . $this->files_model->build_query_string(array('path' => $new_path));
            header('Location: ' . $subfolder_url);
            exit;
        }

        // failed, redirect to original folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    /**
     * getFile
     *
     * api/file/getFile/dummy.jpg?alt=cover&file_path=
     * api/file/getFile/dummy.jpg
     * api/file/getFile/dummy.jpg?alt=ts
     * api/file/getFile/dummy.jpg?alt=tl
     * api/file/getFile/dummy.jpg?alt=desc
     * api/file/getFile/dummy.jpg?alt=h1369818155
     */
    public function getFile()
    {
        // check permission
        $this->_check_group_permission();

        $access_full_path = $this->_get_access_full_path();
        $filename         = $this->input->get_post('filename');
        $alt              = $this->input->get_post('alt');

        // insert userlog
        if (empty($alt))
        {
            $this->_insert_userlog(Userlog_model::FILE_PREVIEW);
        }

        if ($this->files_model->is_document($filename))
        {
            header('Location: /files/preview?'. $_SERVER['QUERY_STRING']);
            return;
        }
        if ($this->files_model->is_extension($filename, 'nes'))
        {
            header('Location: /files/jsnes?'. $_SERVER['QUERY_STRING']);
            return;
        }
        if ( ! $this->files_model->is_browser_viewable($filename))
        {
            header('Location: /files/show_download?'. $_SERVER['QUERY_STRING']);
            return;
        }

        $this->files_model->get_file($access_full_path, $filename, $alt);
    }

    /**
     * downloadFiles?gid= &path= &filenames= &targetname=
     */
    public function downloadFiles()
    {
        // check permission
        $this->_check_group_permission();

        $access_full_path = $this->_get_access_full_path();
        $filenames        = $this->input->get_post('filenames');
        $filenames_arr    = json_decode($filenames);
        $targetname       = $this->input->get_post('targetname');

        // insert userlog
        $gid = $this->input->get_post('gid');
        if (substr($gid, 0, 1) === 's')
        {
            $b36_sid = substr($gid, 1);
            $share = $this->login->get_share_access($b36_sid);
            $gid = $share['gid'];
            $folder_name = $share['name'];
        }
        else
        {
            $folder_name = $this->login->get_group_name($gid);
        }
        if (count($filenames_arr) == 1)
        {
            $fileinode = $this->files_model->fileinode($access_full_path .'/'. $filenames_arr[0]);
            $target = str_replace('/'. $folder_name, '', $access_full_path, $cnt = 1) .'/'. $filenames_arr[0];
            $details = '';
        }
        else
        {
            $fileinode = 0;
            $target = $this->files_model->get_utf8_basename($access_full_path) . '.zip';
            $details = $filenames;
        }
        $user = $this->login->get_user();
        $this->userlog_model->insert(
            $user['id'],
            $user['name'],
            Userlog_model::FILE_DOWNLOAD,
            $gid,
            $folder_name,
            $fileinode,
            $target,
            $details
        );

        $this->files_model->download_files($access_full_path, $filenames_arr, $targetname);
    }

    /**
     * downloadFileById?fid= &tok=
     */
    public function downloadFileById()
    {
        $fid = $this->input->get_post('fid');
        if ($fid === FALSE || $fid === '')
        {
            show_404();
        }

        // check token
        $tok = $this->input->get_post('tok');
        if ( ! $this->login->validate_crumb($tok, $fid))
        {
            $this->_outputCrubmErrorJSON();
        }

        // read db
        $this->load->model('groups_model');
        $file = $this->files_model->db_get($fid);
        if ($file === FALSE)
        {
            show_404();
        }

        $folder_name      = $this->groups_model->get_group_name($file['gid']);
        $path             = '/' . trim($file['path'], '/');
        $path             = $path === '/' ? '' : $path;
        $access_full_path = '/' . $folder_name . $path;
        $filenames_arr    = array($file['filename']);
        $this->files_model->download_files($access_full_path, $filenames_arr);
    }

    /**
     * getFileById?fid= &tok=
     */
    public function getFileById()
    {
        $fid = $this->input->get_post('fid');
        if ($fid === FALSE || $fid === '')
        {
            show_404();
        }

        // check token
        $tok = $this->input->get_post('tok');
        if ( ! $this->login->validate_crumb($tok, $fid))
        {
            $this->_outputCrubmErrorJSON();
        }

        // read db
        $this->load->model('groups_model');
        $file = $this->files_model->db_get($fid);
        if ($file === FALSE)
        {
            // load resources
            $lang = $this->load->get_var('lang');
            $this->lang->load('miiicloud_notices', $lang);
            $title   = lang('miiicloud-notices-title_oops');
            $message = lang('miiicloud-notices-has_been_deleted', NULL, array('icon' => '<i class="icon-warning-sign"></i>'));
            $options = array(
                'show_masthead' => FALSE,
                'show_my_workspace' => FALSE,
            );
            $this->load->model('notices_model');
            $this->notices_model->show($title, $message, $options);
        }

        // doc preview
        if ($this->files_model->is_document($file['filename']))
        {
            $query = array_merge($file, array('fid' => $fid, 'tok' => $tok));
            header('Location: /files/preview?'. http_build_query($query));
            return;
        }

        // jsnes
        if ($this->files_model->is_extension($file['filename'], 'nes'))
        {
            $query = array_merge($file, array('fid' => $fid, 'tok' => $tok));
            header('Location: /files/jsnes?'. http_build_query($query));
            return;
        }

        // show download
        if ( ! $this->files_model->is_browser_viewable($file['filename']))
        {
            $query = array_merge($file, array('fid' => $fid, 'tok' => $tok));
            header('Location: /files/show_download?'. http_build_query($query));
            return;
        }


        $folder_name = $this->groups_model->get_group_name($file['gid']);
        $path = '/' . trim($file['path'], '/');
        $path = $path === '/' ? '' : $path;
        $access_full_path = '/' . $folder_name . $path;
        $alt = $this->input->get_post('alt');
        $this->files_model->get_file($access_full_path, $file['filename'], $alt);
    }

    public function deleteFiles()
    {
        // check permission
        $this->_check_group_permission();

        // check crumb
        $this->_check_path_crumb();

        // insert userlog
        $this->_insert_userlog(Userlog_model::FILE_DELETE);

        $access_full_path = $this->_get_access_full_path();
        $filenames        = $this->input->get_post('filenames');
        $filenames_arr    = json_decode($filenames);
        $rtn              = $this->files_model->delete_files($access_full_path, $filenames_arr);
        $format           = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    public function restoreFiles()
    {
        // check permission
        $this->_check_group_permission();

        // check crumb
        $this->_check_path_crumb();

        $access_full_path = $this->_get_access_full_path();
        $ts               = $this->input->get_post('ts');
        $rtn              = $this->files_model->restore_files($access_full_path, $ts);
        $format           = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    public function renameFile()
    {
        // check permission
        $this->_check_group_permission();

        // check crumb
        $this->_check_path_crumb();

        // insert userlog
        $new_filename = $this->input->get_post('new_filename');
        $details      = lang('miiicloud-files-userlog_rename_to', NULL, array('filename' => $new_filename));
        $this->_insert_userlog(Userlog_model::FILE_RENAME, $details);

        $access_full_path = $this->_get_access_full_path();
        $filename         = $this->input->get_post('filename');
        $rtn              = $this->files_model->rename_file($access_full_path, $filename, $new_filename);
        $format           = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    public function updateDesc()
    {
        // check permission
        $this->_check_group_permission();

        // check crumb
        $this->_check_path_crumb();

        // insert userlog
        $this->_insert_userlog(Userlog_model::FILE_UPDATE_DESC);

        $filename             = $this->input->get_post('filename');
        $access_full_path     = $this->_get_access_full_path();
        $access_full_filename = $access_full_path . '/' . $filename;
        $desc                 = $this->input->get_post('desc');
        $rtn                  = $this->files_model->update_desc($access_full_filename, $desc);

        $format = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $output = array(
                'status' => $rtn === FALSE ? 'fail' : 'ok',
            );
            $this->_outputJSON($output);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    /**
     * copyFilesTo?gid= &path= &filenames= &to_gid= &to_path=
     */
    public function copyFilesTo()
    {
        // check 'FROM' permission
        $from_gid = $this->input->get_post('gid') ?: '-1';
        if ( ! $this->_is_group_viewer($from_gid))
        {
            $this->_outputPermissionDeniedJSON();
            return;
        }
        // check 'TO' permission
        $to_gid = $this->input->get_post('to_gid') ?: '-1';
        if ( ! $this->_is_group_editor($to_gid))
        {
            $this->_outputPermissionDeniedJSON();
            return;
        }

        // check crumb
        $this->_check_path_crumb();

        // insert userlog
        $to_access_full_path = $this->_get_access_full_path($to_gid, $this->_get_path('to_path'));
        $details             = lang('miiicloud-files-userlog_copy_to', NULL, array('path' => $to_access_full_path));
        $this->_insert_userlog(Userlog_model::FILE_COPY, $details);

        $from_access_full_path = $this->_get_access_full_path();
        $filenames             = $this->input->get_post('filenames');
        $filenames_arr         = json_decode($filenames);
        $rtn                   = $this->files_model->copy_files_to($from_access_full_path, $to_access_full_path, $filenames_arr);
        $format                = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    public function moveFilesTo()
    {
        // check 'FROM' permission
        $from_gid = $this->input->get_post('gid') ?: '-1';
        if ( ! $this->_is_group_editor($from_gid))
        {
            $this->_outputPermissionDeniedJSON();
            return;
        }
        // check 'TO' permission
        $to_gid = $this->input->get_post('to_gid') ?: '-1';
        if ( ! $this->_is_group_editor($to_gid))
        {
            $this->_outputPermissionDeniedJSON();
            return;
        }

        // check crumb
        $this->_check_path_crumb();

        // insert userlog
        $to_access_full_path = $this->_get_access_full_path($to_gid, $this->_get_path('to_path'));
        $details             = lang('miiicloud-files-userlog_move_to', NULL, array('path' => $to_access_full_path));
        $this->_insert_userlog(Userlog_model::FILE_MOVE, $details);

        $from_access_full_path = $this->_get_access_full_path();
        $filenames             = $this->input->get_post('filenames');
        $filenames_arr         = json_decode($filenames);
        $rtn                   = $this->files_model->move_files_to($from_access_full_path, $to_access_full_path, $filenames_arr);
        $format                = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    /**
     * pin File
     */
    public function pinFile()
    {
        // check permission
        $gid = $this->input->get_post('gid') ?: '-1';
        if ( ! $this->_is_group_owner($gid))
        {
            $this->_outputPermissionDeniedJSON();
            return;
        }

        // check crumb
        $this->_check_path_crumb();

        // insert userlog
        $this->_insert_userlog(Userlog_model::FILE_PIN);

        $access_full_path = $this->_get_access_full_path();
        $filename = $this->input->get_post('filename');
        $access_full_filename = $access_full_path . '/' . $filename;
        $rtn = $this->files_model->pin_file($access_full_filename);
        $format = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to folder
        $folder_url = '/files?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    /**
     * unpin Files
     * unpinFiles?fid[]= &fid[]= &fid[]=
     */
    public function unpinFiles()
    {
        // check permission
        $gid = $this->input->get_post('gid') ?: '-1';
        if ( ! $this->_is_group_owner($gid))
        {
            $this->_outputPermissionDeniedJSON();
            return;
        }

        $crumb = $this->input->get_post('crumb');
        if ( ! $this->login->validate_crumb($crumb, 'unpinFiles'))
        {
            $format = $this->input->get_post('format');
            if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
            {
                $this->_outputCrubmErrorJSON();
            }
            show_error('Token invalid!', 403);
        }

        $fids = $this->input->get_post('fid');
        $rtn = $this->files_model->unpin_files($gid, $fids);
        $format = $this->input->get_post('format');
        if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
        {
            $this->_outputJSON($rtn);
        }

        // return to pin list
        $folder_url = '/files/pins?' . $this->files_model->build_query_string();
        header('Location: ' . $folder_url);
    }

    /**
     * search files
     * searchFiles?q=*&sortby=*
     */
    public function searchFiles()
    {
        $q              = $this->input->get_post('q');
        $sortby         = $this->input->get_post('sortby') ?: '+name';

        $data['status'] = 'ok';
        $data['errno']  = $data['errmsg'] = '';
        $data['q']      = trim($q);
        $data['count']  = 0;
        $data['list']   = array();
        if ( ! empty($data['q']))
        {
            $all_group_names = $this->login->get_all_group_names(TRUE);
            $all_group_name_arr = array_keys($all_group_names);
            if ($search_result = $this->files_model->search($q, $all_group_name_arr, $sortby))
            {
                $data['count'] = $search_result['count'];
                foreach ($search_result['files'] as &$file)
                {
                    $file['gid'] = $all_group_names[$file['folder_name']];
                }
                $data['list'] = $search_result['files'];
            }
        }
        $this->_outputJSON($data);
    }
    /**
    * encode image and return base64.
    *
    */
    public function encodeImage()
    {
        if (!(($_FILES["file-select"]["type"] == "image/gif")
            || ($_FILES["file-select"]["type"] == "image/jpeg")
            || ($_FILES["file-select"]["type"] == "image/jpg")
            || ($_FILES["file-select"]["type"] == "image/pjpeg")
            || ($_FILES["file-select"]["type"] == "image/x-png")
            || ($_FILES["file-select"]["type"] == "image/png")))
        {
            $data['status'] = 'fail';
            $data['msg'] = lang('miiicloud-files-file_type_error');
            echo json_encode($data);
            return;
        }
        $size = $_FILES["file-select"]["size"] / 1024;
        if ($_FILES["file-select"]["error"] > 0)
        {
            $data['status'] = 'fail';
            $data['msg'] = $_FILES["file-select"]["error"];
        }
        else if (intval($size)> 100000000)
        {
            $data['status'] = 'fail';
            $data['msg'] = lang('miiicloud-files-image_too_large');
        }
        else
        {
            $content        = file_get_contents($_FILES["file-select"]["tmp_name"]);
            $base64         = 'data:' . $_FILES["file-select"]["type"] . ';base64,' . base64_encode($content);
            $data['status'] = 'ok';
            $data['type']   = $_FILES["file-select"]["type"];
            $data['name']   = $_FILES["file-select"]["name"];
            $data['base64'] = $base64;
            $data['size']   = $size;
        }
        echo json_encode($data);
    }


    /**
     * @return [array] [upload image validation rule]
     */
    private function _upload_valid_rule($filename, $upload_path)
    {
        if (empty($filename) || empty($upload_path))
        {
            return FALSE;
        }

        $rule = array(
            'file_name' => $filename,
            'upload_path' => $upload_path,
            'allowed_types' => 'jpg|png|jpeg|gif',
            'max_size' => 1024 * 5,
            'max_width' => '2000',
            'max_height' => '2000',
        );
        return $rule;
    }

    /**
     * Get Group List as File List
     */
    private function _get_group_list($permission = self::PERMISSION_VIEW)
    {
        $group_list = $this->login->get_group_list();
        $user       = $this->login->get_user();
        $this->load->model('groups_model');

        $rtn = array();
        foreach ($group_list as $gid => $group)
        {
            if ($permission == self::PERMISSION_UPLOAD && $group['role'] == Groups_model::ROLE_VIEWER)
            {
                continue;
            }

            $group_folder = array(
                'gid'       => $gid,
                'ext'       => '',
                'name'      => $group['name'],
                'show_name' => $group['name'],
                'size'      => 0,
                'mtime'     => time(),
                'type'      => 2,
                'desc'      => '',
                'thumb_s'   => 0,
                'thumb_l'   => 0,
                'role'      => $group['role'],
            );
            if (isset($group['uid']) && $group['uid'] == $user['id'])
            {
                $group_folder['rel'] = 'user-folder';
                $group_folder['show_name'] = lang('miiicloud-common-functions_my_files');
            }
            $rtn[] = $group_folder;
        }
        return $rtn;
    }

    private function _check_path_crumb()
    {
        $access_full_path = $this->_get_access_full_path();
        $crumb            = $this->input->get_post('crumb');
        if ( ! $this->login->validate_crumb($crumb, $access_full_path))
        {
            $format = $this->input->get_post('format');
            if ($format == 'json' || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'))
            {
                $this->_outputCrubmErrorJSON();
            }
            show_error('Token invalid!', 403);
        }
        return TRUE;
    }

    private function _outputCrubmErrorJSON()
    {
        $output = array(
            'status' => 'fail',
            'errmsg' => lang('miiicloud-common-token_invalid'),
        );
        $this->_outputJSON($output);
    }

    private function _outputPermissionDeniedJSON()
    {
        $output = array(
            'status' => 'fail',
            'errmsg' => lang('miiicloud-common-access_denied'),
        );
        $this->_outputJSON($output);
    }

    private function _insert_userlog($action, $details = '')
    {
        $user = $this->login->get_user();
        $gid = $this->input->get_post('gid');
        if (substr($gid, 0, 1) === 's')
        {
            $b36_sid = substr($gid, 1);
            $share = $this->login->get_share_access($b36_sid);
            $gid = $share['gid'];
            $folder_name = $share['name'];
        }
        else
        {
            $folder_name = $this->login->get_group_name($gid);
        }

        $access_full_path = $this->_get_access_full_path();
        $filename = $this->input->get_post('filename');
        $filenames = $this->input->get_post('filenames');
        if ($filename !== FALSE && $filename !== '')
        {

            // single file operation
            $access_full_filename = $access_full_path . '/' . $filename;

            if ( ! $this->files_model->file_exists($access_full_filename))
            {
                log_message('ERROR', 'Insert userlog, file not exists: '. $access_full_filename);
                return;
            }
            $fileinode = $this->files_model->fileinode($access_full_filename);
            $this->userlog_model->insert(
                $user['id'],
                $user['name'],
                $action,
                $gid,
                $folder_name,
                $fileinode,
                $access_full_filename,
                $details
            );
        }
        else if ($filenames !== FALSE && $filenames !== '')
        {
            // multi files operation
            $filenames_arr = json_decode($filenames);
            foreach ($filenames_arr as $filename)
            {
                $access_full_filename = $access_full_path .'/'. $filename;
                if ( ! $this->files_model->file_exists($access_full_filename))
                {
                    log_message('ERROR', 'Insert userlog, file not exists: '. $access_full_filename);
                    continue;
                }
                $fileinode = $this->files_model->fileinode($access_full_filename);
                $this->userlog_model->insert(
                    $user['id'],
                    $user['name'],
                    $action,
                    $gid,
                    $folder_name,
                    $fileinode,
                    $access_full_filename,
                    $details
                );
            }
        }
    }

}
