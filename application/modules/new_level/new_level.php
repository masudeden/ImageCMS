<?php

(defined('BASEPATH')) OR exit('No direct script access allowed');

/**
 * Image CMS
 * Module Frame
 */
class New_level extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('new_level_model');
    }

    public function index() {
        
    }

    public function autoload() {

    }

    public function OPI($model) {
        \CMSFactory\assetManager::create()
                ->setData('product', $model)
                ->render('one_product_item', TRUE);
    }
    
    public function getPropertyTypes($property_id){
        return $this->new_level_model->getPropertyTypes($property_id);
    }

    public function _install() {

        $this->load->dbforge();

        $fields = array(
            'id' => array(
                'type' => 'INT',
                'auto_increment' => TRUE
            ),
            'property_id' => array(
                'type' => 'INT',
                'constraint' => '11',
                'null' => FALSE
            ),
            'name' => array(
                'type' => 'INT',
                'constraint' => '11',
                'null' => FALSE
            ),
            'type' => array(
                'type' => 'VARCHAR',
                'constraint' => '500',
                'null' => FALSE
            )
        );


        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('mod_new_level_product_properties_types');
        
        
        $fields = array(
            'category_id' => array('type' => 'VARCHAR', 'constraint' => 500),
            'column' => array('type' => 'INT', 'constraint' => 4, 'default' => 0)
        );

        $this->dbforge->add_field($fields);
        $this->dbforge->create_table('mod_new_level_columns', TRUE);
        

        $this->db
                ->where('identif', 'new_level')
                ->update('components', array(
                    'settings' => serialize(
                            array(
                                'propertiesTypes' => array('scroll', 'full', 'dropDown'),
                                'columns' => array('1', '2', '3', '4')
                            )
                    ),
                    'enabled' => 1,
                    'autoload' => 1
        ));


        $this->db->where('name', 'new_level')
                ->update('components', array('autoload' => '1', 'enabled' => '1'));
    }

    public function _deinstall() {
        $this->load->dbforge();
        $this->dbforge->drop_table('mod_new_level_product_properties_types');
        
        $this->dbforge->drop_table('mod_new_level_columns');
    }

}

/* End of file sample_module.php */