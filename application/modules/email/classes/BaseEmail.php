<?php

namespace email\classes;

/**
 * Image CMS
 * Module Wishlist
 * @property \Wishlist_model $wishlist_model
 * @property \DX_Auth $dx_auth
 * @property \CI_URI $uri
 * @property \CI_DB_active_record $db
 * @property \CI_Input $input
 */
class BaseEmail extends \email\classes\ParentEmail {

    public function __construct() {
        parent::__construct();
    }

    public function create($params = array()) {
        if (parent::create($params = array())) {
            if ($_POST) {
                $data['name'] = $this->input->post('mail_name');
                $data['from'] = $this->input->post('sender_name');
                $data['from_email'] = $this->input->post('from_email');
                $data['theme'] = $this->input->post('mail_theme');
                $data['type'] = $this->input->post('mail_type');
                $data['user_message'] = $this->input->post('userMailText');
                $data['user_message_active'] = $this->input->post('userMailTextRadio');
                $data['admin_message'] = $this->input->post('adminMailText');
                $data['admin_message_active'] = $this->input->post('adminMailTextRadio');
                $data['description'] = $this->input->post('mail_desc');
                $this->email_model->create($data);
            } else {
                $this->email_model->create($this->data_model);
            }
        } else {
            showMessage($this->errors);
        }
    }

    public function edit($id, $params = array()) {
        if (parent::edit($id, $params = array())) {
            if ($_POST) {
                $data['from'] = $this->input->post('sender_name');
                $data['from_email'] = $this->input->post('from_email');
                $data['theme'] = $this->input->post('mail_theme');
                $data['type'] = $this->input->post('mail_type');
                $data['user_message'] = $this->input->post('userMailText');
                $data['user_message_active'] = $this->input->post('userMailTextRadio');
                $data['admin_message'] = $this->input->post('adminMailText');
                $data['admin_message_active'] = $this->input->post('adminMailTextRadio');
                $data['description'] = $this->input->post('mail_desc');
                $data['descriptiasdasdon'] = $this->input->post('mail_desc');

                $this->email_model->edit($id, $data);
            } else {
                $this->email_model->edit($id, $this->data_model);
            }
        } else {
            showMessage($this->errors);
        }
    }

    /**
     * send email
     * @param string $send_to
     * @param string $patern_name
     * @return type
     */
    public function sendEmail($send_to, $patern_name) {
        if (parent::sendEmail($send_to, $patern_name)) {
            return TRUE;
        } else {
            return $this->errors;
        }
    }

    /**
     * test email sending
     * @return string
     */
    public function mailTest() {
        $this->from = $this->input->post('from');
        $this->from_email = $this->input->post('from_email');
        $this->send_to = $this->input->post('send_to');
        $this->theme = $this->input->post('theme');
        $this->port = $this->input->post('port');
        $this->protocol = $this->input->post('protocol');
        $this->mailpath = $this->input->post('mailpath');
        $this->type = 'text';
        $config = array('port' => $this->port, 'protocol' => $this->protocol, 'mailpath' => $this->mailpath, 'type' => $this->type);

        return parent::mailTest($config);
    }

}
