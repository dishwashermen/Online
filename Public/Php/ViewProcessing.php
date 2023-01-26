<?php 

if ($ViewContent) {
	
	$ColumnName = array();
	
	$UpdateArray = array();
	
	$ValueArray = array();
	
	$ColumnData = array();
	
	$Index = 0;
	
	foreach ($ViewContent as $VK => $VV) {
		
		$Index ++;

		array_push($ColumnData, 'ADD COLUMN IF NOT EXISTS `' . $VK . '` VARCHAR(255) NULL');
		
		array_push($UpdateArray, '`' . $VK . '` = :d' . $Index);
		
		array_push($ColumnName, $VK);

		$ValueArray[':d' . $Index] = $VV;
		
	}
	
	if (count($ColumnData)) $DBQ -> prep('ALTER TABLE `scheme_users` ' . implode(',', $ColumnData));
	
	$Data = array_merge(array('Uid' => $_POST['UserId']), $ValueArray);

	$a = $DBQ -> prep('UPDATE `scheme_users` SET ' . implode(', ', $UpdateArray) . ' WHERE `Id` = :Uid', $Data);
	
}

?>