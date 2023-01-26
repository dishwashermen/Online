<?php

// Запись квот ------------------------------------------------------------------------------------------------------------------

if ($UserStatus == 3 && $_POST['ProjectLimiting'] == '1') {
	
	$LimitData = $DBQ -> prep('SELECT * FROM `scheme_limit` WHERE `scheme_limit`.`Disabled` IS NULL') -> fetchAll(PDO :: FETCH_ASSOC);

	$LimitIndex = $DBQ -> prep('SELECT `StateIndex` FROM `scheme_limit` GROUP BY `StateIndex`') -> fetchAll(PDO :: FETCH_NUM);

	$LimitIndexData = array_map('reset', $LimitIndex);

	$WorkData = $DBQ -> prep('SELECT `QName`, `QResponse` FROM `u' . $_POST['UserId'] . '` WHERE `QSI` = ' . implode(' OR `QSI` = ', $LimitIndexData)) -> fetchAll(PDO :: FETCH_ASSOC);

	$UR = array();

	foreach ($WorkData as $WD) $UR[$WD['QName']] = $WD['QResponse'];

	foreach ($LimitData as $LD) {

		$QNData = explode(',', $LD['QN']);
		
		$TargetData = explode(',', $LD['Target']);
		
		$HIT = true;
		
		for ($i = 0; $i < count($QNData); $i ++) {
			
			if ($UR[$QNData[$i]] != $TargetData[$i]) {
				
				$HIT = false;
				
				break;
				
			}
			
		}
		
		if ($HIT) {
			
			// Увеличение лимита на единицу -------------------------------------------------------------------------------------
			
			$DBQ -> prep('UPDATE `scheme_limit` SET `scheme_limit`.`Contains` = ' . ($LD['Contains'] + 1) . ' WHERE `scheme_limit`.`Id` = :Id', array('Id' => $LD['Id']));
			
			// ------------------------------------------------------------------------------------------------------------------
			
			// Добавление Ид строки лимита в таблицу ----------------------------------------------------------------------------
			
			array_push($LimitedHIT, $LD['Id']);
			
			// ------------------------------------------------------------------------------------------------------------------
			
		}
		
	}
	
}

// ------------------------------------------------------------------------------------------------------------------------------

?>