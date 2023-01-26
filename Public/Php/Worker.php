<?php

function GetBaseData($data) {
	
	global $DBQ;
	
	$BaseData = $DBQ -> prep('SELECT `Auth_1`' . ($data == 2 ? ', `Auth_2`' : '') . ' FROM `scheme_authorization`') -> fetchAll(PDO :: FETCH_NUM);
	
	$Result = array('FieldName' => array(), 'FieldData' => array());

	foreach ($BaseData as $Key => $Val) if ($Key > 0) {

		if (! array_key_exists($Val[0], $Result['FieldData'])) $Result['FieldData'][$Val[0]] = array();
	
		if ($data == 2 && ! in_array($Val[1], $Result['FieldData'][$Val[0]])) array_push($Result['FieldData'][$Val[0]], $Val[1]);

	} else {
				
		$Result['FieldName'][0] = $Val[0];
				
		if ($data == 2) $Result['FieldName'][1] = $Val[1];
				
	}

	return $Result;
	
}

function NewUser() {
	
	global $_POST;
	
	global $DBQ;
	
	global $_SERVER;
	
	if ($_POST['AuthType'] == '1' && isset($_POST['Limit']) && $_POST['Limit'] == true) {
		
		$LoginData = explode(',', $_POST['AuthData']);
		
		$BaseData = $DBQ -> prep('SELECT * FROM `scheme_authorization` WHERE (`Auth_1` = "' . $LoginData[0] . '"' . (count($LoginData) > 1 ? ' AND `Auth_2` = "' . trim($LoginData[1]) . '")': ')') . ' OR `Id` = 1') -> fetchAll(PDO :: FETCH_ASSOC);
		
		if (count($BaseData) < 2) {
			
			return 'Denied';
			
			die();
			
		}
		
		$LimitData = $DBQ -> prep('SELECT * FROM `scheme_limit` WHERE `scheme_limit`.`StateIndex` = 0 AND `scheme_limit`.`Disabled` IS NULL') -> fetchAll(PDO :: FETCH_ASSOC);
		
		$ViewData = isset($_POST['View']) ? (array) json_decode($_POST['View']) : false;
		
		if (isset($BaseData[0]['Data_1'])) {
			
			$QueryString = '';
			
			$QueryData = array();
			
			$InsertData = array();
			
			$HunterData = array();
			
			foreach($BaseData[0] as $Key => $Val) {
				
				if (! Preg_match('/Id|Auth_1|Auth_2/', $Key)) {
					
					$FieldName = $Val;
					
					$FieldValue = $BaseData[1][$Key];

					$QueryString = '(:' . $Key . '_name, :' . $Key . '_val, 0)';
					
					array_push($QueryData, $QueryString);
					
					$InsertData[$Key . '_name'] = $FieldName;
					
					$InsertData[$Key . '_val'] = $FieldValue;
					
					$HunterData[$FieldName] = $FieldValue;
		
				}
				
			}
			
			foreach ($LimitData as $LD) {
						
				$QNData = explode(',', $LD['QN']);

				$TargetData = explode(',', $LD['Target']);
				
				$HIT = true;
				
				for ($i = 0; $i < count($QNData); $i ++) if ($HunterData[$QNData[$i]] != $TargetData[$i]) {
						
					$HIT = false;
						
					break;
						
				}

				if ($HIT && $LD['Contains'] >= $LD['Limiting']) {
					
					return 'Limit';
					
					die();
					
				}
				
			}
			
			if ($ViewData != false && count($ViewData)) {
				
				$ColumnData = array();
				
				$UpdateArray = array();
				
				foreach ($ViewData as $VD) {

					array_push($ColumnData, 'ADD COLUMN IF NOT EXISTS `' . $VD . '` VARCHAR(255) NULL');
					
					foreach($BaseData[0] as $Key => $Val) if (! Preg_match('/Id/', $Key) && $VD == $Val) array_push($UpdateArray, '`' . $VD . '` = "' . $BaseData[1][$Key] . '"');
	
				}

			}

		}
		
	}
	
	$Hash = isset($_POST['AuthHash']) ? hash('sha256', $_POST['AuthHash'] . 'mrs.Maysel') : false;

	$Data = array('LoginData' => $_POST['AuthData'], 'UserAgent' => $_SERVER['HTTP_USER_AGENT']);

	if ($Hash) $Data['LoginHash'] = $Hash;
	
	$NewId = $DBQ -> prep('INSERT INTO `scheme_users` (`LoginData`' . ($Hash ? ', `LoginHash`' : '') . ', `UserAgent`, `Status`) VALUES (:LoginData' . ($Hash ? ', :LoginHash' : '') . ', :UserAgent, 1)', $Data);
	
	if (isset($ColumnData) && count($ColumnData)) {
		
		$DBQ -> prep('ALTER TABLE `scheme_users` ' . implode(',', $ColumnData));
		
		$a = $DBQ -> prep('UPDATE `scheme_users` SET ' . implode(', ', $UpdateArray) . ' WHERE `Id` = ' . $NewId);
		
	}
	
	$DBQ -> prep('CREATE TABLE u' . $NewId . ' (QName VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY, QResponse TEXT NOT NULL, QSI SMALLINT(5) NULL, Journal SMALLINT(5) NULL, TimeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB');

	// Запись допполей из базы ------------------------------------------------------------------------------------------------------

	if ($_POST['AuthType'] == '1') {
		
		//$UserLogin = $DBQ -> prep('SELECT `LoginData` FROM `scheme_users` WHERE `Id` = :UserId', array('UserId' => $_POST['UserId'])) -> fetch(PDO :: FETCH_ASSOC);
		
		$LoginData = explode(',', $_POST['AuthData']);
		
		$BaseData = $DBQ -> prep('SELECT * FROM `scheme_authorization` WHERE (`Auth_1` = "' . $LoginData[0] . '"' . (count($LoginData) > 1 ? ' AND `Auth_2` = "' . trim($LoginData[1]) . '")': ')') . ' OR `Id` = 1') -> fetchAll(PDO :: FETCH_ASSOC);
		
		if (isset($BaseData[0]['Data_1'])) {
			
			$QueryString = '';
			
			$QueryData = array();
			
			$InsertData = array();
			
			foreach($BaseData[0] as $Key => $Val) {
				
				if (! Preg_match('/Id|Auth_1|Auth_2/', $Key)) {
					
					$FieldName = $Val;
					
					$FieldValue = $BaseData[1][$Key];
					
					$QueryString = '(:' . $Key . '_name, :' . $Key . '_val, 0)';
					
					array_push($QueryData, $QueryString);
					
					$InsertData[$Key . '_name'] = $FieldName;
					
					$InsertData[$Key . '_val'] = $FieldValue;
		
				}
				
			}

			$a = $DBQ -> prep('INSERT INTO `u' . $NewId . '` (`QName`, `QResponse`, `QSI`) VALUES ' . implode(',', $QueryData) . ' ON DUPLICATE KEY UPDATE QResponse = VALUES(QResponse), QSI = VALUES(QSI), TimeStamp = CURRENT_TIMESTAMP', $InsertData);
			
		}
		
	}

	return $NewId;
	
}

function RuleData($StateIndex, $Uid) {
	
	global $DBQ;
	
	global $_POST;

	$Rules = $DBQ -> prep('SELECT `scheme_rules`.* FROM `scheme_rules` WHERE `Event` != "DIRECT" AND `Event` != "FORK" AND `Disabled` IS NULL AND `StateIndex` =' . $StateIndex) -> fetchAll(PDO :: FETCH_ASSOC);
		
	if (count($Rules)) { // строки визуальных правил
	
		$Result = array();
	
		$ResponseData = array();

		foreach($Rules as $Rule) { // Rule - строка визуальных правил
		
			$TriggerData = explode(',', $Rule['TriggerVar']);

			$ResponseData = $DBQ -> prep('SELECT `QName`, `QResponse`, `QSI` FROM `u' . $Uid . '` WHERE `QName` = "' . implode('" OR `QName` = "', $TriggerData) . '" OR `QName` LIKE "' . implode('!_%" ESCAPE "!" OR `QName` LIKE "', $TriggerData) . '!_%" ESCAPE "!"') -> fetchAll(PDO :: FETCH_ASSOC);

			if (! preg_match('/L1|L2|L3/', $Rule['Event']) && count($ResponseData) > 0) {
			
				$QData = $DBQ -> prep('SELECT `L1Title`, `L2Title`, `INodeType` FROM `scheme_questions` WHERE `Id` = ' . $ResponseData[0]['QSI']) -> fetch(PDO :: FETCH_ASSOC);
				
				if ($QData['INodeType'] == 'radio' || $QData['INodeType'] == 'checkbox') {
					
					foreach($ResponseData as $RDK => $RD) {
				
						$TableData = $QData['L2Title'] ? explode('|', $QData['L2Title']) : explode('|', $QData['L1Title']);
						
						$RD['QRaw'] = $RD['QResponse'];
						
						preg_match('/(^\d+)-.*/', $RD['QResponse'], $Matches);
						
						$Offset = count($Matches) > 0 ? $Matches[1] - 1 : $RD['QResponse'] - 1;
		
						$RD['QResponse'] = $TableData[$Offset];
						
						$ResponseData[$RDK]['QRaw'] = $RD['QRaw'];
						
						$ResponseData[$RDK]['QResponse'] = $RD['QResponse'];
					
					}

				}
			
			} else if (count($TriggerData) > 1 && count($ResponseData) > 1) {
				
				$RDA = array();
				
				foreach($ResponseData as $RD) $RDA = array_merge($RDA, explode(',', $RD['QResponse']));
				
				$ResponseData = array(array('QResponse' => implode(',', array_unique($RDA))));

			}

			if (count($ResponseData) > 0) {

				$Result[$Rule['TriggerVar']] = array('Event' => $Rule['Event'], 'Action' => $Rule['Action'], 'Target' => $Rule['TargetData'], 'Equation' => $Rule['Equation'], 'Operation' => $Rule['Operation'], 'ResponseData' => $ResponseData);
				
				$ResponseData = array();
			
			}

		}
		
		return count($Result) ? $Result : false;

	} else return false;

}

function GetQ($index) {
	
	global $DBQ; 

	$a = $DBQ -> prep('SELECT * FROM `scheme_questions` WHERE `scheme_questions`.`Id` = :index', array('index' =>  $index)) -> fetch(PDO :: FETCH_ASSOC);
	
	if (isset($a['L2Title']) && preg_match('/^\[content\](.+)$/', $a['L2Title'], $FN)) {
					
		$FileName = '../../ContentData/' . $FN[1];
		
		if (file_exists($FileName)) {
		
			$lines = file_get_contents($FileName);
			
			$a['L2Title'] = $lines;
	
		}
		
	}

	return $a;
	
}

?>