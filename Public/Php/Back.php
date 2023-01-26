<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    require_once 'Functions.php';
	
	if (preg_array_key_exists('/HistoryIndex|UserId|ProjectId/', $_POST) && is_numeric($_POST['HistoryIndex']) && is_numeric($_POST['UserId']) && is_numeric($_POST['ProjectId'])) {
	
		require_once 'DbSettings.php';
		
		require_once 'Worker.php';
		
		$DB = new DBWORKER($dbu['host'], $dbu['db'], 'utf8', $dbu['user'], $dbu['pass']);
    	
		$DBQ = new DBWORKER($dbu['host'], 'koksarea_hot' . $_POST['ProjectId'], 'utf8', $dbu['user'], $dbu['pass']);
		
		logger('Back');
		
		if (isset($_POST['Separate']) && $_POST['Separate'] == true) {
			
			$NextSeparateIndex = $_POST['SeparateIndex'] - 1;//'` WHERE `QSI` = :StateIndex AND `QName` LIKE "%!_' . $NextSeparateIndex . '" ESCAPE "!"'
			
			$HD = $DBQ -> prep('SELECT `QName`, `QResponse` FROM `u' . $_POST['UserId'] . '` WHERE `QSI` = :StateIndex', array('StateIndex' => $_POST['StateIndex'])) -> fetchAll(PDO :: FETCH_ASSOC);
			
			if ($HD) foreach ($HD as $data) $HistoryData[$data['QName']] = $data['QResponse'];
			
			echo json_encode(array('Action' => 'Separate', 'Ident' => 'Back', 'RuleData' => RuleData($_POST['StateIndex'], $_POST['UserId']), 'SeparateIndex' => $NextSeparateIndex, 'HistoryData' => $HistoryData, 'Reload' => true));
			
		} else {

			if (isset($_POST['JournalIndex'])) $HD = $DBQ -> prep('SELECT `QName`, `QResponse` FROM `u' . $_POST['UserId'] . '` WHERE `QSI` = :qsi AND `Journal` = :Journal', array('qsi' => $_POST['HistoryIndex'], 'Journal' => $_POST['JournalIndex'])) -> fetchAll(PDO :: FETCH_ASSOC);
				
			else $HD = $DBQ -> prep('SELECT `QName`, `QResponse` FROM `u' . $_POST['UserId'] . '` WHERE `QSI` = :qsi', array('qsi' => $_POST['HistoryIndex'])) -> fetchAll(PDO :: FETCH_ASSOC);
			
			$HistoryData = array();
		
			foreach ($HD as $data) $HistoryData[$data['QName']] = $data['QResponse'];

			echo json_encode(array('Q' => GetQ($_POST['HistoryIndex']), 'Action' => 'Resume', 'Ident' => 'Back', 'StateIndex' => $_POST['HistoryIndex'], 'SeparateIndex' => $_POST['SeparateIndex'], 'RuleData' => RuleData($_POST['HistoryIndex'], $_POST['UserId']), 'HistoryData' => $HistoryData, 'Uid' => $_POST['UserId'], 'Reload' => true));
			
		}

	}
	
}

?>