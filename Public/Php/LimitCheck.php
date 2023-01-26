<?php

$LimitData = $DBQ -> prep('SELECT * FROM `scheme_limit` WHERE `scheme_limit`.`StateIndex` = :StateIndex AND `scheme_limit`.`Disabled` IS NULL', array('StateIndex' => $_POST['StateIndex'])) -> fetchAll(PDO :: FETCH_ASSOC);

foreach ($LimitData as $LD) {
	
	$QNData = explode(',', $LD['QN']);
	
	$TargetData = explode(',', $LD['Target']);
	
	$HIT = true;
	
	for ($i = 0; $i < count($QNData); $i ++) {
		
		if ($_POST[$QNData[$i]] != $TargetData[$i]) {
			
			$HIT = false;
			
			break;
			
		}
		
	}
		
	if ($HIT && $LD['Contains'] >= $LD['Limiting']) {
		
		$QData = $DBQ -> prep('SELECT * FROM `scheme_questions` WHERE `scheme_questions`.`Id` = :StateIndex', array('StateIndex' => $_POST['StateIndex'])) -> fetch(PDO :: FETCH_ASSOC);
		
		$QInputTypeData = explode('|', $QData['INodeType']);
		
		$VarData = [];
		
		for ($i = 0; $i < count($QNData); $i ++) {
			
			$QNIndexData = explode('.', $QNData[$i]);
			
			$InpitType = count($QInputTypeData) > 1 ? $QInputTypeData[$QNIndexData[1] - 1] : $QInputTypeData[0];
			
			switch ($InpitType) {
				
				case 'select':
				
					$InputData = explode('|', $QData['IData']);
					
					$NameData = count($InputData) > 1 ? explode('*', $InputData[$QNIndexData[1] - 1]) : explode('*', $InputData[0]);
				
				break;
				
				default:
				
					if ($QData['IData'] != null) {
						
						$InputData = explode('|', $QData['IData']);
						
						$NameData = count($InputData) > 1 ? explode('*', $InputData[$QNIndexData[1] - 1]) : explode('*', $InputData[0]);
						
					} else $NameData = explode('|', $QData['L1Title']);

				break;
				
			}
			
			array_push($VarData, $NameData[$TargetData[$i] - 1]);
			
		}
		
		if (isset($LD['Note'])) {
			
			foreach($VarData as $VDV) $LD['Note'] = str_replace_once('$', $VDV, $LD['Note']);
			
			$LimitText = $LD['Note'];
			
		} else $LimitText = 'Квота ' . implode('/', $VarData) . ' выполнена';
		
		$Limited = true;
		
		$nextIndex = $_POST['Total'];
		
		break;
		
	}
	
}

?>