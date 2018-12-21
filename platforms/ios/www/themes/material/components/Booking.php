<?php

class Booking extends DataObject{
	private static $db = array(
		'Name' => 'Varchar(150)',
		'Address' => 'Varchar(100)',
		'City' => 'Varchar(100)',
		'State' => 'Varchar',
	);

	private static $defaults = array(
		
	);
	private static $has_one = array(
		
	);

	private static $has_many = array(
		'Rooms' => 'Room',
		'Owner' => 'Member'
	);

	public function canCreate($member = null) {
		return Permission::check('ADMIN');
     }

	static $summary_fields = array(
		'Name',
	);
	static $api_access = true;
	
	
	
	/*static $searchable_fields = array(
    //"DistrictID",
    );*/ 
    
	// public function getCMSFields()
	// {
	//     $fields = parent::getCMSFields();
	// 	$fields->removeFieldFromTab("Root.Main","DistrictCommanderPhoto");
	// 	$fields->removeFieldFromTab("Root.Main","Title");
	// 	$fields->removeFieldFromTab("Root.Main","DistrictHeadQuatersLatLng");
	// 	$fields->addFieldToTab('Root.Main', new UploadField('DistrictCommanderPhoto','Captain Photo'),'DistrictCommanderBio');
	// 	$n = $this->DistrictID;
	// 	$p = PSA::get()->filter(array('DistrictID'=>$n));
	// 	$config = new GridFieldConfig_RelationEditor();
	// 	$toolbox2 = GridField::create('PSA',false, $p, $config);
	// 	$fields->addFieldToTab('Root.DistrictPSAs', $toolbox2);
	// 	return $fields;
	// }

}
