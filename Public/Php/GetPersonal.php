<?php 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	require_once 'Functions.php';
	
	if (count($_POST) == 1 && isset($_POST['Hash']) && strlen($_POST['Hash']) > 0 && strlen($_POST['Hash']) <= 10) {
		
		require_once 'DbSettings.php';
		
		require_once 'Worker.php';
		
		$DB = new DBWORKER($dbu['host'], $dbu['db'], 'utf8', $dbu['user'], $dbu['pass']);
		
		$Project = $DB -> prep('SELECT `projects`.* FROM `projects` WHERE `projects`.`AuthType` = "personal" AND `projects`.`mode` = "ON"') -> fetch(PDO :: FETCH_ASSOC);
		
		if ($Project) {
			
			$DBQ = new DBWORKER($dbu['host'], 'koksarea_hot' . $Project['id'], 'utf8', $dbu['user'], $dbu['pass']);
			
			$PersonalData = $DBQ -> prep('SELECT `scheme_personal`.`Hash` FROM `scheme_personal` WHERE `scheme_personal`.`MData` = "' . md5($_POST['Hash']) . '"') -> fetch(PDO :: FETCH_ASSOC);
			
			if ($PersonalData) {
			
				$RulesData = $DBQ -> prep('SELECT `scheme_rules`.`Id`, `scheme_rules`.`StateIndex`, `scheme_rules`.`Event` FROM `scheme_rules` WHERE `Disabled` IS NULL AND `scheme_rules`.`Event` != ""') -> fetchAll(PDO :: FETCH_ASSOC);
				
				$Rules = [];
				
				if ($RulesData) foreach ($RulesData as $RV) if (! isset($Rules[$RV['Event']]) || ! in_array($RV['StateIndex'], $Rules[$RV['Event']])) $Rules[$RV['Event']][] = $RV['StateIndex'];
				
				$UserData = $DB -> prep('SELECT `users`.* FROM `users` WHERE `users`.`prid` = :ProjectId AND `users`.`data1` = :data1', array('ProjectId' => $Project['id'], 'data1' => $PersonalData['Hash'])) -> fetch(PDO :: FETCH_ASSOC);
				
				if ($UserData) {
					
					logger('Login', $UserData['id'], false);
					
					echo json_encode(array('Q' => GetQ($UserData['StateIndex']), 'Action' => 'Personal', 'RuleData' => RuleData($UserData['StateIndex'], $UserData['id']), 'Uid' => $UserData['id'], 'StateIndex' => $UserData['StateIndex'], 'HistoryState' => $UserData['HistoryState'], 'Reload' => false, 'UserStatus' => $UserData['Status'], 'JournalIndex' => $UserData['JournalIndex'], 'Project' => $Project, 'Rules' => (count($Rules) ? $Rules : false)));
					
				} else {
					
					$Uid = NewUser($Project['id'], $PersonalData['Hash']);
					
					logger('Create user', $Uid);
					
					echo json_encode(array('Q' => GetQ(1), 'Action' => 'Personal', 'Uid' => $Uid, 'StateIndex' => 1, 'JournalIndex' => 1, 'Reload' => false, 'Project' => $Project, 'Rules' => (count($Rules) ? $Rules : false)));
					
				}
				
			} else echo json_encode(array('Action' => 'Reject')); 
			
		} else echo json_encode(array('Action' => 'Reject')); 
		
	}
	
}

?>